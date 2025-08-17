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
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = __importDefault(require("./database"));
const disease_model_1 = require("./models/disease.model");
const tip_model_1 = require("./models/tip.model");
const expert_model_1 = require("./models/expert.model");
const question_model_1 = require("./models/question.model");
const product_model_1 = require("./models/product.model");
const mockProducts = [
    {
        name: 'Organic Neem Oil',
        description: 'Natural pesticide for a variety of crops.',
        category: 'organic',
        price: 1200,
        currency: 'LKR',
        dosage_instructions: 'Mix 5ml per liter of water and spray weekly.',
        seller_name: 'GreenGrow Ltd.',
        seller_contact: '+94771234567',
        seller_location: 'Colombo',
        image_url: '',
        stock_quantity: 50,
        is_approved: true,
    },
    {
        name: 'NPK Fertilizer 20-20-20',
        description: 'Balanced fertilizer for all crops.',
        category: 'fertilizers',
        price: 950,
        currency: 'LKR',
        dosage_instructions: 'Apply 50g per plant every 2 weeks.',
        seller_name: 'AgroMart',
        seller_contact: '+94772345678',
        seller_location: 'Kandy',
        image_url: '',
        stock_quantity: 100,
        is_approved: true,
    },
    {
        name: 'Copper Oxychloride',
        description: 'Fungicide for disease control.',
        category: 'pesticides',
        price: 800,
        currency: 'LKR',
        dosage_instructions: 'Mix 2g per liter of water and spray as needed.',
        seller_name: 'CropCare',
        seller_contact: '+94773456789',
        seller_location: 'Galle',
        image_url: '',
        stock_quantity: 75,
        is_approved: true,
    },
    {
        name: 'Hand Trowel',
        description: 'Durable gardening tool for planting and transplanting.',
        category: 'tools',
        price: 350,
        currency: 'LKR',
        dosage_instructions: '',
        seller_name: 'ToolHouse',
        seller_contact: '+94774567890',
        seller_location: 'Matara',
        image_url: '',
        stock_quantity: 200,
        is_approved: true,
    },
];
const mockDiseases = [
    {
        name: 'Leaf Blight',
        crop: 'Rice',
        symptoms: ['Yellow spots', 'Brown edges', 'Wilting'],
        cause: 'Fungal infection due to high humidity',
        treatment: 'Copper fungicide spray',
        prevention: 'Proper drainage, avoid overhead watering',
        severity: 'High',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Rice_blight.jpg'
    },
    {
        name: 'Powdery Mildew',
        crop: 'Tomato',
        symptoms: ['White powdery coating', 'Yellowing leaves', 'Stunted growth'],
        cause: 'Fungal spores in warm, dry conditions',
        treatment: 'Sulfur-based fungicide',
        prevention: 'Good air circulation, avoid crowding',
        severity: 'Medium',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Powdery_mildew_on_tomato.jpg'
    },
    {
        name: 'Bacterial Wilt',
        crop: 'Eggplant',
        symptoms: ['Sudden wilting', 'Yellow leaves', 'Brown stems'],
        cause: 'Bacterial infection through wounds',
        treatment: 'Remove infected plants, copper spray',
        prevention: 'Use disease-free seeds, crop rotation',
        severity: 'High',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Bacterial_wilt_eggplant.jpg'
    },
    {
        name: 'Aphid Infestation',
        crop: 'Multiple crops',
        symptoms: ['Curled leaves', 'Sticky honeydew', 'Stunted growth'],
        cause: 'Insect pest',
        treatment: 'Neem oil, insecticidal soap',
        prevention: 'Companion planting, beneficial insects',
        severity: 'Low',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Aphid_infestation.jpg'
    },
    {
        name: 'Root Rot',
        crop: 'Beans',
        symptoms: ['Yellowing', 'Wilting', 'Black roots'],
        cause: 'Overwatering, poor drainage',
        treatment: 'Improve drainage, fungicide',
        prevention: 'Proper watering, well-draining soil',
        severity: 'High',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Root_rot_beans.jpg'
    }
];
const mockTips = [
    {
        title: 'Optimal Planting Time for Rice',
        category: 'Seasonal',
        season: 'Monsoon',
        icon: 'Calendar',
        content: ['Best time to plant rice is during the monsoon season.', 'Ensure proper water management.'],
        timing: 'June - August'
    },
    {
        title: 'Pest Management for Vegetables',
        category: 'Pest Management',
        season: 'Summer',
        icon: 'Bug',
        content: ['Use neem oil to control aphids and whiteflies.', 'Regularly check for pest infestations.'],
        timing: 'March - May'
    },
    {
        title: 'Soil Care Tips',
        category: 'Soil Care',
        season: 'Year-round',
        icon: 'Thermometer',
        content: ['Test soil pH regularly.', 'Add organic matter to improve soil health.'],
        timing: 'Ongoing'
    }
];
const mockExperts = [
    {
        name: 'Dr. Priya Kumari',
        specialty: 'Plant Pathology',
        experience: '15 years',
        languages: ['English', 'Sinhala', 'Tamil'],
        rating: 4.8,
        phone: '+94-77-123-4567',
        available: true
    },
    {
        name: 'Mr. Rajan Silva',
        specialty: 'Pest Management',
        experience: '12 years',
        languages: ['Sinhala', 'English'],
        rating: 4.6,
        phone: '+94-71-234-5678',
        available: true
    },
    {
        name: 'Dr. Tamil Selvan',
        specialty: 'Soil Science',
        experience: '18 years',
        languages: ['Tamil', 'English'],
        rating: 4.9,
        phone: '+94-76-345-6789',
        available: false
    }
];
const mockQuestions = [
    {
        question: 'My rice plants are turning yellow. What should I do?',
        expert: 'Dr. Priya Kumari',
        status: 'answered',
        date: '2 days ago'
    },
    {
        question: 'How to prevent pest attacks during monsoon?',
        expert: 'Mr. Rajan Silva',
        status: 'pending',
        date: '1 day ago'
    }
];
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.default)();
    try {
        console.log('Clearing existing data...');
        yield disease_model_1.Disease.deleteMany({});
        yield tip_model_1.Tip.deleteMany({});
        yield expert_model_1.Expert.deleteMany({});
        yield question_model_1.Question.deleteMany({});
        yield product_model_1.Product.deleteMany({});
        console.log('Populating the database with mock data...');
        yield disease_model_1.Disease.insertMany(mockDiseases);
        yield tip_model_1.Tip.insertMany(mockTips);
        yield expert_model_1.Expert.insertMany(mockExperts);
        yield question_model_1.Question.insertMany(mockQuestions);
        yield product_model_1.Product.insertMany(mockProducts);
        console.log('Database seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding the database:', error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
});
seedDB();
