# Where is the Base URL of API?

## Quick Answer

The API base URLs for the vGuard application are located in multiple places:

### 🎯 **Current API Base URLs:**

**Production (Live):**
```
https://vgurad-backend.onrender.com
```

**Local Development:**
```
http://localhost:5001
```

### 📍 **Where to Find API URLs:**

#### 1. **Centralized Configuration** (Recommended)
- **File**: `frontend/src/config/api.ts`
- **Usage**: Import and use throughout the application
```typescript
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
```

#### 2. **Backend Server Configuration**
- **File**: `backend/src/app.ts`
- **Port**: Configurable via `PORT` environment variable (default: 5001)
```typescript
const PORT = process.env.PORT || 5001;
```

#### 3. **Frontend Components** (Legacy - being phased out)
Currently hardcoded in 15+ components:
- `frontend/src/components/CropScanner.tsx`
- `frontend/src/components/ChatScreen.tsx`
- `frontend/src/components/ExpertHelp.tsx`
- And 12 more files...

### 🚀 **API Endpoints Structure**

All API endpoints follow this pattern:
```
{BASE_URL}/api/{endpoint}
```

Examples:
- `https://vgurad-backend.onrender.com/api/diseases`
- `https://vgurad-backend.onrender.com/api/experts`
- `https://vgurad-backend.onrender.com/api/crop-analysis/predict`

### 🛠️ **Environment Configuration**

#### Backend Environment Variables
Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

#### Frontend Environment Variables (Optional)
Create `frontend/.env`:
```env
VITE_NODE_ENV=development
```

### 📖 **Complete Documentation**

For detailed information, see:
- [`API_CONFIGURATION.md`](./API_CONFIGURATION.md) - Complete API documentation
- [`frontend/src/config/api.ts`](./frontend/src/config/api.ts) - Centralized configuration
- [`frontend/src/config/api-examples.ts`](./frontend/src/config/api-examples.ts) - Usage examples

### 🔄 **Migration Status**

We are migrating from hardcoded URLs to centralized configuration:

**Before:**
```typescript
// ❌ Hardcoded in each component
const response = await fetch('https://vgurad-backend.onrender.com/api/experts');
```

**After:**
```typescript
// ✅ Centralized configuration
import { API_ENDPOINTS } from '@/config/api';
const response = await fetch(API_ENDPOINTS.experts);
```

### 🧪 **Testing API Endpoints**

```bash
# Test production API
curl https://vgurad-backend.onrender.com/test

# Test local development API
curl http://localhost:5001/test
```

---

**Summary**: The main API base URL is `https://vgurad-backend.onrender.com` for production and `http://localhost:5001` for development. These are now centralized in `frontend/src/config/api.ts` for better maintainability.