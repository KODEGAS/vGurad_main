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
    severity: 'Medium',
    image_url:'https://howorchidsrebloom.com/wp-content/uploads/2019/04/P1010022-1-768x576.jpg'

  },
  {
    name: 'Bacterial Wilt',
    crop: 'Eggplant',
    symptoms: ['Sudden wilting', 'Yellow leaves', 'Brown stems'],
    cause: 'Bacterial infection through wounds',
    treatment: 'Remove infected plants, copper spray',
    prevention: 'Use disease-free seeds, crop rotation',
    severity: 'High',
    image_url: 'http://www.spchcmc.vn/FCKeditor/img/image/BSCayTrong/Thuocbenh/2020/CaTim.jpg'
  },
  {
    name: 'Aphid Infestation',
    crop: 'Multiple crops',
    symptoms: ['Curled leaves', 'Sticky honeydew', 'Stunted growth'],
    cause: 'Insect pest',
    treatment: 'Neem oil, insecticidal soap',
    prevention: 'Companion planting, beneficial insects',
    severity: 'Low',
    image_url: 'https://www.pgro.org/images/shop/more/1504x1002_1345_6d7b8a5b4add72a6ad61c89b56c5bd42_13433ab34e30c3f7bcc3cb88721e450a.jpg'
  },
  {
    name: 'Root Rot',
    crop: 'Beans',
    symptoms: ['Wilted, yellowed, or browned leaves', 'Gradual or quick decline without an obvious reason', 'Black roots'],
    cause: 'Overwatering, poor drainage',
    treatment: 'Improve drainage, fungicide',
    prevention: 'Proper watering, well-draining soil',
    severity: 'High',
    image_url:'https://drybeanagronomy.ca/wp-content/uploads/2020/11/root-rot-3-Syama-Chatterton-1200x795.jpg'
  },
  {
    name: 'Aggregate Sheath Spot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Grayish-white lesions on leaf sheaths', 'Brown to black sclerotia', 'Spreads to culms'],
    cause: 'Fungal infection (Ceratobasidium oryzae-sativae / Rhizoctonia oryzae-sativae)',
    treatment: 'Apply fungicides (e.g., azoxystrobin); remove infected debris',
    prevention: 'Use resistant varieties, reduce plant density, manage water to avoid excess moisture',
    severity: 'Medium',
    image_url: 'https://tse4.mm.bing.net/th/id/OIP.V85s2dQgH23Ppy5Oanhb2gHaCK?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Foot Rot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Dark brown to black lesions at stem base', 'Rotting of lower stem', 'Wilting in severe cases'],
    cause: 'Fungal infection (Fusarium moniliforme / Gibberella fujikuroi)',
    treatment: 'Apply fungicides (e.g., carbendazim); remove affected plants',
    prevention: 'Use certified seeds, treat seeds with fungicides, rotate crops',
    severity: 'Medium',
    image_url: 'https://tse2.mm.bing.net/th/id/OIP.FVseemBMhkloHCHlDVBUagHaEx?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Leaf Smut',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Small, black spore masses on leaves', 'Breaks open when wet and releases the black spores', 'Reduced photosynthesis'],
    cause: 'Fungal infection (Entyloma oryzae)',
    treatment: 'Apply fungicides (e.g., mancozeb); remove infected leaves',
    prevention: 'Use resistant varieties, avoid excessive nitrogen, ensure proper spacing',
    severity: 'Low',
    image_url: 'https://th.bing.com/th/id/R.83b8dcd061ac350b28563c59d89227a3?rik=hE25nvWyo3Habw&pid=ImgRaw&r=0'
  },
  {
    name: 'Sheath blight',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Yellowing seedlings', 'Root rot', 'Poor germination'],
    cause: 'Fungal infection (Multiple pathogens, e.g., Fusarium spp., Pythium spp.)',
    treatment: 'Limited; remove affected seedlings, apply fungicides',
    prevention: 'Use certified seeds, treat seeds with fungicides (e.g., thiram), ensure proper drainage',
    severity: 'Medium',
    image_url: 'https://doa.gov.lk/wp-content/uploads/2020/06/Paddy_Diseases_Fungal_Sheath-blight-1.jpg'
  },
  {
    name: 'Bacterial Brown Stripe',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Brown to black stripes on stems', 'Leaf sheath discoloration', 'Stunted growth'],
    cause: 'Bacterial infection (Acidovorax avenae subsp. avenae)',
    treatment: 'Apply copper-based bactericides; remove infected debris',
    prevention: 'Use resistant varieties, avoid mechanical injury, ensure proper water management',
    severity: 'Medium',
    image_url: 'https://pestsdiseases.com/wp-content/uploads/Rice-Brown-Spot-Management-in-Paddy1.jpg'
  },
  {
    name: 'Bacterial Sheath Brown Rot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Brown to black sheath lesions', 'Rotting at waterline', 'Reduced tillering'],
    cause: 'Bacterial infection (Pseudomonas fuscovaginae)',
    treatment: 'Apply copper-based bactericides; improve field sanitation',
    prevention: 'Use resistant varieties, manage water to avoid waterlogging, rotate crops',
    severity: 'Medium',
    image_url: 'https://th.bing.com/th/id/R.7010549d3c48b453ea7346bb6d95538d?rik=V2so1b3DiceVSA&pid=ImgRaw&r=0'
  },
  {
    name: 'Rice Necrosis Mosaic Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Mosaic patterns on leaves', 'Yellowing', 'Stunted growth'],
    cause: 'Viral infection (Rice necrosis mosaic virus)',
    treatment: 'No cure; remove infected plants, control vectors',
    prevention: 'Use resistant varieties, control soil-borne vectors, rotate crops',
    severity: 'Medium',
    image_url: 'https://www.researchgate.net/profile/I_Lozano/publication/225689347/figure/fig1/AS:564281200607232@1511546530683/Characteristic-plant-malformation-induced-by-Rice-stripe-necrosis-virus_Q320.jpg'
  },
  {
    name: 'Rice Transitory Yellowing Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Transient yellowing of leaves', 'Stunted growth', 'Reduced yield'],
    cause: 'Viral infection (Rice transitory yellowing virus)',
    treatment: 'No cure; remove infected plants, apply insecticides for vectors',
    prevention: 'Use resistant varieties, control leafhoppers, avoid late planting',
    severity: 'Medium',
    image_url: 'https://thumbs.dreamstime.com/z/paddy-leaves-affected-yellowing-disease-262063590.jpg'
  },
  {
    name: 'Rice Gall Dwarf Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Galls on leaves', 'Severe stunting', 'Malformed panicles'],
    cause: 'Viral infection (Rice gall dwarf virus)',
    treatment: 'No cure; remove infected plants, control leafhoppers',
    prevention: 'Use resistant varieties, apply insecticides for vectors, use certified seeds',
    severity: 'High',
    image_url: 'https://bugwoodcloud.org/images/768x512/5356978.jpg'
  },
  {
    name: 'Rice Cyst Nematode',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Root cysts', 'Stunted growth', 'Yellowing leaves'],
    cause: 'Nematode infection (Heterodera elachista)',
    treatment: 'Apply nematicides (e.g., oxamyl); use biological controls',
    prevention: 'Use resistant varieties, rotate with non-host crops, soil solarization',
    severity: 'Medium',
    image_url: 'https://tse1.mm.bing.net/th/id/OIP.cXYDPuo0HYM-VbcBbDcj0gHaKD?rs=1&pid=ImgDetMain&o=7&rm=3'
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
  },
  // Seasonal Tips
  {
    title: 'Maha Season Planting',
    category: 'Seasonal',
    season: 'Maha (NE Monsoon)',
    icon: 'Calendar',
    content: [
      'Plant from September when monsoon begins',
      'Use long-duration varieties like BG 358',
      'Ensure proper water drainage in low-lying areas',
      'Traditional method: Observe flowering of Kohomba trees as natural indicator for planting time'
    ],
    timing: 'September - December'
  },
  {
    title: 'Yala Season Management',
    category: 'Seasonal',
    season: 'Yala (SW Monsoon)',
    icon: 'Sun',
    content: [
      'Begin cultivation in April-May',
      'Use short-duration varieties (BG 300)',
      'Schedule irrigation carefully',
      'Traditional method: Use Bethma water sharing systems during water scarcity'
    ],
    timing: 'April - June'
  },
  {
    title: 'Inter-Monsoon Care',
    category: 'Seasonal',
    season: 'Dry Period',
    icon: 'Cloud',
    content: [
      'Use mulch to retain soil moisture',
      'Repair bunds and irrigation channels',
      'Prepare for next season',
      'Traditional method: Apply Chena ash as natural fertilizer during dry spells'
    ],
    timing: 'January - March'
  },
  {
    title: 'Harvest Timing',
    category: 'Seasonal',
    season: 'All Seasons',
    icon: 'Harvest',
    content: [
      'Harvest Maha crop by Feb-Mar',
      'Harvest Yala crop by Aug-Sep',
      'Avoid harvesting during rains',
      'Traditional method: Moon phase harvesting beliefs for better grain quality'
    ],
    timing: 'February-March / August-September'
  },
  {
    title: 'Off-Season Preparation',
    category: 'Seasonal',
    season: 'Dry Months',
    icon: 'Tractor',
    content: [
      'Level land properly',
      'Incorporate organic matter',
      'Test soil nutrients',
      'Traditional method: Controlled burning of paddy straw to manage pests and weeds'
    ],
    timing: 'March-April'
  },
  // Enhanced Pest Management Tips
  {
    title: 'Brown Plant Hopper Control',
    category: 'Pest Management',
    season: 'Monsoon',
    icon: 'Bug',
    content: [
      'Cultivate resistant varieties: Bg 379-2, Bg 300, Bg 403, Bg 304, Bg 357, Bg 358, Bg 360',
      'Monitor crop regularly for signs of early BPH infestations',
      'Avoid excessive nitrogen fertilizer',
      'Traditional method: Kohomba (neem) leaf extract spray (100g leaves boiled in 1L water)'
    ],
    timing: 'August - October'
  },
  {
    title: 'Golden Apple Snail Management',
    category: 'Pest Management',
    season: 'Monsoon',
    icon: 'Water',
    content: [
      'Drain fields for 48 hours',
      'Handpick snails during early morning',
      'Use bamboo traps in irrigation channels',
      'Maintain clean irrigation channels',
      'Traditional method: Duck integration - 10-15 ducks per hectare eat young snails'
    ],
    timing: 'June - September'
  },
  {
    title: 'Rice Blast Disease Control',
    category: 'Pest Management',
    season: 'Monsoon',
    icon: 'Shield',
    content: [
      'Space plants properly for air circulation',
      'Apply silica fertilizers to strengthen plants',
      'Use resistant varieties',
      'Avoid late planting',
      'Traditional method: Garlic-chili solution spray (50g each in 1L water fermented for 3 days)'
    ],
    timing: 'July - September'
  },
  {
    title: 'Stem Borer Management',
    category: 'Pest Management',
    season: 'Monsoon',
    icon: 'Target',
    content: [
      'Remove stubble completely after harvest',
      'Use light traps to monitor moth activity',
      'Practice crop rotation with non-host crops',
      'Monitor for dead hearts in seedlings',
      'Traditional method: Nochi leaves (Vitex negundo) placed in storage bags repel borers'
    ],
    timing: 'July - September'
  },
  {
    title: 'Leaf Folder Control',
    category: 'Pest Management',
    season: 'Monsoon',
    icon: 'Leaf',
    content: [
      'Conserve natural predators like spiders',
      'Spray neem oil if damage exceeds 10%',
      'Avoid broad-spectrum pesticides',
      'Monitor moth activity using pheromone traps',
      'Traditional method: Cow urine solution (1:10 ratio with water) as foliar spray'
    ],
    timing: 'July - September'
  },
  // Soil Care Tips
  {
    title: 'Acidity Management',
    category: 'Soil Care',
    season: 'Year-round',
    icon: 'Thermometer',
    content: [
      'Apply dolomite if pH is below 5',
      'Test soil every 2 seasons',
      'Use organic matter to buffer pH',
      'Grow green manure crops',
      'Traditional method: Wood ash application (200kg/acre) to neutralize acidity'
    ],
    timing: 'Pre-planting'
  },
  {
    title: 'Water Conservation',
    category: 'Soil Care',
    season: 'Year-round',
    icon: 'Water',
    content: [
      'Practice SRI (System of Rice Intensification) method',
      'Use intermittent irrigation techniques',
      'Laser level fields for uniform water distribution',
      'Maintain good bunds to prevent water loss',
      'Traditional method: Pitawana - Traditional small ponds for water storage'
    ],
    timing: 'Throughout growing season'
  },
  {
    title: 'Organic Matter Enhancement',
    category: 'Soil Care',
    season: 'Year-round',
    icon: 'Leaf',
    content: [
      'Add rice straw compost before planting',
      'Grow green manure crops in off-season',
      'Use paddy husk biochar for soil improvement',
      'Practice crop rotation with legumes',
      'Traditional method: Katta - Traditional compost pits with crop residues and cow dung'
    ],
    timing: 'Pre-planting and off-season'
  },
  {
    title: 'Nutrient Balance Management',
    category: 'Soil Care',
    season: 'Year-round',
    icon: 'Flask',
    content: [
      'Apply NPK based on soil tests and DoA recommendations for your zone',
      'Apply fertilizers in split doses',
      'Use zinc fertilizer if deficiency symptoms appear',
      'Combine organic and inorganic fertilizers',
      'Traditional method: Green manuring with Undu (Cajanus cajan) before planting'
    ],
    timing: 'Throughout growing season'
  },
  {
    title: 'Zinc Deficiency Management',
    category: 'Soil Care',
    season: 'Year-round',
    icon: 'Droplet',
    content: [
      'Apply zinc sulfate to soil before planting',
      'Look for khaira symptoms (bronze coloration)',
      'Use foliar zinc spray for quick recovery',
      'Use zinc-coated urea for continuous supply',
      'Traditional method: Application of decomposed Kangkung (water spinach) as green manure'
    ],
    timing: 'Pre-planting and early growth stages'
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
