# Developer & AI Copilot Standards

1. **Brand Adherence:** Strictly maintain Somaiya University branding colors (Crimson `#800000`, Warm Alabaster Cream `#FFFDD0`, Clean White `#FFFFFF`, Charcoal Dark Mode `#0F172A`).
2. **ES Modules:** Always use modern ES Module syntax (`import/export`) across frontend and backend.
3. **Role Security:** Never trust client-side role claims. Always enforce JWT role validation via backend middlewares (`protect`, `authorize('admin')`).
4. **API Standardization:** All backend controllers must send responses wrapped in:
   ```json
   {
     "success": true,
     "message": "Response description",
     "data": {}
   }