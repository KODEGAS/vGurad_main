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
    image_url: 'https://www.organicchoice.co.za/wp-content/uploads/2018/11/Organic-Neem-Oil-500ml.jpg',
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
    image_url: 'https://5.imimg.com/data5/SELLER/Default/2023/6/314761607/IU/UB/AX/78588423/npk-20-20-20-fertilizer-1000x1000.jpeg',
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
    image_url: 'https://cdn.globalso.com/tangagri/Copper-Oxychloride2.png',
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
    image_url: 'https://tse1.mm.bing.net/th/id/OIP.PAAU-hduKDENfEVD5mhxiQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
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
  },
  {
    name: 'Blast',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Grayish-white lesions', 'Brown borders on leaves', 'Panicle rot', 'Node lesions'],
    cause: 'Fungal infection (Pyricularia oryzae / Magnaporthe oryzae)',
    treatment: 'Apply fungicides (e.g., tricyclazole, azoxystrobin); remove infected debris',
    prevention: 'Use resistant varieties (e.g., IR64), avoid excessive nitrogen, ensure proper spacing, apply seed treatments',
    severity: 'High',
    image_url: 'https://pestsdiseases.com/wp-content/uploads/Rice-Blast-Disease-Management-in-Paddy_-Symptoms-Treatment-Chemical-Biological-Natural-and-Organic-Control1.jpg'
  },
  {
    name: 'Brown Spot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Brown to dark-brown spots', 'Gray centers on leaves', 'Seedling blight'],
    cause: 'Fungal infection (Cochliobolus miyabeanus / Bipolaris oryzae)',
    treatment: 'Apply fungicides (e.g., mancozeb); improve soil fertility',
    prevention: 'Ensure balanced fertilization (especially potassium), use resistant varieties, treat seeds',
    severity: 'Medium',
    image_url: 'https://kisanvedika.bighaat.com/wp-content/uploads/2023/02/Paddy_Brown-spot-min-1024x685-1.png'
  },
  {
    name: 'False Smut',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Yellowish-green to black spore balls in panicles', 'Grain replacement'],
    cause: 'Fungal infection (Ustilaginoidea virens)',
    treatment: 'Limited; fungicides (e.g., propiconazole) may reduce spread',
    prevention: 'Use resistant varieties, avoid late planting, apply fungicides before flowering',
    severity: 'Medium',
    image_url: 'https://th.bing.com/th/id/R.8511168982483eaa01f4014c97b090db?rik=PfFS4dh7evf2tw&riu=http%3a%2f%2fwww.knowledgebank.irri.org%2fimages%2fstories%2ffalse-smut-black-spores.jpg&ehk=DwMNSr1VTP%2fb%2fReh51QdISU1GUhm4bkA2H3nWdLjF38%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1'
  },
  {
    name: 'Bakanae Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Elongated, thin seedlings', 'Chlorotic leaves', 'Foot rot in older plants'],
    cause: 'Fungal infection (Fusarium fujikuroi)',
    treatment: 'Remove and destroy affected plants; fungicide application less effective post-emergence',
    prevention: 'Use certified disease-free seeds, treat seeds with fungicides (e.g., benomyl)',
    severity: 'Medium',
    image_url: 'https://th.bing.com/th/id/R.9e511decf507569984d62a08cbbae44f?rik=gcUXCrC6UXSR9Q&riu=http%3a%2f%2fwww.knowledgebank.irri.org%2fimages%2fstories%2fbakanae.jpg&ehk=M3Vyl7eHh6E86yjjeIqlhBo0yo8Xcqx8FIgAt3RV5no%3d&risl=&pid=ImgRaw&r=0'
  },
  {
    name: 'Sheath Rot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Grayish-white to brown lesions on sheaths', 'Panicle rot', 'Discolored or sterile grains'],
    cause: 'Fungal infection (Sarocladium oryzae)',
    treatment: 'Apply fungicides (e.g., carbendazim); remove infected debris',
    prevention: 'Control insect pests, use resistant varieties, avoid excessive nitrogen',
    severity: 'Medium',
    image_url: 'https://tse4.mm.bing.net/th/id/OIP.M_93S4nUU-x9mNcQD83twgHaFM?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Stem Rot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Dark brown to black stem lesions', 'Lodging', 'Small black sclerotia in culms'],
    cause: 'Fungal infection (Sclerotium oryzae)',
    treatment: 'Apply fungicides (e.g., thiophanate-methyl); burn infected residues',
    prevention: 'Use resistant varieties, manage water to avoid waterlogging, rotate with non-host crops',
    severity: 'Medium',
    image_url: 'https://tse1.mm.bing.net/th/id/OIP.EEFEw-nbDEGxnxIwVXysywHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Kernel Smut',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Black, powdery spore masses in grains', 'Unnoticed until milling'],
    cause: 'Fungal infection (Tilletia barclayana)',
    treatment: 'Limited; focus on prevention',
    prevention: 'Use resistant varieties, apply fungicides at flowering, ensure timely harvest',
    severity: 'Low',
    image_url: 'https://arkansascrops.uada.edu/posts/disease/images/kernel-smut-yield-quality.jpg'
  },
  {
    name: 'Leaf Scald',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Gray-green to white leaf areas', 'Brown margins', 'Lesions starting at leaf tips'],
    cause: 'Fungal infection (Microdochium oryzae)',
    treatment: 'Apply fungicides (e.g., azoxystrobin); remove infected leaves',
    prevention: 'Use resistant varieties, avoid excessive moisture, ensure proper drainage',
    severity: 'Low',
    image_url: 'https://www.mindenpictures.com/cache/pcache2/80112791.jpg'
  },
  {
    name: 'Stackburn',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Brown to black discoloration on glumes', 'Kernel discoloration post-harvest'],
    cause: 'Fungal infection (Alternaria padwickii)',
    treatment: 'Limited; focus on post-harvest management',
    prevention: 'Ensure proper drying and storage, use resistant varieties, treat seeds',
    severity: 'Low',
    image_url: 'https://tse1.mm.bing.net/th/id/OIP.__CXGjicxmETO5f0uPhriwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Grain Discolouration',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Brown, black, or grayish grain patches', 'Reduced grain weight'],
    cause: 'Fungal infection (Multiple pathogens, e.g., Fusarium spp., Bipolaris oryzae, Alternaria spp.)',
    treatment: 'Apply fungicides (e.g., mancozeb) during grain filling; post-harvest sanitation',
    prevention: 'Use resistant varieties, ensure timely harvest, improve storage conditions, control insects',
    severity: 'Medium',
    image_url: 'https://www.lsuagcenter.com/~/media/system/5/2/c/2/52c24a05ae03c92f85ac942252d7f593/sheathrot3.jpg?h=1536&la=en&w=2048'
  },
  {
    name: 'Narrow Brown Leaf Spot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Narrow, brown to grayish leaf lesions', 'Central gray area', 'Coalescing spots'],
    cause: 'Fungal infection (Cercospora janseana / Sphaerulina oryzina)',
    treatment: 'Apply fungicides (e.g., propiconazole); remove infected debris',
    prevention: 'Use resistant varieties, apply fungicides early, avoid late planting',
    severity: 'Low',
    image_url: 'https://th.bing.com/th/id/R.61e48f7d581ba872db179e0a2d1b65f6?rik=EBFGsnnxO%2bdyYw&pid=ImgRaw&r=0'
  },
  {
    name: 'Bacterial Leaf Blight',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Water-soaked leaf lesions', 'Grayish-white to brown lesions', 'Leaf drying and wilting'],
    cause: 'Bacterial infection (Xanthomonas oryzae pv. oryzae)',
    treatment: 'Apply copper-based bactericides; remove infected debris',
    prevention: 'Use resistant varieties (e.g., with Xa genes), avoid leaf injury, manage water',
    severity: 'High',
    image_url: 'https://tse3.mm.bing.net/th/id/OIP.m9MojIpy8_DYxtRrGGmq3AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Bacterial Leaf Streak',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Translucent streaks between leaf veins', 'Grayish-white streaks', 'Bacterial ooze'],
    cause: 'Bacterial infection (Xanthomonas oryzae pv. oryzicola)',
    treatment: 'Copper-based bactericides; sanitation of fields',
    prevention: 'Use resistant varieties, avoid mechanical damage, ensure proper drainage',
    severity: 'Medium',
    image_url: 'https://tse3.mm.bing.net/th/id/OIP.flYu78KPMY70b818FIqquwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Bacterial Panicle Blight',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Grayish-white or brown panicles', 'Sterile florets', 'Grain abortion'],
    cause: 'Bacterial infection (Burkholderia glumae)',
    treatment: 'Limited; oxolinic acid may help in some regions',
    prevention: 'Use resistant varieties, avoid late planting, apply bactericides at flowering',
    severity: 'Medium',
    image_url: 'https://bugwoodcloud.org/images/1536x1024/5390474.jpg'
  },
  {
    name: 'Bacterial Grain Rot',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Rotting grains', 'Discoloration', 'Foul odor in panicles'],
    cause: 'Bacterial infection (Burkholderia gladioli)',
    treatment: 'Limited; focus on sanitation and drying',
    prevention: 'Use resistant varieties, ensure proper drying, avoid waterlogging',
    severity: 'Low',
    image_url: 'https://th.bing.com/th/id/R.f6057db8ae4b99e640631ad3349b71fa?rik=%2fXvGzz%2bKcmT3Ag&riu=http%3a%2f%2fwww.knowledgebank.irri.org%2fimages%2fstories%2fbacterial-sheath-brown-rot-mature.jpg&ehk=e9HQFG1BU7gGa%2fA2smbQNCthXG5xpjhqDmQlqVoHSVY%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1'
  },
  {
    name: 'Rice Tungro Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Stunted growth', 'Yellow-orange leaf discoloration', 'Reduced tillering', 'Poor panicle development'],
    cause: 'Viral infection (Rice tungro bacilliform virus and Rice tungro spherical virus)',
    treatment: 'No cure; remove infected plants, control vectors',
    prevention: 'Use resistant varieties (e.g., IRRI varieties), control leafhoppers with insecticides',
    severity: 'High',
    image_url: 'https://www.researchgate.net/profile/Mohammad-Malek-Faizal-Azizi/publication/359220404/figure/fig3/AS:1141720959975428@1649218897646/Symptoms-of-rice-blast-disease-caused-by-Pyricularia-oryzae_Q320.jpg'
  },
  {
    name: 'Rice Grassy Stunt Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Stunted plants', 'Grassy appearance', 'Narrow leaves', 'Excessive tillering'],
    cause: 'Viral infection (Rice grassy stunt virus)',
    treatment: 'No cure; remove infected plants, apply insecticides',
    prevention: 'Use resistant varieties, control planthoppers, rotate crops',
    severity: 'High',
    image_url: 'https://tse3.mm.bing.net/th/id/OIP.0UTHyj6_vEA3K4ZC4mo-kAHaE3?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Rice Ragged Stunt Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Ragged, twisted leaves', 'Stunted growth', 'Malformed panicles'],
    cause: 'Viral infection (Rice ragged stunt virus)',
    treatment: 'No cure; focus on vector control and sanitation',
    prevention: 'Use resistant varieties, control planthoppers, avoid late planting',
    severity: 'Medium',
    image_url: 'https://th.bing.com/th/id/R.b0be09c244da1de31d7d4934f9501bc5?rik=oE2ZF7m%2bUG%2bZkQ&pid=ImgRaw&r=0'
  },
  {
    name: 'Rice Dwarf Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Severe stunting', 'Dark green leaves', 'Small, malformed panicles'],
    cause: 'Viral infection (Rice dwarf virus)',
    treatment: 'No cure; remove infected plants, apply insecticides',
    prevention: 'Use resistant varieties, control leafhoppers, use certified seeds',
    severity: 'High',
    image_url: 'https://etvbharatimages.akamaized.net/etvbharat/prod-images/768-512-16239218-50-16239218-1661862031838.jpg'
  },
  {
    name: 'Rice Yellow Mottle Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Yellowing or mottling of leaves', 'Stunted growth', 'Reduced grain set'],
    cause: 'Viral infection (Rice yellow mottle virus)',
    treatment: 'No cure; remove infected plants, sanitize equipment',
    prevention: 'Use resistant varieties, treat seeds, control insect vectors',
    severity: 'High',
    image_url: 'https://tse4.mm.bing.net/th/id/OIP.-o1cn-tzRwMQFXk1L7ckvAHaFb?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Rice Stripe Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Chlorotic stripes on leaves', 'Stunted growth', 'Reduced tillering'],
    cause: 'Viral infection (Rice stripe virus)',
    treatment: 'No cure; focus on vector control and sanitation',
    prevention: 'Use resistant varieties, control planthoppers, avoid late planting',
    severity: 'Medium',
    image_url: 'https://bugwoodcloud.org/images/1536x1024/5356977.jpg'
  },
  {
    name: 'Rice Black-Streaked Dwarf Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Severe stunting', 'Dark green to blackish leaves', 'Malformed panicles', 'Reduced tillering'],
    cause: 'Viral infection (Rice black-streaked dwarf virus)',
    treatment: 'No cure; remove infected plants, apply insecticides for vector control',
    prevention: 'Use resistant varieties, control planthoppers, use certified seeds',
    severity: 'High',
    image_url: 'https://tse3.mm.bing.net/th/id/OIP.7-tMC1APEyuf_VcU5sXUnAHaGN?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Rice Hoja Blanca Virus',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['White or chlorotic stripes on leaves', 'Stunted growth', 'Reduced grain set'],
    cause: 'Viral infection (Rice hoja blanca virus)',
    treatment: 'No cure; remove infected plants, apply insecticides for vectors',
    prevention: 'Use resistant varieties, control planthoppers, avoid continuous cropping',
    severity: 'Medium',
    image_url: 'https://www.researchgate.net/profile/Stanley-Omar-Samonte/publication/368335618/figure/fig43/AS:11431281118630424@1675834266341/ak-Hoja-blanca-disease-symptoms-on-rice-foliage.png'
  },
  {
    name: 'Root-Knot Nematode',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Galls or knots on roots', 'Stunted growth', 'Yellowing', 'Reduced tillering'],
    cause: 'Nematode infection (Meloidogyne graminicola, others)',
    treatment: 'Apply nematicides (e.g., carbofuran); use biological controls (e.g., Pseudomonas fluorescens)',
    prevention: 'Use resistant varieties, rotate with non-hosts (e.g., marigolds), soil solarization',
    severity: 'High',
    image_url: 'https://www.gardenia.net/wp-content/uploads/2023/08/shutterstock_677912590.jpg'
  },
  {
    name: 'Rice Root Nematode',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Root discoloration', 'Reduced root growth', 'Stunted plants'],
    cause: 'Nematode infection (Hirschmanniella spp.)',
    treatment: 'Nematicides (limited efficacy); biological controls like Trichoderma spp.',
    prevention: 'Rotate with non-host crops, improve drainage, use resistant varieties',
    severity: 'Low',
    image_url: 'https://th.bing.com/th/id/R.4da6d78a0d2a12dab9ee53e39de8ca7a?rik=Ebr0886cnVzLsw&pid=ImgRaw&r=0'
  },
  {
    name: 'White Tip Nematode',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Whitening of leaf tips', 'Twisted leaves', 'Small, distorted grains'],
    cause: 'Nematode infection (Aphelenchoides besseyi)',
    treatment: 'Limited; remove infected plants, control seed spread',
    prevention: 'Use certified seeds, hot water seed treatment (52–55°C for 10–15 min)',
    severity: 'Medium',
    image_url: 'https://tse1.mm.bing.net/th/id/OIP.o_vL_oxonXzQIfosoWohTAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  {
    name: 'Ufra Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Stunted plants', 'Twisted, discolored leaves', 'Panicle sterility'],
    cause: 'Nematode infection (Ditylenchus angustus)',
    treatment: 'Nematicides (e.g., carbofuran); remove infected plants',
    prevention: 'Use resistant varieties, improve drainage, rotate crops',
    severity: 'High',
    image_url: 'https://www.researchgate.net/profile/Matiyar-Rahaman-Khan/publication/294285952/figure/fig8/AS:667816378257408@1536231240082/a-Ufra-symptoms-at-vegetative-stage-of-rice-b-Ufra-disease-symptoms-of-rice.png'
  },
  {
    name: 'Rice Orange Leaf Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Orange to yellow leaf discoloration', 'Stunted growth', 'Reduced tillering'],
    cause: 'Phytoplasma infection',
    treatment: 'No cure; remove infected plants, apply insecticides for vectors',
    prevention: 'Use resistant varieties, control leafhoppers, avoid late planting',
    severity: 'Medium',
    image_url: 'https://th.bing.com/th/id/R.1b044838aa50475e810c66311a8962e8?rik=DkMTnYIvJc7%2bLw&pid=ImgRaw&r=0'
  },
  {
    name: 'Rice Root Aphid Disease',
    crop: 'Rice (Oryza sativa)',
    symptoms: ['Yellowing', 'Wilting', 'Stunted growth', 'Root damage with aphid colonies'],
    cause: 'Insect infestation (Tetraneura spp.) with disease-like impact',
    treatment: 'Apply insecticides (e.g., imidacloprid); improve irrigation',
    prevention: 'Use resistant varieties, apply soil insecticides, rotate crops',
    severity: 'Low',
    image_url: 'https://www.environmentalfactor.com/wp-content/uploads/2023/04/Root-aphids-4.jpg'
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
