import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Globe, BookOpen, ArrowRight, Landmark, X, Navigation, Info, Calendar, Users, Flag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PhilippinesHeritage() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showMapButton, setShowMapButton] = useState(null);
  
  const navigate = useNavigate();

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'luzon', label: 'Luzon' },
    { id: 'visayas', label: 'Visayas' },
    { id: 'mindanao', label: 'Mindanao' }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'nature', label: 'Natural Heritage' },
    { id: 'culture', label: 'Cultural Heritage' },
    { id: 'historic', label: 'Historical Heritage' }
  ];

  // Updated with MORE detailed heritage information
  const heritageSites = [
    { 
      id: 1, 
      name: 'Banaue Rice Terraces', 
      location: 'Ifugao Province, Cordillera', 
      region: 'luzon',
      type: 'culture',
      lat: 16.9267,
      lng: 121.0566,
      image: 'src/image/banaue-rice-terraces.jpg', 
      rating: 4.9,
      reviews: 2847,
      era: 'Pre-colonial period (2,000+ years)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Cultural Heritage',
      description: 'Ancient rice terraces carved into mountains over 2,000 years ago.',
      established: 'Approx. 2000 years ago',
      builtBy: 'Ifugao ancestors',
      
      detailedInfo: {
        overview: 'Often called the "Eighth Wonder of the World", these terraces were carved into the mountains of Ifugao by ancestors of the indigenous people. The terraces are approximately 2,000 years old and cover 10,360 square kilometers of mountainside.',
        culturalSignificance: 'The terraces illustrate the remarkable ability of human culture to adapt to new social and climate pressures as well as to implement and develop new ideas and technologies. They represent a sustainable agricultural system that has been maintained for centuries.',
        architecture: 'Built using stone and mud walls, the terraces are located approximately 1,500 meters above sea level. They are fed by an ancient irrigation system from the rainforests above the terraces.',
        currentStatus: 'Currently, there are threats of climate change, deforestation, and modernization affecting the maintenance of the terraces. Efforts are underway for preservation.',
        visitorInfo: 'Best visited from February to June. Cultural immersion programs available with local Ifugao communities.'
      },
      
      culturalPractices: [
        'Traditional rice planting rituals',
        'Hudhud chants (UNESCO Intangible Heritage)',
        'Woodcarving traditions',
        'Ifugao textile weaving'
      ],
      
      nativeFloraFauna: [
        'Ifugao rice varieties',
        'Native bird species',
        'Mountain pine trees',
        'Indigenous medicinal plants'
      ],
      
      preservation: 'Managed by the Ifugao Rice Terraces Commission and UNESCO',
      highlights: ['Ancient Engineering', 'Living Tradition', 'Mountain Agriculture']
    },
    { 
      id: 2, 
      name: 'Chocolate Hills', 
      location: 'Bohol, Region VII', 
      region: 'visayas',
      type: 'nature',
      lat: 9.8297,
      lng: 124.1435,
      image: 'src/image/chocolate-hills.jpeg', 
      rating: 4.8,
      reviews: 3421,
      era: 'Geological formation (millions of years)',
      heritageStatus: 'National Geological Monument',
      category: 'Natural Heritage',
      description: 'Unique geological formation of over 1,200 hills.',
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      
      detailedInfo: {
        overview: 'The Chocolate Hills are a geological formation of at least 1,260 hills spread over an area of more than 50 square kilometers. They are covered in green grass that turns chocolate brown during the dry season, hence the name.',
        culturalSignificance: 'Featured in Philippine mythology and folklore. Local legend tells of two giants who fought for days, throwing rocks and sand at each other, which formed the hills.',
        biodiversity: 'Formed from marine limestone on top of an impermeable layer of clay. The symmetrical, conical shapes are the result of coral deposits and the action of rainwater and erosion.',
        currentStatus: 'Protected as a National Geological Monument. Tourism is managed to prevent environmental degradation.',
        visitorInfo: 'Best viewed from the Chocolate Hills Complex viewpoint. Dry season (March-May) for the "chocolate" color.'
      },
      
      culturalPractices: [
        'Local folklore storytelling',
        'Traditional farming around hills',
        'Environmental conservation practices',
        'Cultural festivals celebrating the hills'
      ],
      
      nativeFloraFauna: [
        'Native grasses and shrubs',
        'Philippine tarsier (nearby sanctuary)',
        'Various bird species',
        'Indigenous plant species adapted to limestone'
      ],
      
      preservation: 'Managed by the Department of Environment and Natural Resources',
      highlights: ['Geological Wonder', 'Seasonal Color Change', 'Mythological Site']
    },
    { 
      id: 3, 
      name: 'Intramuros', 
      location: 'Manila, National Capital Region', 
      region: 'luzon',
      type: 'historic',
      lat: 14.5896,
      lng: 120.9747,
      image: 'src/image/intramuros.jpg', 
      rating: 4.7,
      reviews: 5234,
      era: 'Spanish Colonial (1571)',
      heritageStatus: 'National Historical Landmark',
      category: 'Historical Heritage',
      description: 'Historic walled city from the Spanish colonial period.',
      established: '1571',
      builtBy: 'Spanish conquistadors',
      
      detailedInfo: {
        overview: 'Intramuros, meaning "within the walls", is the 0.67-square-kilometer historic walled area within the city of Manila. It was the seat of government during the Spanish colonial period and the American occupation.',
        culturalSignificance: 'Represents over 300 years of Spanish colonial influence in the Philippines. Houses important institutions like Manila Cathedral, San Agustin Church (UNESCO site), and Fort Santiago.',
        architecture: 'Features Spanish colonial architecture with massive stone walls, gates, and colonial-era buildings. The walls stretch approximately 4.5 kilometers.',
        currentStatus: 'Well-preserved with ongoing restoration projects. Major tourist attraction with museums and cultural shows.',
        visitorInfo: 'Open daily. Guided tours available. Cultural shows every weekend.'
      },
      
      culturalPractices: [
        'Spanish-era religious festivals',
        'Historical reenactments',
        'Traditional Filipino-Spanish cuisine',
        'Colonial architecture tours'
      ],
      
      nativeFloraFauna: [
        'Ancient acacia trees within fortifications',
        'Colonial-era garden plants',
        'Urban bird species',
        'Historical landscaping'
      ],
      
      preservation: 'Managed by the Intramuros Administration under the Department of Tourism',
      highlights: ['Spanish Colonial', 'Baroque Churches', 'War Memorial']
    },
    { 
      id: 4, 
      name: 'Tubbataha Reefs', 
      location: 'Palawan, MIMAROPA', 
      region: 'luzon',
      type: 'nature',
      lat: 8.9532,
      lng: 119.8612,
      image: 'src/image/tubbataha.jpg', 
      rating: 4.9,
      reviews: 2891,
      era: 'Natural Formation (millions of years)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Natural Heritage',
      description: 'Pristine marine sanctuary with exceptional biodiversity.',
      established: 'Natural park since 1988',
      builtBy: 'Natural coral formation',
      
      detailedInfo: {
        overview: 'Tubbataha Reefs Natural Park is a 97,030-hectare marine protected area located in the middle of the Sulu Sea. It is composed of two large coral atolls (North and South Atoll) and the Jessie Beazley Reef.',
        culturalSignificance: 'Traditional fishing grounds for the Cuyonon and Kagayanen people. The name "Tubbataha" comes from the Samal language meaning "long reef exposed at low tide".',
        biodiversity: 'Home to 600 species of fish, 360 species of corals (about half of all coral species in the world), 11 species of sharks, 13 species of dolphins and whales, and 100 species of birds.',
        currentStatus: 'One of the most well-preserved coral reef ecosystems in the world. Limited diving allowed with strict regulations.',
        visitorInfo: 'Accessible only by liveaboard dive boats from March to June. Strict no-take, no-touch policy.'
      },
      
      culturalPractices: [
        'Traditional sustainable fishing methods',
        'Marine conservation rituals',
        'Coastal community monitoring',
        'Eco-tourism practices'
      ],
      
      nativeFloraFauna: [
        'Hard and soft corals',
        'Sea turtles (hawksbill, green)',
        'Shark species (whale sharks, tiger sharks)',
        'Manta rays and dolphins',
        'Numerous reef fish species'
      ],
      
      preservation: 'Managed by the Tubbataha Management Office and UNESCO',
      highlights: ['Marine Sanctuary', 'World-Class Diving', 'Coral Conservation']
    },
    { 
      id: 5, 
      name: 'Vigan Heritage Village', 
      location: 'Ilocos Sur, Region I', 
      region: 'luzon',
      type: 'historic',
      lat: 17.5747,
      lng: 120.3869,
      image: 'src/image/vigan-heritage.jpg', 
      rating: 4.8,
      reviews: 4156,
      era: 'Spanish Colonial (16th century)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Cultural Heritage',
      description: 'Best-preserved Spanish colonial town in Asia.',
      established: '1572',
      builtBy: 'Spanish settlers and Chinese traders',
      
      detailedInfo: {
        overview: 'Vigan is the best-preserved example of a planned Spanish colonial town in Asia. Its architecture reflects the coming together of cultural elements from elsewhere in the Philippines, from China and from Europe, resulting in a culture and townscape that have no parallel anywhere in East and Southeast Asia.',
        culturalSignificance: 'Represents a unique fusion of Asian building design and construction with European colonial architecture and planning. The town has maintained its authenticity in terms of form and design, materials and substance, and use and function.',
        architecture: 'Features unique architecture known as "Bahay na Bato" (Stone House) with ground floors of stone and upper floors of wood. The town follows a grid street pattern laid out in accordance with the Laws of the Indies.',
        currentStatus: 'Active living heritage site with residents maintaining traditional lifestyles. Strict conservation guidelines in place.',
        visitorInfo: 'Best explored on a kalesa (horse-drawn carriage). Night tours available with traditional music.'
      },
      
      culturalPractices: [
        'Traditional pottery making (burnay)',
        'Abel Iloko weaving',
        'Vigan longganisa making',
        'Spanish-era festival celebrations'
      ],
      
      nativeFloraFauna: [
        'Heritage trees in plazas',
        'Traditional medicinal garden plants',
        'Local river ecosystem',
        'Urban biodiversity'
      ],
      
      preservation: 'Managed by the Vigan Conservation Council and UNESCO',
      highlights: ['Colonial Architecture', 'Cobblestone Streets', 'Living Heritage']
    },
    // NEW ADDITIONS - 10 MORE POPULAR HERITAGE SITES
    { 
      id: 6, 
      name: 'Puerto Princesa Underground River', 
      location: 'Palawan, MIMAROPA', 
      region: 'luzon',
      type: 'nature',
      lat: 10.1933,
      lng: 118.9266,
      image: 'src/image/puerto-river.jpg', 
      rating: 4.9,
      reviews: 3789,
      era: 'Natural Formation (millions of years)',
      heritageStatus: 'UNESCO World Heritage Site, New 7 Wonders of Nature',
      category: 'Natural Heritage',
      description: 'World\'s longest navigable underground river with unique ecosystem.',
      established: 'Declared National Park in 1971',
      builtBy: 'Natural limestone karst formation',
      
      detailedInfo: {
        overview: 'The Puerto Princesa Subterranean River National Park features a spectacular limestone karst landscape with an underground river that flows directly into the sea. The river is approximately 8.2 km long and contains major formations of stalactites and stalagmites.',
        culturalSignificance: 'Considered sacred by indigenous Tagbanua people. Local legends speak of spirits guarding the cave.',
        biodiversity: 'Home to 800 plant species, 195 bird species, 30 mammal species, and 19 reptile species. The underground river ecosystem includes unique species adapted to complete darkness.',
        currentStatus: 'One of the New 7 Wonders of Nature. Strict visitor limits to preserve the ecosystem.',
        visitorInfo: 'Requires boat ride from Sabang. Limited to 900 visitors per day. Best visited November to May.'
      },
      
      culturalPractices: [
        'Tagbanua spiritual rituals',
        'Sustainable cave tourism',
        'Indigenous forest management',
        'Biodiversity monitoring'
      ],
      
      nativeFloraFauna: [
        'Palawan bearcat',
        'Philippine cockatoo',
        'Palawan hornbill',
        'Underground river crabs',
        'Unique cave swiftlets'
      ],
      
      preservation: 'Managed by City Government of Puerto Princesa and DENR',
      highlights: ['Subterranean River', 'Karst Landscape', 'Wonders of Nature']
    },
    { 
      id: 7, 
      name: 'Baroque Churches of the Philippines', 
      location: 'Various Locations', 
      region: 'all',
      type: 'historic',
      lat: 14.5896,
      lng: 120.9747,
      image: 'src/image/baroqueChurch.jpg', 
      rating: 4.8,
      reviews: 3124,
      era: 'Spanish Colonial (16th-18th century)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Historical Heritage',
      description: 'Four Baroque churches showcasing Spanish colonial architecture.',
      established: '16th-18th centuries',
      builtBy: 'Spanish friars and Filipino artisans',
      
      detailedInfo: {
        overview: 'This UNESCO site comprises four churches: San Agustin Church in Manila, Paoay Church in Ilocos Norte, Santa Maria Church in Ilocos Sur, and Miagao Church in Iloilo. These churches represent the unique interpretation of European Baroque by Filipino and Chinese craftsmen.',
        culturalSignificance: 'Symbolize the fusion of European design with local materials and techniques. Show the spread of Christianity in the Philippines during Spanish rule.',
        architecture: 'Earthquake Baroque style with massive buttresses. Features intricate facades with tropical motifs and indigenous elements.',
        currentStatus: 'Active churches with regular services. Major pilgrimage sites during religious festivals.',
        visitorInfo: 'Open for worship and tours. Each church has its own visiting hours and festivals.'
      },
      
      culturalPractices: [
        'Traditional Catholic masses',
        'Religious festivals (Paoay Sand Dunes Festival)',
        'Church music traditions',
        'Pilgrimage traditions'
      ],
      
      nativeFloraFauna: [
        'Ancient churchyard trees',
        'Heritage garden plants',
        'Bell towers housing bats',
        'Historical landscaping'
      ],
      
      preservation: 'Managed by respective dioceses and National Historical Commission',
      highlights: ['Earthquake Baroque', 'Religious Heritage', 'Architectural Fusion']
    },
    { 
      id: 8, 
      name: 'Mount Hamiguitan Range', 
      location: 'Davao Oriental, Mindanao', 
      region: 'mindanao',
      type: 'nature',
      lat: 6.7444,
      lng: 126.1814,
      image: 'src/image/mount-hamiguitan.jpg', 
      rating: 4.7,
      reviews: 1987,
      era: 'Geological formation',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Natural Heritage',
      description: 'Mountain range with unique pygmy forest and rich biodiversity.',
      established: 'Declared Wildlife Sanctuary in 2004',
      builtBy: 'Natural volcanic formation',
      
      detailedInfo: {
        overview: 'Mount Hamiguitan Range Wildlife Sanctuary is a mountain ridge in Davao Oriental known for its unique pygmy forest (bonsai field) and rich biodiversity. It features five distinct vegetation types from lowland to montane forests.',
        culturalSignificance: 'Sacred to the Mandaya and Kaagan indigenous peoples. Home to numerous endemic species found nowhere else.',
        biodiversity: 'Hosts 1,380 species with 341 endemic to the Philippines. Includes 163 species of butterflies, 7 amphibians, 27 reptiles, and 13 mammals.',
        currentStatus: 'Strictly protected area with limited access. Important for climate change research.',
        visitorInfo: 'Requires DENR permit and local guide. Best visited March to May. Challenging trekking routes.'
      },
      
      culturalPractices: [
        'Mandaya weaving traditions',
        'Indigenous forest protection rituals',
        'Sustainable resource gathering',
        'Traditional ecological knowledge'
      ],
      
      nativeFloraFauna: [
        'Philippine eagle',
        'Hamiguitan pitcher plant',
        'Pygmy trees (centuries old)',
        'Rafflesia species',
        'Unique orchid varieties'
      ],
      
      preservation: 'Managed by DENR and local indigenous groups',
      highlights: ['Pygmy Forest', 'Unique Biodiversity', 'Endemic Species']
    },
    { 
      id: 9, 
      name: 'Rice Terraces of the Philippine Cordilleras', 
      location: 'Ifugao, Mountain Province', 
      region: 'luzon',
      type: 'culture',
      lat: 16.9333,
      lng: 121.1333,
      image: 'src/image/cordillera-rice.avif', 
      rating: 4.8,
      reviews: 2678,
      era: 'Pre-colonial (2,000+ years)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Cultural Heritage',
      description: 'Cluster of rice terrace clusters maintained by Ifugao communities.',
      established: 'Approx. 2000 years ago',
      builtBy: 'Ifugao indigenous communities',
      
      detailedInfo: {
        overview: 'This UNESCO site includes five terrace clusters: Batad, Bangaan, Hungduan, Mayoyao, and Nagacadan. These terraces represent a continuous cultural landscape where traditional practices are still maintained.',
        culturalSignificance: 'Living cultural landscape where traditional rice farming continues. Represents harmonious relationship between humans and environment.',
        architecture: 'Built entirely by hand without machinery. Sophisticated irrigation system from mountain forests.',
        currentStatus: 'Some terraces need restoration. Community-based tourism developing.',
        visitorInfo: 'Requires trekking. Homestays available with local families. Best visited during planting (June-July) or harvest (Nov-Dec).'
      },
      
      culturalPractices: [
        'Traditional rice cycle rituals',
        'Community cooperation (bayanihan)',
        'Indigenous governance systems',
        'Oral history preservation'
      ],
      
      nativeFloraFauna: [
        'Traditional rice varieties',
        'Native forest species',
        'Mountain stream ecosystems',
        'Indigenous fruit trees'
      ],
      
      preservation: 'Managed by Ifugao communities with UNESCO support',
      highlights: ['Living Landscape', 'Community Heritage', 'Sustainable Farming']
    },
    { 
      id: 10, 
      name: 'Coron Island', 
      location: 'Palawan, MIMAROPA', 
      region: 'luzon',
      type: 'nature',
      lat: 12.0000,
      lng: 120.2000,
      image: 'src/image/coron-island.webp ', 
      rating: 4.9,
      reviews: 4231,
      era: 'Natural formation',
      heritageStatus: 'Protected Area',
      category: 'Natural Heritage',
      description: 'Island known for pristine lakes, limestone cliffs, and WWII wrecks.',
      established: 'Natural formation',
      builtBy: 'Natural karst formation',
      
      detailedInfo: {
        overview: 'Coron Island is famous for its seven brackish lakes, with Kayangan Lake considered the cleanest in the Philippines. The island features dramatic limestone cliffs, hidden lagoons, and several WWII Japanese shipwrecks.',
        culturalSignificance: 'Ancestral domain of the Tagbanua people. Sacred lakes with spiritual significance.',
        biodiversity: 'Rich marine biodiversity including coral gardens. Unique lake ecosystems with species adapting to varying salinity.',
        currentStatus: 'Partially protected ancestral domain. Popular diving and eco-tourism destination.',
        visitorInfo: 'Accessible by boat from Coron town. Best visited October to May. Some lakes require indigenous guide.'
      },
      
      culturalPractices: [
        'Tagbanua fishing traditions',
        'Lake conservation rituals',
        'Traditional boat building',
        'Sustainable tourism practices'
      ],
      
      nativeFloraFauna: [
        'Giant clams',
        'Sea turtles',
        'Colorful reef fish',
        'Unique lake fish species',
        'Limestone forest vegetation'
      ],
      
      preservation: 'Managed by Tagbanua Foundation and local government',
      highlights: ['Crystal Clear Lakes', 'Limestone Karst', 'WWII Wrecks']
    },
    { 
      id: 11, 
      name: 'San Agustin Church', 
      location: 'Intramuros, Manila', 
      region: 'luzon',
      type: 'historic',
      lat: 14.5892,
      lng: 120.9753,
      image: 'src/image/san-agustin-church.jpg', 
      rating: 4.7,
      reviews: 3456,
      era: 'Spanish Colonial (1607)',
      heritageStatus: 'UNESCO World Heritage Site',
      category: 'Historical Heritage',
      description: 'Oldest stone church in the Philippines.',
      established: '1607',
      builtBy: 'Augustinian friars and Chinese artisans',
      
      detailedInfo: {
        overview: 'San Agustin Church is the oldest stone church in the Philippines, completed in 1607. It survived numerous earthquakes, wars, and natural disasters. The adjacent monastery now houses the San Agustin Museum.',
        culturalSignificance: 'Witness to over 400 years of Philippine history. Site of important historical events including the British occupation and WWII.',
        architecture: 'Baroque architecture with intricate trompe-l\'oeil murals on ceiling. Features ornate wooden doors and stone carvings.',
        currentStatus: 'Active Catholic church and museum. Popular wedding venue.',
        visitorInfo: 'Open daily for mass and tours. Museum has extensive collection of religious art.'
      },
      
      culturalPractices: [
        'Traditional Catholic liturgy',
        'Religious art conservation',
        'Historical research',
        'Cultural tours'
      ],
      
      nativeFloraFauna: [
        'Church garden plants',
        'Ancient convent trees',
        'Urban wildlife',
        'Historical courtyard flora'
      ],
      
      preservation: 'Managed by Augustinian Order and National Museum',
      highlights: ['Oldest Church', 'Baroque Art', 'Living History']
    },
    { 
      id: 12, 
      name: 'Mayon Volcano', 
      location: 'Albay, Bicol Region', 
      region: 'luzon',
      type: 'nature',
      lat: 13.2567,
      lng: 123.6850,
      image: 'src/image/mayon.jpg', 
      rating: 4.8,
      reviews: 4123,
      era: 'Active volcano',
      heritageStatus: 'Natural Park, UNESCO Biosphere Reserve candidate',
      category: 'Natural Heritage',
      description: 'World\'s most perfect cone-shaped volcano.',
      established: 'Natural formation',
      builtBy: 'Volcanic activity',
      
      detailedInfo: {
        overview: 'Mayon Volcano is renowned worldwide for its perfect symmetrical cone shape. It is the most active volcano in the Philippines, having erupted over 50 times in the past 400 years. The surrounding area is a national park.',
        culturalSignificance: 'Central to Bicolano mythology and culture. Featured in local legends including the tragic love story of Daragang Magayon.',
        biodiversity: 'Diverse ecosystems from lava fields to rainforests. Home to endemic species adapted to volcanic soil.',
        currentStatus: 'Active volcano with permanent danger zone. Major tourist attraction despite activity.',
        visitorInfo: 'Viewing decks in various towns. Best viewed October to May. Climbing requires PHIVOLCS clearance.'
      },
      
      culturalPractices: [
        'Volcano worship traditions',
        'Local handicrafts using volcanic materials',
        'Disaster preparedness rituals',
        'Cultural festivals (Magayon Festival)'
      ],
      
      nativeFloraFauna: [
        'Mayon shrew (endemic)',
        'Volcanic soil adapted plants',
        'Forest bird species',
        'Unique fern varieties'
      ],
      
      preservation: 'Managed by DENR and PHIVOLCS',
      highlights: ['Perfect Cone', 'Active Volcano', 'Cultural Icon']
    },
    { 
      id: 13, 
      name: 'Taal Volcano', 
      location: 'Batangas, CALABARZON', 
      region: 'luzon',
      type: 'nature',
      lat: 14.0100,
      lng: 120.9975,
      image: 'src/image/taal.jpeg', 
      rating: 4.7,
      reviews: 3876,
      era: 'Active volcano',
      heritageStatus: 'Protected Landscape',
      category: 'Natural Heritage',
      description: 'Volcano within a lake within a volcano.',
      established: 'Natural formation',
      builtBy: 'Volcanic activity',
      
      detailedInfo: {
        overview: 'Taal Volcano is a complex volcano located on an island within Taal Lake, which itself fills a volcanic caldera. It is the second most active volcano in the Philippines with 34 recorded eruptions.',
        culturalSignificance: 'Important to Tagalog folklore and history. Site of historic eruptions that shaped local communities.',
        biodiversity: 'Unique lake ecosystem with freshwater sardines (tawilis) found only in Taal Lake. Volcanic island flora and fauna.',
        currentStatus: 'Permanent danger zone declared after 2020 eruption. Limited tourism allowed.',
        visitorInfo: 'Currently restricted access. Best viewed from Tagaytay ridge. Boat tours suspended during high alert.'
      },
      
      culturalPractices: [
        'Lakeside fishing traditions',
        'Volcano monitoring rituals',
        'Local cuisine using tawilis',
        'Environmental conservation'
      ],
      
      nativeFloraFauna: [
        'Taal Lake sardine (tawilis)',
        'Volcano island vegetation',
        'Water birds',
        'Endemic fish species'
      ],
      
      preservation: 'Managed by DENR and PHIVOLCS',
      highlights: ['Island Volcano', 'Unique Geology', 'Freshwater Lake']
    },
    { 
      id: 14, 
      name: 'Sagada Hanging Coffins', 
      location: 'Sagada, Mountain Province', 
      region: 'luzon',
      type: 'culture',
      lat: 17.0833,
      lng: 120.9000,
      image: 'src/image/sagada.jpg', 
      rating: 4.6,
      reviews: 2345,
      era: 'Pre-colonial to present',
      heritageStatus: 'Cultural Heritage Site',
      category: 'Cultural Heritage',
      description: 'Ancient burial practice of hanging coffins on limestone cliffs.',
      established: 'Centuries-old tradition',
      builtBy: 'Indigenous Igorot people',
      
      detailedInfo: {
        overview: 'The hanging coffins of Sagada are a traditional burial practice of the Igorot people. Coffins are placed in caves or hung on cliffs to bring the deceased closer to ancestral spirits. Some coffins are over 500 years old.',
        culturalSignificance: 'Represents indigenous beliefs about the afterlife and connection to nature. The practice continues today among some families.',
        architecture: 'Coffins carved from hollowed logs. Bodies placed in fetal position representing return to mother earth. Personal items buried with deceased.',
        currentStatus: 'Living tradition with ongoing burials. Major tourist attraction requiring cultural sensitivity.',
        visitorInfo: 'Requires local guide. Photography restrictions apply. Respectful behavior mandatory.'
      },
      
      culturalPractices: [
        'Traditional burial rituals',
        'Ancestor veneration',
        'Community death rites',
        'Cultural preservation efforts'
      ],
      
      nativeFloraFauna: [
        'Limestone cave ecosystems',
        'Mountain forest species',
        'Local agricultural crops',
        'Traditional medicinal plants'
      ],
      
      preservation: 'Managed by Sagada elders and local government',
      highlights: ['Unique Burial', 'Living Tradition', 'Cultural Continuity']
    },
    { 
      id: 15, 
      name: 'Siargao Island', 
      location: 'Surigao del Norte, Caraga', 
      region: 'mindanao',
      type: 'nature',
      lat: 9.9053,
      lng: 126.0522,
      image: 'src/image/siargao.jpg', 
      rating: 4.9,
      reviews: 4987,
      era: 'Natural formation',
      heritageStatus: 'Protected Landscape and Seascape',
      category: 'Natural Heritage',
      description: 'Surfing capital with pristine beaches and mangrove forests.',
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      
      detailedInfo: {
        overview: 'Siargao is known as the "Surfing Capital of the Philippines" with Cloud 9 being its most famous surf break. The island features pristine beaches, mangrove forests, and the Sohoton Cove National Park.',
        culturalSignificance: 'Home to the Surigaonon people. Known for laid-back island culture and surfing community.',
        biodiversity: 'Rich marine biodiversity including dugongs, sea turtles, and diverse coral reefs. Extensive mangrove ecosystems.',
        currentStatus: 'Rapid tourism development. Environmental protection efforts ongoing.',
        visitorInfo: 'Best surf season August to November. Island hopping tours available. Respect local community guidelines.'
      },
      
      culturalPractices: [
        'Surf culture and competitions',
        'Traditional fishing methods',
        'Mangrove conservation',
        'Island festivals'
      ],
      
      nativeFloraFauna: [
        'Philippine crocodile (estuarine)',
        'Dugongs',
        'Sea turtles',
        'Colorful reef fish',
        'Mangrove species'
      ],
      
      preservation: 'Managed by DENR and local communities',
      highlights: ['Surfing Capital', 'Pristine Nature', 'Island Culture']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const navbar = document.querySelector('nav');
      if (navbar) setNavbarHeight(navbar.offsetHeight);
      const footer = document.querySelector('footer');
      if (footer) setFooterHeight(footer.offsetHeight);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredDestinations = heritageSites
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || d.region === selectedRegion;
      const matchesType = selectedType === 'all' || d.type === selectedType;
      return matchesSearch && matchesRegion && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.reviews - a.reviews;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Function to navigate to Explore page with selected location
  const goToMapLocation = (dest) => {
    localStorage.setItem('selectedDestination', JSON.stringify(dest));
    navigate('/explore');
  };

  return (
    <div style={{ 
      paddingTop: `${navbarHeight}px`, 
      paddingBottom: `${footerHeight}px`, 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)'
    }}>
      {/* Hero Section */}
      <div 
        className="position-relative overflow-hidden"
        style={{
          height: '400px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8) 0%, rgba(44, 82, 130, 0.7) 50%, rgba(26, 54, 93, 0.85) 100%)'
          }}
        />
        
        <div className="position-relative h-100 d-flex align-items-center justify-content-center text-center text-white px-4" style={{ zIndex: 1 }}>
          <div style={{ maxWidth: '800px', animation: 'fadeInUp 0.8s ease' }}>
            <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.7)' }}>
              Philippine{' '}
              <span style={{
                background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Heritage Sites
              </span>
            </h1>
            <p className="fs-5 mb-4" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
              Explore {heritageSites.length} cultural, historical, and natural heritage treasures
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <div className="position-relative">
                <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 py-3"
                  placeholder="Search heritage sites or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    borderRadius: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container-fluid px-4 py-5">
        {/* Filter Bar */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
            <div className="d-flex flex-wrap gap-2">
              {/* Region Filter */}
              <select 
                className="form-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  width: 'auto',
                  minWidth: '180px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  fontWeight: '500',
                  color: '#1e3a5f'
                }}
              >
                {regions.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select 
                className="form-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  width: 'auto',
                  minWidth: '180px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  fontWeight: '500',
                  color: '#1e3a5f'
                }}
              >
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: 'auto',
                minWidth: '180px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '10px 15px',
                fontWeight: '500',
                color: '#1e3a5f'
              }}
            >
              <option value="popular">Most Viewed</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-3">
            <p className="text-muted mb-0">
              Showing <span className="fw-bold text-dark">{filteredDestinations.length}</span> heritage site{filteredDestinations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="row g-4">
            {filteredDestinations.map((dest, index) => (
              <div 
                key={dest.id} 
                className="col-12 col-md-6 col-lg-4"
                style={{
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s backwards`
                }}
              >
                <div 
                  className="card h-100 border-0 shadow-sm overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
                    setShowMapButton(dest.id);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    setShowMapButton(null);
                  }}
                >
                  {/* Image */}
                  <div 
                    className="position-relative overflow-hidden"
                    style={{ height: '250px' }}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${dest.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    
                    {/* Category Badge */}
                    <div 
                      className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill small fw-semibold d-flex align-items-center gap-1"
                      style={dest.category === 'Cultural Heritage' ? {
                        background: 'rgba(245, 158, 11, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      } : dest.category === 'Historical Heritage' ? {
                        background: 'rgba(59, 130, 246, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      } : {
                        background: 'rgba(34, 197, 94, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      }}
                    >
                      <Landmark size={12} />
                      <span>{dest.category.replace(' Heritage', '')}</span>
                    </div>

                    {/* Era Badge */}
                    <div 
                      className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                      style={{
                        background: 'rgba(30, 58, 95, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'white'
                      }}
                    >
                      <Clock size={16} />
                      <span className="small fw-semibold">{dest.era.split('(')[0].trim()}</span>
                    </div>

                    {/* Map Location Button (Shows on hover) */}
                    {showMapButton === dest.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToMapLocation(dest);
                        }}
                        className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          border: 'none',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          animation: 'fadeIn 0.2s ease',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Navigation size={14} />
                        View on Map
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <MapPin size={16} style={{ color: '#3b82f6' }} />
                      <span className="small text-muted fw-semibold">{dest.location.split(',')[0]}</span>
                    </div>
                    
                    <h3 className="h5 fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                      {dest.name}
                    </h3>
                    
                    <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>
                      {dest.description}
                    </p>

                    {/* Highlights */}
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {dest.highlights.map((highlight, i) => (
                        <span 
                          key={i}
                          className="badge rounded-pill px-2 py-1"
                          style={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                      <div className="d-flex align-items-center gap-2">
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span className="small fw-bold">{dest.rating}</span>
                        <span className="small text-muted">({dest.reviews})</span>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm px-3 py-2 d-flex align-items-center gap-1"
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDestination(dest);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Details <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <Globe size={64} style={{ color: '#cbd5e1' }} />
            <h3 className="h4 mt-3 mb-2" style={{ color: '#64748b' }}>No heritage sites found</h3>
            <p className="text-muted">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedDestination && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setSelectedDestination(null)}
        >
          <div 
            className="bg-white rounded-4 overflow-hidden position-relative"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                zIndex: 10,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onClick={() => setSelectedDestination(null)}
            >
              <X size={20} />
            </button>

            {/* Modal Image */}
            <div
              style={{
                height: '300px',
                backgroundImage: `url(${selectedDestination.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Modal Content */}
            <div className="p-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={18} style={{ color: '#3b82f6' }} />
                <span className="text-muted fw-semibold">{selectedDestination.location}</span>
                <span className="text-muted">•</span>
                <span className="text-muted">Coordinates: {selectedDestination.lat.toFixed(4)}°, {selectedDestination.lng.toFixed(4)}°</span>
              </div>

              <h2 className="h3 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                {selectedDestination.name}
              </h2>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  <span className="fw-bold">{selectedDestination.rating}</span>
                  <span className="text-muted">({selectedDestination.reviews} reviews)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={18} style={{ color: '#64748b' }} />
                  <span className="text-muted">{selectedDestination.era}</span>
                </div>
              </div>

              <p className="mb-4" style={{ lineHeight: '1.7', color: '#475569' }}>
                {selectedDestination.description}
              </p>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn px-4 py-2 d-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '10px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                  onClick={() => {
                    setSelectedDestination(null);
                    goToMapLocation(selectedDestination);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Navigation size={18} />
                  View on Map
                </button>
              </div>

              {/* Heritage Status */}
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fef3c7', border: '2px solid #fbbf24' }}>
                <div className="d-flex align-items-start gap-2">
                  <Award size={20} style={{ color: '#92400e', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h4 className="h6 fw-bold mb-1" style={{ color: '#92400e' }}>Heritage Status</h4>
                    <p className="mb-0 small" style={{ color: '#78350f', lineHeight: '1.6' }}>
                      {selectedDestination.heritageStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Calendar size={16} style={{ color: '#3b82f6' }} />
                      <h6 className="h6 fw-bold mb-0" style={{ color: '#1e3a5f' }}>Established</h6>
                    </div>
                    <p className="mb-0" style={{ color: '#4b5563' }}>{selectedDestination.established}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Users size={16} style={{ color: '#3b82f6' }} />
                      <h6 className="h6 fw-bold mb-0" style={{ color: '#1e3a5f' }}>Built By</h6>
                    </div>
                    <p className="mb-0" style={{ color: '#4b5563' }}>{selectedDestination.builtBy}</p>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="mb-4">
                <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Overview
                </h4>
                <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                  {selectedDestination.detailedInfo.overview}
                </p>
              </div>

              {/* Cultural Significance */}
              <div className="mb-4">
                <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Cultural Significance
                </h4>
                <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                  {selectedDestination.detailedInfo.culturalSignificance}
                </p>
              </div>

              {/* Cultural Practices */}
              {selectedDestination.culturalPractices && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Cultural Practices
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDestination.culturalPractices.map((practice, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Flora & Fauna */}
              {selectedDestination.nativeFloraFauna && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Native Species
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDestination.nativeFloraFauna.map((species, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preservation */}
              <div className="mb-4">
                <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Preservation Status
                </h4>
                <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                  {selectedDestination.preservation}
                </p>
              </div>

              {/* Visitor Information */}
              <div className="mb-4">
                <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Visitor Information
                </h4>
                <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                  {selectedDestination.detailedInfo.visitorInfo}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="h5 fw-bold mb-2" style={{ color: '#1e3a5f' }}>Key Highlights</h4>
                <div className="d-flex flex-wrap gap-2">
                  {selectedDestination.highlights.map((highlight, i) => (
                    <span 
                      key={i}
                      className="badge px-3 py-2"
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        border: '2px solid #7dd3fc'
                      }}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .form-control:focus {
          outline: none;
          boxShadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}

export default PhilippinesHeritage;