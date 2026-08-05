Netlify deployment notes

1. Build command: npm run build
2. Publish directory: dist
3. Environment variables (Site settings > Build & deploy > Environment):
   - VITE_API_URL = https://<your-backend-host>

4. Redirects: The project includes `public/_redirects` which redirects all routes to `index.html` for SPA routing.

5. Tips:
   - Ensure your backend API is deployed and reachable from the web.
   - If you see "Page not found" on refresh, confirm `_redirects` exists in the deployed `dist` and Netlify used the proper publish directory.
   - For local testing, build locally (`npm run build`) and serve the `dist` folder with a static server (e.g., `npx serve dist`).
