import mongoose from 'mongoose';
import connectDB from './database';
import { Disease, IDisease } from './models/disease.model';
import { Tip, ITip } from './models/tip.model';
import { Expert, IExpert } from './models/expert.model';
import { Question, IQuestion } from './models/question.model';
import { Product } from './models/product.model';
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

const mockDiseases: Omit<IDisease, '_id'>[] = [

  {
    name: 'Leaf Blight',
    crop: 'Rice',
    symptoms: ['Yellow spots', 'Brown edges', 'Wilting'],
    cause: 'Fungal infection due to high humidity',
    treatment: 'Copper fungicide spray',
    prevention: 'Proper drainage, avoid overhead watering',
    severity: 'High'
  },
  {
    name: 'Powdery Mildew',
    crop: 'Tomato',
    symptoms: ['White powdery coating', 'Yellowing leaves', 'Stunted growth'],
    cause: 'Fungal spores in warm, dry conditions',
    treatment: 'Sulfur-based fungicide',
    prevention: 'Good air circulation, avoid crowding',
    severity: 'Medium'
  },
  {
    name: 'Bacterial Wilt',
    crop: 'Eggplant',
    symptoms: ['Sudden wilting', 'Yellow leaves', 'Brown stems'],
    cause: 'Bacterial infection through wounds',
    treatment: 'Remove infected plants, copper spray',
    prevention: 'Use disease-free seeds, crop rotation',
    severity: 'High'
  },
  {
    name: 'Aphid Infestation',
    crop: 'Multiple crops',
    symptoms: ['Curled leaves', 'Sticky honeydew', 'Stunted growth'],
    cause: 'Insect pest',
    treatment: 'Neem oil, insecticidal soap',
    prevention: 'Companion planting, beneficial insects',
    severity: 'Low'
  },
  {
    name: 'Root Rot',
    crop: 'Beans',
    symptoms: ['Yellowing', 'Wilting', 'Black roots'],
    cause: 'Overwatering, poor drainage',
    treatment: 'Improve drainage, fungicide',
    prevention: 'Proper watering, well-draining soil',
    severity: 'High'
  }
];

const mockTips: Omit<ITip, '_id'>[] = [
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

const mockExperts: Omit<IExpert, '_id'>[] = [
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

const mockQuestions: Omit<IQuestion, '_id'>[] = [
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


const seedDB = async () => {
  await connectDB();
  try {
    console.log('Clearing existing data...');
  await Disease.deleteMany({});
  await Tip.deleteMany({});
  await Expert.deleteMany({}); 
  await Question.deleteMany({}); 
  await Product.deleteMany({});
    
  console.log('Populating the database with mock data...');
  await Disease.insertMany(mockDiseases);
  await Tip.insertMany(mockTips);
  await Expert.insertMany(mockExperts); 
  await Question.insertMany(mockQuestions); 
  await Product.insertMany(mockProducts);
    
  console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
