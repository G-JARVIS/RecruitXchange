# Developer & AI Copilot Rules

1. **Architecture Rule:** Maintain strict Separation of Concerns (MVC pattern for backend, Component/Service split for frontend).
2. **ES Modules:** Always use `import/export` syntax in Node.js backend (type: "module").
3. **Security:** Never expose sensitive fields (e.g., passwords) in API responses. Use `select('-password')`.
4. **API Responses:** Standardize all API responses using this format:
   ```json
   {
     "success": true,
     "message": "Operation successful",
     "data": {}
   }