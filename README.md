# WeGuard: AI-Powered Crop Disease Detection and Management

WeGuard is a full-stack application designed to help farmers and agricultural professionals identify and manage crop diseases effectively. The platform leverages AI-powered image recognition to detect diseases from crop images, provides a comprehensive database of crop diseases, and offers expert advice and agricultural tips.

 

## ✨ Features

-   **AI Crop Scanner:** Upload an image of a crop to get an AI-powered analysis and disease identification.
-   **Disease Database:** A comprehensive and searchable database of crop diseases with detailed information.
-   **Expert Help:** Connect with agricultural experts to get personalized advice and solutions.
-   **Farming Tips:** A collection of tips and best practices for sustainable and effective farming.
-   **Treatment Calendar:** Schedule and manage recommended treatments to stay on top of crop health.
-   **Marketplace:** Discover and purchase essential agricultural products and tools directly through the app.
-   **Admin Dashboard:** A dedicated dashboard for administrators to manage diseases, farming tips, and expert profiles...
-   **Chat Bot:** AI power chat bot for get instance answers.
-   **Multi-language Support:** The user interface is available in multiple languages to cater to a diverse user base.
-   **3D Interactive Models:** Engaging 3D models to visualize and understand crop-related concepts.


## 🛠️ Tech Stack

### Frontend

-   **Framework:** React, Vite
-   **UI Components:** shadcn/ui, Radix UI
-   **State Management:** TanStack React Query
-   **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei
-   **Routing:** React Router
-   **Styling:** Tailwind CSS
-   **Language:** TypeScript

### Backend

-   **Framework:** Node.js, Express
-   **Database:** MongoDB, Mongoose
-   **Auth:** Firebase auth
-   **AI:** Google Generative AI (Gemini)
-   **API:** RESTful API
--   **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm
-   MongoDB instance (local or cloud)
-   Google Generative AI API Key (for AI features)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Maleesha101/vGurad_main.git
    cd vGurad_main
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```
PORT=5001
MONGODB_URI=<your_mongodb_uri>
GEMINI_API_KEY=<your_gemini_api_key>
```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```
vGurad_main/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── app.ts        # Express app setup
│   │   └── database.ts   # MongoDB connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Reusable React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   ├── translations/ # Language files
│   │   ├── App.tsx       # Main App component
│   │   └── main.tsx      # React entry point
│   └── package.json
└── README.md
```

## 📜 API Endpoints

The backend provides a RESTful API with the following endpoints:

-   `GET /api/diseases`: Get a list of all crop diseases.
-   `GET /api/diseases/:id`: Get details of a specific disease.
-   `POST /api/questions`: Submit a question to an expert.
-   `GET /api/tips`: Get a list of all farming tips.
-   `POST /api/gemini/generate`: Get AI-powered analysis of a crop image.
-   `POST /api/crop-analysis/predict`: Upload crop image for disease prediction.
-   `GET /api/crop-analysis/disease-info/:diseaseName`: Get detailed disease information.
-   `GET /api/crop-analysis/disease-medicines?name=:diseaseName`: Get medicines for a specific disease.

> **📋 Predict Endpoints Configuration:** For detailed information about predict endpoints base URLs and configuration, see [PREDICT_ENDPOINTS.md](./PREDICT_ENDPOINTS.md)

## 📦 Deployment

### Backend

1.  Build the backend:
    ```bash
    cd backend
    npm run build
    ```
2.  Start the production server:
    ```bash
    npm start
    ```

### Frontend

1.  Build the frontend:
    ```bash
    cd frontend
    npm run build
    ```
2.  Serve the `dist` directory using a static file server.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Open a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
