# Predict Endpoints Configuration

This document explains where the predict endpoints base URLs are configured in the vGuard application.

## 🔗 Predict Endpoints Overview

The vGuard application uses a proxy architecture for crop disease prediction. Here's the complete flow:

```
Frontend → Backend Proxy → External AI API
```

## 📍 Base URL Locations

### 1. External AI API Base URL

**Location:** `backend/src/routes/crop-analysis-proxy.routes.ts` (Line 34)
```typescript
const CROP_API_BASE_URL = 'http://kodegas-paddy-api.centralindia.cloudapp.azure.com';
```

**Purpose:** This is the ultimate destination for crop disease prediction requests. The backend proxies requests to this external AI service.

**Full Predict Endpoint:** `http://kodegas-paddy-api.centralindia.cloudapp.azure.com/predict`

### 2. Backend Proxy Configuration

**Route Registration:** `backend/src/app.ts` (Line 141)
```typescript
app.use('/api/crop-analysis', cropAnalysisProxyRoutes);
```

**Predict Route Handler:** `backend/src/routes/crop-analysis-proxy.routes.ts` (Line 37)
```typescript
router.post('/predict', handleMulterErrors, async (req: MulterRequest, res: Response) => {
  // Proxy logic to external API
});
```

**Full Backend Predict Endpoint:** `[your-backend-url]/api/crop-analysis/predict`

### 3. Frontend API Base URL

**Location:** `frontend/src/components/CropScanner.tsx` (Line 59)
```typescript
const API_BASE_URL = 'https://vgurad-backend.onrender.com/api/crop-analysis';
```

**Usage in Frontend:** (Line 96)
```typescript
const predictionResponse = await fetch(`${API_BASE_URL}/predict`, {
  method: 'POST',
  body: formData,
});
```

**Full Frontend Request URL:** `https://vgurad-backend.onrender.com/api/crop-analysis/predict`

## 🔄 Request Flow

1. **User uploads image** in the frontend (`CropScanner.tsx`)
2. **Frontend sends POST request** to `https://vgurad-backend.onrender.com/api/crop-analysis/predict`
3. **Backend proxy receives request** at `/api/crop-analysis/predict` endpoint
4. **Backend forwards request** to `http://kodegas-paddy-api.centralindia.cloudapp.azure.com/predict`
5. **External AI API processes** the image and returns prediction
6. **Backend returns result** to frontend
7. **Frontend displays** the disease prediction to user

## 🔧 Configuration Files Summary

| Component | File | Line | Configuration |
|-----------|------|------|---------------|
| External API | `backend/src/routes/crop-analysis-proxy.routes.ts` | 34 | `CROP_API_BASE_URL` |
| Backend Route | `backend/src/app.ts` | 141 | Route mounting |
| Backend Handler | `backend/src/routes/crop-analysis-proxy.routes.ts` | 37 | POST `/predict` route |
| Frontend API | `frontend/src/components/CropScanner.tsx` | 59 | `API_BASE_URL` |

## 📝 Environment Configuration

Currently, the URLs are hardcoded. For better deployment flexibility, consider using environment variables:

### Recommended Environment Variables:
- `CROP_API_BASE_URL` for the external AI API
- `VGUARD_BACKEND_URL` for the frontend API configuration

### Production vs Development:
- **Production Frontend:** `https://vgurad-backend.onrender.com/api/crop-analysis`
- **Development Backend:** Typically runs on `http://localhost:5001` (port configurable via `PORT` env variable)
- **External AI API:** `http://kodegas-paddy-api.centralindia.cloudapp.azure.com` (production)

## 🚀 Quick Reference

**To change the external AI API endpoint:**
Edit `CROP_API_BASE_URL` in `backend/src/routes/crop-analysis-proxy.routes.ts`

**To change the frontend backend URL:**
Edit `API_BASE_URL` in `frontend/src/components/CropScanner.tsx`

**To change the backend port:**
Set `PORT` environment variable (defaults to 5001)