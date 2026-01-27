import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, X, Info, Calendar, Users, Flag, Award, Globe, Home, ChevronRight } from 'lucide-react';

// Philippine Heritage Sites with detailed information
const heritageSites = [
  {
    id: 1,
    name: 'Banaue Rice Terraces',
    location: 'Ifugao Province, Cordillera',
    lat: 16.9267,
    lng: 121.0566,
    image: 'src/image/banaue-rice-terraces.jpg',
    description: 'Ancient rice terraces carved into mountains over 2,000 years ago.',
    category: 'Cultural Heritage',
    heritageStatus: 'UNESCO World Heritage Site',
    era: 'Pre-colonial period (2,000+ years)',
    region: 'Cordillera Administrative Region',
    established: 'Approx. 2000 years ago',
    builtBy: 'Ifugao ancestors',
    
    // Detailed Information
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
    
    preservation: 'Managed by the Ifugao Rice Terraces Commission and UNESCO'
  },
  {
    id: 2,
    name: 'Intramuros',
    location: 'Manila, National Capital Region',
    lat: 14.5896,
    lng: 120.9747,
    image: 'src/image/intramuros.jpg',
    description: 'Historic walled city from the Spanish colonial period.',
    category: 'Historical Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (1571)',
    region: 'National Capital Region',
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
    
    preservation: 'Managed by the Intramuros Administration under the Department of Tourism'
  },
  {
    id: 3,
    name: 'Vigan Heritage Village',
    location: 'Ilocos Sur, Region I',
    lat: 17.5747,
    lng: 120.3869,
    image: 'src/image/vigan-heritage.JPG',
    description: 'Best-preserved Spanish colonial town in Asia.',
    category: 'Cultural Heritage',
    heritageStatus: 'UNESCO World Heritage Site',
    era: 'Spanish Colonial (16th century)',
    region: 'Ilocos Region',
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
    
    preservation: 'Managed by the Vigan Conservation Council and UNESCO'
  },
  {
    id: 4,
    name: 'Tubbataha Reefs',
    location: 'Palawan, MIMAROPA',
    lat: 8.9532,
    lng: 119.8612,
    image: 'src/image/tubbataha.jpg',
    description: 'Pristine marine sanctuary with exceptional biodiversity.',
    category: 'Natural Heritage',
    heritageStatus: 'UNESCO World Heritage Site',
    era: 'Natural Formation (millions of years)',
    region: 'MIMAROPA Region',
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
    
    preservation: 'Managed by the Tubbataha Management Office and UNESCO'
  },
  {
    id: 5,
    name: 'Chocolate Hills',
    location: 'Bohol, Region VII',
    lat: 9.8297,
    lng: 124.1435,
    image: 'src/image/chocolate-hills.jpeg',
    description: 'Unique geological formation of over 1,200 hills.',
    category: 'Natural Heritage',
    heritageStatus: 'National Geological Monument',
    era: 'Geological formation (millions of years)',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural geological processes',
    
    detailedInfo: {
      overview: 'The Chocolate Hills are a geological formation of at least 1,260 hills spread over an area of more than 50 square kilometers. They are covered in green grass that turns chocolate brown during the dry season, hence the name.',
      culturalSignificance: 'Featured in Philippine mythology and folklore. Local legend tells of two giants who fought for days, throwing rocks and sand at each other, which formed the hills.',
      geology: 'Formed from marine limestone on top of an impermeable layer of clay. The symmetrical, conical shapes are the result of coral deposits and the action of rainwater and erosion.',
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
    
    preservation: 'Managed by the Department of Environment and Natural Resources'
  },
  // Add these to your heritageSites array in Explore.jsx (after the existing 5)

{
  id: 6,
  name: 'Puerto Princesa Underground River',
  location: 'Palawan, MIMAROPA',
  lat: 10.1933,
  lng: 118.9266,
  image: 'src/image/puerto-river.jpg', 
  description: 'World\'s longest navigable underground river with unique ecosystem.',
  category: 'Natural Heritage',
  heritageStatus: 'UNESCO World Heritage Site, New 7 Wonders of Nature',
  era: 'Natural Formation (millions of years)',
  region: 'MIMAROPA Region',
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
  
  preservation: 'Managed by City Government of Puerto Princesa and DENR'
},
{
  id: 7,
  name: 'Baroque Churches of the Philippines',
  location: 'Various Locations',
  lat: 14.5896,
  lng: 120.9747,
  image: 'src/image/baroqueChurch.jpg',
  description: 'Four Baroque churches showcasing Spanish colonial architecture.',
  category: 'Historical Heritage',
  heritageStatus: 'UNESCO World Heritage Site',
  era: 'Spanish Colonial (16th-18th century)',
  region: 'Multiple Regions',
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
  
  preservation: 'Managed by respective dioceses and National Historical Commission'
},
{
  id: 8,
  name: 'Mount Hamiguitan Range',
  location: 'Davao Oriental, Mindanao',
  lat: 6.7444,
  lng: 126.1814,
  image: 'src/image/mount-hamiguitan.jpg', // Using ivan.jpg
  description: 'Mountain range with unique pygmy forest and rich biodiversity.',
  category: 'Natural Heritage',
  heritageStatus: 'UNESCO World Heritage Site',
  era: 'Geological formation',
  region: 'Davao Region',
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
  
  preservation: 'Managed by DENR and local indigenous groups'
},
{
  id: 9,
  name: 'Rice Terraces of the Philippine Cordilleras',
  location: 'Ifugao, Mountain Province',
  lat: 16.9333,
  lng: 121.1333,
  image: 'src/image/cordillera-rice.avif',
  description: 'Cluster of rice terrace clusters maintained by Ifugao communities.',
  category: 'Cultural Heritage',
  heritageStatus: 'UNESCO World Heritage Site',
  era: 'Pre-colonial (2,000+ years)',
  region: 'Cordillera Administrative Region',
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
  
  preservation: 'Managed by Ifugao communities with UNESCO support'
},
{
  id: 10,
  name: 'Coron Island',
  location: 'Palawan, MIMAROPA',
  lat: 12.0000,
  lng: 120.2000,
  image: 'src/image/coron-island.webp', // Using ivan.jpg
  description: 'Island known for pristine lakes, limestone cliffs, and WWII wrecks.',
  category: 'Natural Heritage',
  heritageStatus: 'Protected Area',
  era: 'Natural formation',
  region: 'MIMAROPA Region',
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
  
  preservation: 'Managed by Tagbanua Foundation and local government'
},
{
  id: 11,
  name: 'San Agustin Church',
  location: 'Intramuros, Manila',
  lat: 14.5892,
  lng: 120.9753,
  image: 'src/image/san-agustin-church.jpg',
  description: 'Oldest stone church in the Philippines.',
  category: 'Historical Heritage',
  heritageStatus: 'UNESCO World Heritage Site',
  era: 'Spanish Colonial (1607)',
  region: 'National Capital Region',
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
  
  preservation: 'Managed by Augustinian Order and National Museum'
},
{
  id: 12,
  name: 'Mayon Volcano',
  location: 'Albay, Bicol Region',
  lat: 13.2567,
  lng: 123.6850,
  image: 'src/image/mayon.jpg',
  description: 'World\'s most perfect cone-shaped volcano.',
  category: 'Natural Heritage',
  heritageStatus: 'Natural Park, UNESCO Biosphere Reserve candidate',
  era: 'Active volcano',
  region: 'Bicol Region',
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
  
  preservation: 'Managed by DENR and PHIVOLCS'
},
{
  id: 13,
  name: 'Taal Volcano',
  location: 'Batangas, CALABARZON',
  lat: 14.0100,
  lng: 120.9975,
  image: 'src/image/taal.jpeg',
  description: 'Volcano within a lake within a volcano.',
  category: 'Natural Heritage',
  heritageStatus: 'Protected Landscape',
  era: 'Active volcano',
  region: 'CALABARZON',
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
  
  preservation: 'Managed by DENR and PHIVOLCS'
},
{
  id: 14,
  name: 'Sagada Hanging Coffins',
  location: 'Sagada, Mountain Province',
  lat: 17.0833,
  lng: 120.9000,
  image: 'src/image/sagada.jpg', 
  description: 'Ancient burial practice of hanging coffins on limestone cliffs.',
  category: 'Cultural Heritage',
  heritageStatus: 'Cultural Heritage Site',
  era: 'Pre-colonial to present',
  region: 'Cordillera Administrative Region',
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
  
  preservation: 'Managed by Sagada elders and local government'
},
{
  id: 15,
  name: 'Siargao Island',
  location: 'Surigao del Norte, Caraga',
  lat: 9.9053,
  lng: 126.0522,
  image: 'src/image/siargao.jpg',
  description: 'Surfing capital with pristine beaches and mangrove forests.',
  category: 'Natural Heritage',
  heritageStatus: 'Protected Landscape and Seascape',
  era: 'Natural formation',
  region: 'Caraga Region',
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
  
  preservation: 'Managed by DENR and local communities'
}

];


function FlyTo({ lat, lng, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

export default function Explore() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoZoom, setAutoZoom] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const navbar = document.querySelector('nav');
      if (navbar) setNavbarHeight(navbar.offsetHeight);
    }, 50);
    
    // Check if there's a destination saved from Destinations page
    const savedDest = localStorage.getItem('selectedDestination');
    if (savedDest) {
      try {
        const destination = JSON.parse(savedDest);
        setSelected(destination);
        setAutoZoom(true);
        localStorage.removeItem('selectedDestination');
      } catch (error) {
        console.error('Error parsing saved destination:', error);
        localStorage.removeItem('selectedDestination');
      }
    }
    
    return () => clearInterval(interval);
  }, []);

  // Fix Leaflet marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const categories = ['All', 'Cultural Heritage', 'Historical Heritage', 'Natural Heritage'];

  const filteredSites = heritageSites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSiteClick = (site) => {
    setSelected(site);
    setAutoZoom(true);
    setShowDetailedInfo(false);
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Cultural Heritage': return 'bg-yellow-100 text-yellow-800';
      case 'Historical Heritage': return 'bg-blue-100 text-blue-800';
      case 'Natural Heritage': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div style={{ 
      paddingTop: `${navbarHeight}px`,
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* LEFT SIDEBAR */}
      <div 
        style={{ 
          width: '380px',
          background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.97) 0%, rgba(44, 82, 130, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '25px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={24} color="white" />
            </div>
            <div>
              <h2 style={{ 
                color: 'white', 
                fontSize: '1.6rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Maharlika Heritage
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.85rem',
                margin: 0
              }}>
                Philippine Cultural & Natural Heritage Map
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="position-relative mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search heritage sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '12px 15px',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="d-flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
                style={{
                  background: selectedCategory === (cat === 'All' ? 'all' : cat) 
                    ? 'rgba(59, 130, 246, 0.3)' 
                    : 'rgba(255, 255, 255, 0.08)',
                  border: selectedCategory === (cat === 'All' ? 'all' : cat)
                    ? '1px solid rgba(59, 130, 246, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== (cat === 'All' ? 'all' : cat)) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== (cat === 'All' ? 'all' : cat)) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sites List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
          {filteredSites.map((site, index) => (
            <div
              key={site.id}
              onClick={() => handleSiteClick(site)}
              style={{
                cursor: 'pointer',
                marginBottom: '15px',
                borderRadius: '12px',
                background: selected?.id === site.id 
                  ? 'rgba(59, 130, 246, 0.3)' 
                  : 'rgba(255, 255, 255, 0.08)',
                border: selected?.id === site.id 
                  ? '2px solid rgba(59, 130, 246, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '15px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (selected?.id !== site.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (selected?.id !== site.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>
                  {site.name}
                </h6>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {site.heritageStatus.includes('UNESCO') ? 'UNESCO' : 'Heritage'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-1 mb-2">
                <MapPin size={12} style={{ color: '#93c5fd' }} />
                <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {site.location}
                </span>
              </div>
              <p style={{ 
                fontSize: '0.8rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: 0,
                lineHeight: '1.4'
              }}>
                {site.description}
              </p>
              <div className="mt-2 d-flex justify-content-between">
                <span style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  <Calendar size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {site.era}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSiteClick(site);
                    setShowDetailedInfo(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#93c5fd',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  More info <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[12.8797, 121.774]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          maxBounds={[
            [4, 116],
            [21, 127]
          ]}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap'
          />

          {filteredSites.map(site => (
            <Marker 
              key={site.id} 
              position={[site.lat, site.lng]}
              eventHandlers={{
                click: () => handleSiteClick(site)
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#1e3a5f', fontSize: '1rem' }}>
                    {site.name}
                  </strong>
                  <br />
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {site.location}
                  </span>
                  <br />
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#f3f4f6',
                    color: '#4b5563'
                  }}>
                    {site.category}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {selected && autoZoom && (
            <FlyTo lat={selected.lat} lng={selected.lng} zoom={selected.zoom || 13} />
          )}
        </MapContainer>

        {/* INFO PANEL - Regular (when showDetailedInfo is false) */}
        {selected && !showDetailedInfo && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              maxWidth: '500px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              animation: 'slideUp 0.4s ease',
              zIndex: 1000
            }}
          >
            <button
              onClick={() => {
                setSelected(null);
                setAutoZoom(false);
              }}
              className="btn btn-sm position-absolute top-0 end-0 m-2"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                zIndex: 1001
              }}
            >
              <X size={18} />
            </button>

            <div className="row g-3">
              <div className="col-5">
                <img
                  src={selected.image}
                  alt={selected.name}
                  style={{ 
                    width: '100%', 
                    height: '160px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />
                <div className="mt-2 text-center">
                  <span style={selected.category === 'Cultural Heritage' ? {
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  } : selected.category === 'Historical Heritage' ? {
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  } : {
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {selected.category}
                  </span>
                </div>
              </div>
              <div className="col-7">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <MapPin size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                    {selected.location}
                  </span>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                  {selected.name}
                </h5>
                <div className="mb-3">
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Award size={12} />
                    {selected.heritageStatus}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.5', marginBottom: '15px' }}>
                  {selected.description}
                </p>
                <div className="d-flex gap-2 mb-3">
                  <div style={{
                    background: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>
                      <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Established
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1e3a5f' }}>
                      {selected.established}
                    </div>
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>
                      <Users size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Region
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1e3a5f' }}>
                      {selected.region}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailedInfo(true)}
                  className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '10px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Info size={14} />
                  View Detailed Information
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DETAILED INFO PANEL (when showDetailedInfo is true) */}
        {selected && showDetailedInfo && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              padding: '25px',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              animation: 'slideUp 0.4s ease',
              zIndex: 1000,
              overflowY: 'auto'
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <button
                  onClick={() => setShowDetailedInfo(false)}
                  className="btn btn-sm d-flex align-items-center gap-2 mb-3"
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    color: '#4b5563',
                    borderRadius: '8px',
                    padding: '6px 12px'
                  }}
                >
                  ← Back to Summary
                </button>
                <h2 className="fw-bold mb-1" style={{ color: '#1e3a5f' }}>
                  {selected.name}
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {selected.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setShowDetailedInfo(false);
                  setAutoZoom(false);
                }}
                className="btn btn-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-8">
                {/* Overview */}
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Overview
                  </h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                    {selected.detailedInfo.overview}
                  </p>
                </div>

                {/* Cultural Significance */}
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Cultural Significance
                  </h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                    {selected.detailedInfo.culturalSignificance}
                  </p>
                </div>

                {/* Architecture/Natural Features */}
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    {selected.category === 'Natural Heritage' ? 'Natural Features' : 'Architecture'}
                  </h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                    {selected.detailedInfo.architecture || selected.detailedInfo.biodiversity}
                  </p>
                </div>

                {/* Current Status */}
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Current Status
                  </h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                    {selected.detailedInfo.currentStatus}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-4">
                {/* Image */}
                <img
                  src={selected.image}
                  alt={selected.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    marginBottom: '20px'
                  }}
                />

                {/* Quick Facts */}
                <div className="mb-4">
                  <h5 className="h6 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                    <Info size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Quick Facts
                  </h5>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Category</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e3a5f' }}>{selected.category}</div>
                  </div>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Heritage Status</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e3a5f' }}>{selected.heritageStatus}</div>
                  </div>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Historical Period</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e3a5f' }}>{selected.era}</div>
                  </div>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Region</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e3a5f' }}>{selected.region}</div>
                  </div>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Established</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e3a5f' }}>{selected.established}</div>
                  </div>
                </div>

                {/* Cultural Practices */}
                {selected.culturalPractices && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                      <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Cultural Practices
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.culturalPractices.map((practice, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#fef3c7',
                            color: '#92400e',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.75rem',
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
                {selected.nativeFloraFauna && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                      <Flag size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Native Species
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.nativeFloraFauna.map((species, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.75rem',
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
                  <h5 className="h6 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                    <Award size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Preservation
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                    {selected.preservation}
                  </p>
                </div>

                {/* Visitor Information */}
                <div>
                  <h5 className="h6 fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                    <Home size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Visitor Information
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                    {selected.detailedInfo.visitorInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Hint */}
        {autoZoom && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '10px 20px',
              borderRadius: '25px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              zIndex: 1000,
              animation: 'fadeIn 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <MapPin size={16} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '0.9rem', color: '#1e3a5f', fontWeight: '600' }}>
              Zoomed to: {selected?.name}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
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
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
          color: white;
        }

        .leaflet-container {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}