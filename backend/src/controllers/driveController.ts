import { Request, Response, NextFunction } from 'express';
import Drive from '../models/Drive';
import Application from '../models/Application';
import Notification from '../models/Notification';
import StudentProfile from '../models/StudentProfile';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

// ─── GET /api/drives (Public — only published drives) ─────────────────────────
export const getDrives = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      domain,
      company,
      search,
      sortBy = 'deadline',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = { approvalStatus: 'published' };
    if (domain) filter.domain = domain;
    if (company) filter.companyName = new RegExp(company as string, 'i');
    if (search) {
      filter.$or = [
        { companyName: new RegExp(search as string, 'i') },
        { role: new RegExp(search as string, 'i') },
      ];
    }

    // Filter by student eligibility if authenticated
    if (req.user?.role === 'student') {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile) {
        filter.minCgpa = { $lte: profile.cgpa };
        filter.maxBacklogs = { $gte: profile.activeBacklogs };
        filter.$or = [
          { allowedBranches: profile.department },
          { allowedBranches: { $size: 0 } }, // drives open to all branches
        ];
      }
    }

    const total = await Drive.countDocuments(filter);
    const drives = await Drive.find(filter)
      .sort({ [sortBy as string]: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    // Attach student-specific application status if authenticated
    let userApplicationMap: Record<string, string> = {};
    if (req.user?.role === 'student') {
      const apps = await Application.find({ studentId: req.user._id }).lean();
      apps.forEach((app) => {
        userApplicationMap[app.driveId.toString()] = app.status;
      });
    }

    const drivesWithStatus = drives.map((d) => ({
      ...d,
      userStatus: userApplicationMap[d._id?.toString() || ''] || null,
    }));

    sendPaginated(res, drivesWithStatus, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/drives/:id ──────────────────────────────────────────────────────
export const getDriveById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.id,
      approvalStatus: 'published',
    });
    if (!drive) throw new AppError('Drive not found', 404);

    let userApp = null;
    if (req.user?.role === 'student') {
      userApp = await Application.findOne({ driveId: drive._id, studentId: req.user._id });
    }

    sendSuccess(res, { drive, application: userApp });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/drives/:id/interest ───────────────────────────────────────────
export const expressInterest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) throw new AppError('Drive not found', 404);
    if (drive.approvalStatus !== 'published') throw new AppError('Drive is not open', 400);

    // Check deadline
    if (new Date() > drive.deadline) {
      throw new AppError('Drive deadline has passed', 400);
    }

    // Upsert application (set to interested)
    const application = await Application.findOneAndUpdate(
      { driveId: drive._id, studentId: req.user!._id },
      {
        $setOnInsert: {
          driveId: drive._id,
          studentId: req.user!._id,
          status: 'interested',
          expressedInterestAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // Update interest count on drive
    await Drive.findByIdAndUpdate(drive._id, { $inc: { interestCount: 1 } });

    // Create notification
    await Notification.create({
      userId: req.user!._id,
      type: 'interest_acknowledged',
      title: 'Interest Registered!',
      message: `Your interest in ${drive.companyName} — ${drive.role} has been registered. The placement cell will be notified.`,
      relatedId: drive._id,
      relatedType: 'drive',
      actionUrl: `/drives/${drive._id}`,
      priority: 'medium',
    });

    sendSuccess(res, application, 'Interest expressed successfully');
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/drives/:id/bookmark ───────────────────────────────────────────
export const bookmarkDrive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findOneAndUpdate(
      { driveId: req.params.id, studentId: req.user!._id },
      [{ $set: { bookmarked: { $not: '$bookmarked' } } }], // Toggle bookmark
      { new: true, upsert: true }
    );
    const isBookmarked = application?.bookmarked ?? false;
    sendSuccess(res, { bookmarked: isBookmarked }, isBookmarked ? 'Drive bookmarked' : 'Bookmark removed');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/drives/bookmarks ────────────────────────────────────────────────
export const getBookmarkedDrives = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookmarked = await Application.find({
      studentId: req.user!._id,
      bookmarked: true,
    }).populate('driveId');
    sendSuccess(res, bookmarked.map((b) => b.driveId));
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: POST /api/admin/drives ────────────────────────────────────────────
export const createDrive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const drive = await Drive.create({ ...req.body, createdBy: req.user!._id });
    sendSuccess(res, drive, 'Drive created', 201);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: PUT /api/admin/drives/:id/status ─────────────────────────────────
export const updateDriveStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, rejectionReason } = req.body;
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status, ...(rejectionReason && { rejectionReason }) },
      { new: true }
    );
    if (!drive) throw new AppError('Drive not found', 404);

    // Notify students if published
    if (status === 'published') {
      // In production: send bulk notifications to eligible students
      console.log(`Drive "${drive.role}" at ${drive.companyName} published`);
    }

    sendSuccess(res, drive, `Drive status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: GET /api/admin/drives/:id/applications ───────────────────────────
export const getDriveApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applications = await Application.find({ driveId: req.params.id })
      .populate({ path: 'studentId', select: 'name email' })
      .lean();
    sendSuccess(res, applications);
  } catch (error) {
    next(error);
  }
};
