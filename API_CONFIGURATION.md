# API Configuration Guide

## 🌐 API Base URLs

### Current Environment URLs

#### Production
- **Base URL**: `https://vgurad-backend.onrender.com`
- **Full API URL**: `https://vgurad-backend.onrender.com/api`
- **Description**: Production API deployed on Render.com

#### Local Development  
- **Base URL**: `http://localhost:5001` (default)
- **Full API URL**: `http://localhost:5001/api`
- **Description**: Local development server
- **Port Configuration**: Configurable via `PORT` environment variable in `backend/.env`

### Backend Server Configuration

The backend server is configured in `backend/src/app.ts`:

```typescript
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### API Route Structure

All API endpoints are prefixed with `/api`:

```typescript
// API Routes mounted in backend/src/app.ts
app.use('/api/diseases', diseaseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/gemini-proxy', geminiProxyRoute);
app.use('/api/detection-results', detectionResultRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/weather-alerts', weatherAlertRoutes);
app.use('/api/crop-analysis', cropAnalysisProxyRoutes);
app.use('/api/users', verifyAndFetchUser, userRoutes);
```

## 📁 Current API URL Locations in Frontend

Currently, API base URLs are **hardcoded** in the following frontend files:

### Components with Hardcoded API URLs:
1. `frontend/src/components/ExpertHelp.tsx` - Expert and questions API calls
2. `frontend/src/components/CropScanner.tsx` - Crop analysis API calls
3. `frontend/src/components/ChatScreen.tsx` - Chat API calls  
4. `frontend/src/components/admin/ProductManager.tsx` - Product management
5. `frontend/src/components/admin/UserRoleManager.tsx` - User management
6. `frontend/src/components/admin/WeatherAlertManager.tsx` - Weather alerts
7. `frontend/src/components/ProfilePage.tsx` - User profile
8. `frontend/src/components/TreatmentCalendar.tsx` - Treatment scheduling
9. `frontend/src/components/ChatBot.tsx` - AI chatbot
10. `frontend/src/components/AuthDialog.tsx` - Authentication
11. `frontend/src/components/ProtectedRoute.tsx` - Route protection
12. `frontend/src/components/Marketplace.tsx` - Product marketplace
13. `frontend/src/components/DiseaseDatabase.tsx` - Disease information
14. `frontend/src/components/FarmerTips.tsx` - Farming tips
15. `frontend/src/components/Header.tsx` - Header component

### Example Hardcoded Usage:
```typescript
// Current approach (hardcoded)
const API_BASE_URL = 'https://vgurad-backend.onrender.com/api/crop-analysis';
const API_BASE = 'https://vgurad-backend.onrender.com';
axios.get<Expert[]>('https://vgurad-backend.onrender.com/api/experts')
```

## 🔧 Recommended Centralized Configuration

### Proposed Configuration File: `frontend/src/config/api.ts`

```typescript
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5001',
    apiURL: 'http://localhost:5001/api'
  },
  production: {
    baseURL: 'https://vgurad-backend.onrender.com',
    apiURL: 'https://vgurad-backend.onrender.com/api'
  }
};

const environment = import.meta.env.NODE_ENV || 'development';
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const API_URL = API_CONFIG[environment].apiURL;
```

### Usage Example:
```typescript
// Recommended approach (centralized)
import { API_BASE_URL, API_URL } from '@/config/api';

const response = await fetch(`${API_URL}/experts`);
const cropAnalysis = await fetch(`${API_URL}/crop-analysis/predict`);
```

## 🚀 Environment Variables (Backend)

Backend environment configuration in `backend/.env`:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=production
```

## 📋 Available API Endpoints

### Core Endpoints
- `GET /api/diseases` - List all crop diseases
- `GET /api/diseases/:id` - Get specific disease details
- `GET /api/products` - List agricultural products
- `GET /api/tips` - Get farming tips
- `GET /api/experts` - List available experts
- `POST /api/questions` - Submit questions to experts
- `GET /api/treatments` - Get treatment information
- `POST /api/detection-results` - Save disease detection results
- `GET /api/notes` - Get user notes
- `GET /api/weather-alerts` - Get weather alerts
- `GET /api/users` - User management (protected)

### AI/Proxy Endpoints
- `POST /api/gemini-proxy` - AI-powered crop analysis
- `POST /api/crop-analysis/predict` - Crop disease prediction
- `GET /api/crop-analysis/disease-info/:disease` - Disease information
- `GET /api/crop-analysis/disease-medicines` - Treatment recommendations

### Test Endpoints
- `GET /test` - API health check
- `GET /gemini` - Gemini API key verification

## 🔍 Testing API Endpoints

### Production API Test:
```bash
curl https://vgurad-backend.onrender.com/test
curl https://vgurad-backend.onrender.com/api/diseases
```

### Local API Test:
```bash
curl http://localhost:5001/test
curl http://localhost:5001/api/diseases
```

## 📝 Notes

1. **Current Issue**: API URLs are scattered across 15+ frontend files, making it difficult to change environments or update endpoints.

2. **Security**: All API endpoints currently allow CORS from all origins (`origin: true`), which should be restricted in production.

3. **Environment Detection**: Frontend currently doesn't have environment-based API URL switching.

4. **Recommendation**: Centralize API configuration and implement environment-based URL selection for better maintainability.