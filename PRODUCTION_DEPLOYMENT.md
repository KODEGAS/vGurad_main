# vGuard Production Deployment Guide

## 🚀 Production Build

### Quick Build
```bash
# For Windows PowerShell
.\build-production.ps1

# Or manually
npm run build:prod
```

### Manual Build Steps
1. **Build Backend:**
   ```bash
   cd backend
   npm install
   npm run build
   npm prune --production
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm prune --production
   ```

## 📦 Production Files

### Backend
- **Source:** `backend/src/`
- **Built:** `backend/dist/`
- **Start:** `npm run start` (runs `node dist/app.js`)

### Frontend
- **Source:** `frontend/src/`
- **Built:** `frontend/dist/`
- **Serve:** Static files in `dist/` folder

## 🏃‍♂️ Running in Production

### Start Backend Server
```bash
cd backend
npm start
```
Server runs on port 5001 (configurable via PORT env variable)

### Serve Frontend
The frontend is built as static files in `frontend/dist/`. 

**Options:**
1. **Using a static server:**
   ```bash
   cd frontend/dist
   python -m http.server 8080
   # or
   npx serve -s . -l 8080
   ```

2. **Using nginx/apache:** Point document root to `frontend/dist/`

3. **Using Node.js serve:**
   ```bash
   npm install -g serve
   serve -s frontend/dist -l 8080
   ```

## 🌍 Environment Configuration

### Backend Environment Variables
Create/update `backend/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=production
```

### Frontend Configuration
- Frontend is built for production and doesn't require runtime environment variables
- API endpoints should be configured to point to your production backend

## 🔧 Production Checklist

- [x] All test files removed
- [x] Development dependencies cleaned
- [x] Backend built to `dist/` folder
- [x] Frontend built to `dist/` folder
- [x] Environment set to production
- [x] Production build scripts created

## 📊 Build Output

### Frontend Build
- **Location:** `frontend/dist/`
- **Assets:** Minified CSS, JS, and images
- **Size:** ~2MB+ (optimized)

### Backend Build
- **Location:** `backend/dist/`
- **Files:** Compiled TypeScript to JavaScript
- **Entry:** `app.js`

## 🚀 Deployment Options

1. **Traditional Server:** Upload files and run Node.js
2. **Docker:** Create containers for frontend and backend
3. **Cloud Platforms:** Deploy to Heroku, AWS, Google Cloud, etc.
4. **Static Hosting:** Frontend to Netlify, Vercel, etc.

## 🔍 Testing Production Build

1. Start backend: `cd backend && npm start`
2. Serve frontend: `serve -s frontend/dist -l 8080`
3. Open browser: `http://localhost:8080`
4. Verify API connection to `http://localhost:5001`
