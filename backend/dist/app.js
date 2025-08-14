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
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
// Connect to the database
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/diseases', disease_routes_1.default);
app.use('/api/tips', tip_routes_1.default);
app.use('/api/experts', expert_routes_1.default);
app.use('/api/questions', question_routes_1.default);
// Chat endpoint
app.post('/api/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { userPrompt, expertName } = req.body;
    if (!userPrompt) {
        return res.status(400).json({ success: false, error: 'User prompt is required.' });
    }
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ success: false, error: 'API key is not configured on the server.' });
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const chatHistory = [
        {
            role: 'user',
            parts: [
                {
                    text: `You are an agricultural expert${expertName ? ` named ${expertName}` : ''}. 
                 Respond to the user's question in a professional, empathetic, and knowledgeable manner. 
                 User's question: ${userPrompt}`
                }
            ]
        }
    ];
    try {
        const response = yield fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: chatHistory })
        });
        if (!response.ok) {
            const errorText = yield response.text();
            console.error('Gemini API returned error:', errorText);
            return res.status(response.status).json({ success: false, error: 'Gemini API call failed.' });
        }
        const result = yield response.json();
        const expertResponseText = ((_e = (_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || '';
        if (expertResponseText) {
            return res.json({ success: true, response: expertResponseText });
        }
        else {
            console.error('Unexpected Gemini API response:', JSON.stringify(result, null, 2));
            return res.status(500).json({ success: false, error: 'No valid text in Gemini response.' });
        }
    }
    catch (error) {
        console.error('Error calling Gemini API:', error);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
