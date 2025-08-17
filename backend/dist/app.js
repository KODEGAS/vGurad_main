"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./database"));
const disease_routes_1 = __importDefault(require("./routes/disease.routes"));
const tip_routes_1 = __importDefault(require("./routes/tip.routes"));
const expert_routes_1 = __importDefault(require("./routes/expert.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const treatment_routes_1 = __importDefault(require("./routes/treatment.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const gemini_proxy_route_1 = __importDefault(require("./routes/gemini-proxy.route"));
const detectionResult_routes_1 = __importDefault(require("./routes/detectionResult.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const weatherAlert_routes_1 = __importDefault(require("./routes/weatherAlert.routes"));
const firebase_admin_1 = require("./firebase-admin");
const User_1 = require("./models/User");

const path_1 = __importDefault(require("path"));

dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const firebaseAdmin = firebase_admin_1.admin;
// Connect to the database
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// User role management routes
app.use('/api/users', user_routes_1.default);
// Middleware to verify Firebase ID token and fetch user profile
const verifyAndFetchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = yield firebaseAdmin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
});
// Route to create user profile after Firebase sign-up
app.post('/api/auth/create-user-profile', verifyAndFetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const firebaseUid = req.user.uid;
        const existingUser = yield User_1.userModel.findOne({ firebaseUid });
        if (existingUser) {
            // User already exists, perhaps from a previous Google sign-in
            return res.status(409).json({ message: 'User profile already exists.' });
        }
        const newUser = new User_1.userModel({
            firebaseUid,
            email,
            role: 'user', // Assign a default role
            createdAt: new Date(),
        });
        yield newUser.save();
        res.status(201).json({ message: 'User profile created successfully.', user: newUser });
    }
    catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
// GET user profile
app.get('/api/user-profile', verifyAndFetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userProfile = yield User_1.userModel.findOne({ firebaseUid: req.user.uid });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        res.json(userProfile);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
// PUT user profile (update)
app.put('/api/user-profile', verifyAndFetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { full_name, phone, location, language_preference } = req.body;
        const userProfile = yield User_1.userModel.findOne({ firebaseUid: req.user.uid });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found.' });
        }
        if (full_name !== undefined)
            userProfile.displayName = full_name;
        if (phone !== undefined)
            userProfile.phone = phone;
        if (location !== undefined)
            userProfile.location = location;
        if (language_preference !== undefined)
            userProfile.language_preference = language_preference;
        yield userProfile.save();
        res.json(userProfile);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
app.get('/test', (req, res) => res.send('API is working'));
app.get('/gemini', (req, res) => res.send(process.env.GEMINI_API_KEY || 'No API Key Found'));
// API Routes
app.use('/api/diseases', disease_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/tips', tip_routes_1.default);
app.use('/api/experts', expert_routes_1.default);
app.use('/api/questions', question_routes_1.default);
app.use('/api/treatments', treatment_routes_1.default);
app.use('/api/gemini-proxy', gemini_proxy_route_1.default);

app.use('/api/detection-results', detectionResult_routes_1.default);
app.use('/api/notes', note_routes_1.default);
app.use('/api/weather-alerts', weatherAlert_routes_1.default);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
