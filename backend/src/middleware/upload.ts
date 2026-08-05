import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import cloudinary from '../config/cloudinary';
import { isCloudinaryEnabled } from '../config/cloudinary';

// ─── Local Storage Fallback ───────────────────────────────────────────────────
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

// ─── Memory Storage (for Cloudinary streaming) ────────────────────────────────
const memoryStorage = multer.memoryStorage();

// ─── File Filter ──────────────────────────────────────────────────────────────
const pdfFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resume upload'));
  }
};

const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// ─── Multer Instances ─────────────────────────────────────────────────────────
export const resumeUpload = multer({
  storage: isCloudinaryEnabled ? memoryStorage : localStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const imageUpload = multer({
  storage: isCloudinaryEnabled ? memoryStorage : localStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─── Cloudinary Upload Helper ─────────────────────────────────────────────────
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  resourceType: 'raw' | 'image' | 'auto' = 'raw',
  publicId?: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    // Stream the buffer
    const streamifier = require('streamifier');
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
