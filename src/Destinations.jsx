import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Globe, BookOpen, ArrowRight, Landmark, X, Navigation, Info, Calendar, Users, Flag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Destinations() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showMapButton, setShowMapButton] = useState(null);
  
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Historical Heritage', label: 'Historical Heritage' },
    { id: 'Cultural Heritage', label: 'Cultural Heritage' },
    { id: 'Natural Heritage', label: 'Natural Heritage' }
  ];

  // 15 NEW CEBU HERITAGE SITES - Different from Explore.jsx
  const cebuSites = [
    { 
      id: 16, 
      name: 'Sto. Niño de Cebu Parish (Simala Shrine)', 
      location: 'Sibonga, Cebu', 
      category: 'Historical Heritage',
      lat: 10.0167,
      lng: 123.4500,
      image: 'src/image/simala.jpg', 
      rating: 4.9,
      reviews: 4523,
      era: 'Modern (1998)',
      heritageStatus: 'Religious Pilgrimage Site',
      description: 'A grand castle-like church known for miraculous answered prayers, attracting thousands of pilgrims.',
      established: '1998',
      builtBy: 'Marian Monks of the Lindogon Community',
      
      detailedInfo: {
        overview: 'The Monastery of the Holy Eucharist, popularly known as Simala Shrine or Simala Church, is a castle-like structure that has become one of the most visited pilgrimage sites in Cebu. The shrine is dedicated to the Blessed Virgin Mary and is famous for the many testimonies of answered prayers and miracles attributed to Mama Mary.',
        culturalSignificance: 'Has become a symbol of faith for many Filipino Catholics. The shrine represents modern Filipino devotion and the blend of European architectural inspiration with local spirituality. Thousands of devotees visit weekly, especially on Sundays and feast days.',
        architecture: 'European castle-inspired architecture with towering spires, ornate details, and grand staircases. The main church features beautiful stained glass windows, detailed religious statues, and a miraculous image of Mama Mary. The complex includes gardens, grottos, and stations of the cross.',
        currentStatus: 'Active pilgrimage site with daily masses. Continuously expanding with new structures and improvements. Managed by Marian monks who maintain the shrine and welcome pilgrims.',
        visitorInfo: 'Open daily 4:00 AM to 7:00 PM. Free admission. About 2 hours from Cebu City. Modest dress required. Best visited on weekdays to avoid crowds. Masses held multiple times daily. Candles and prayer materials available for purchase.'
      },
      
      culturalPractices: [
        'Pilgrimage traditions',
        'Prayer and thanksgiving rituals',
        'Candle lighting ceremonies',
        'Devotion to Mama Mary'
      ],
      
      nativeFloraFauna: [
        'Garden ornamental plants',
        'Palm trees',
        'Flowering shrubs',
        'Mountain birds'
      ],
      
      preservation: 'Managed by the Marian Monks of the Lindogon Community',
      highlights: ['Miracle Church', 'Castle Architecture', 'Pilgrimage Site']
    },
    { 
      id: 17, 
      name: 'Alegre Beach & Guitnang Bato Falls', 
      location: 'Alegre, Cebu', 
      category: 'Natural Heritage',
      lat: 10.2500,
      lng: 123.7167,
      image: 'src/image/alegre.jpg', 
      rating: 4.7,
      reviews: 1876,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: 'Hidden gem combining pristine beach coves and refreshing mountain waterfalls in one location.',
      established: 'Natural formation',
      builtBy: 'Natural geological and coastal processes',
      
      detailedInfo: {
        overview: 'Alegre in northern Cebu offers a unique combination of coastal and mountain attractions. The area features secluded beach coves with crystal clear waters and nearby Guitnang Bato Falls, a beautiful waterfall cascading down limestone cliffs. Less commercialized than other Cebu destinations, it maintains its natural charm.',
        culturalSignificance: 'Represents the unspoiled beauty of rural Cebu. Important to local fishing communities who have preserved these natural resources. Growing eco-tourism destination showing sustainable tourism development.',
        biodiversity: 'Rich marine life in coastal areas including coral gardens and diverse fish species. The waterfall area supports tropical forest vegetation, freshwater ecosystems, and various bird species. Limestone formations create unique microhabitats.',
        currentStatus: 'Emerging eco-tourism destination. Basic community-managed facilities. Efforts to develop tourism while preserving natural environment. Popular among local and adventurous foreign tourists.',
        visitorInfo: 'Open daily, best visited during dry season. Minimal entrance fees managed by local community. 2.5 hours from Cebu City. Basic cottages available. Bring own food and water. Snorkeling gear recommended. Guided tours to waterfalls available from locals.'
      },
      
      culturalPractices: [
        'Community-based tourism',
        'Traditional fishing methods',
        'Environmental stewardship',
        'Local guide services'
      ],
      
      nativeFloraFauna: [
        'Coastal mangroves',
        'Coral reefs',
        'Tropical fish species',
        'Limestone forest vegetation',
        'Freshwater species'
      ],
      
      preservation: 'Managed by local barangay government and community organizations',
      highlights: ['Beach & Falls Combo', 'Hidden Gem', 'Eco-Tourism']
    },
    { 
      id: 18, 
      name: 'Cebu Taoist Temple', 
      location: 'Beverly Hills, Cebu City', 
      category: 'Cultural Heritage',
      lat: 10.3333,
      lng: 123.8833,
      image: 'src/image/taoist.jpg', 
      rating: 4.8,
      reviews: 3245,
      era: 'Modern (1972)',
      heritageStatus: 'Religious and Cultural Landmark',
      description: 'Stunning Chinese temple built by Cebu\'s Chinese community, offering panoramic city views and cultural insights.',
      established: '1972',
      builtBy: 'Cebu Chinese community',
      
      detailedInfo: {
        overview: 'The Cebu Taoist Temple is located 300 meters above sea level in the Beverly Hills subdivision of Cebu City. Built by the city\'s substantial Chinese community in 1972, the temple is a center for worship for Taoism, the religion which follows the teachings of the ancient Chinese philosopher, Laozi.',
        culturalSignificance: 'Represents the rich Chinese-Filipino heritage in Cebu. The temple serves as both a place of worship and a tourist attraction, showcasing Chinese architectural traditions and Taoist philosophy. Important cultural bridge between Chinese and Filipino communities.',
        architecture: 'Multi-tiered temple featuring traditional Chinese architecture with ornate dragons, colorful pagoda roofs, intricate carvings, and decorative details. Features include the chapel, library, souvenir shop, and wishing well. The ascent involves climbing 81 steps (a lucky number in Chinese culture) representing the 81 chapters of Taoism scriptures.',
        currentStatus: 'Active place of worship and major tourist attraction. Well-maintained by the Chinese community. Open to visitors of all faiths. Regular Taoist ceremonies and celebrations held throughout the year.',
        visitorInfo: 'Open Wednesday to Sunday, 6:00 AM to 6:00 PM. Free admission. Modest attire required (no sleeveless, shorts, or mini skirts). About 30 minutes from downtown Cebu City. Best visited in the morning for cooler temperature and clear views. Photography allowed. Fortune telling services available.'
      },
      
      culturalPractices: [
        'Taoist worship rituals',
        'Fortune telling traditions',
        'Chinese festivals (Chinese New Year)',
        'Meditation practices'
      ],
      
      nativeFloraFauna: [
        'Temple garden plants',
        'Ornamental Chinese plants',
        'Bonsai trees',
        'Decorative flora'
      ],
      
      preservation: 'Maintained by Cebu Chinese community and temple management',
      highlights: ['Chinese Architecture', 'City Views', 'Cultural Bridge']
    },
    { 
      id: 19, 
      name: 'Inambakan Falls', 
      location: 'Ginatilan, Cebu', 
      category: 'Natural Heritage',
      lat: 9.6000,
      lng: 123.3500,
      image: 'src/image/inambakan.jpg', 
      rating: 4.7,
      reviews: 2134,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: 'Multi-tiered waterfalls with natural pools perfect for swimming, surrounded by lush forest.',
      established: 'Natural formation',
      builtBy: 'Natural hydrological processes',
      
      detailedInfo: {
        overview: 'Inambakan Falls is a stunning multi-tiered waterfall system located in the southern town of Ginatilan. The falls cascade down several levels creating natural swimming pools at each tier. The main waterfall is about 60 feet high and is surrounded by lush tropical vegetation, making it a refreshing natural retreat.',
        culturalSignificance: 'Popular destination for locals, especially during summer months. Represents southern Cebu\'s natural attractions. The site has helped boost eco-tourism in Ginatilan, providing livelihood opportunities for local communities through guiding services and small businesses.',
        biodiversity: 'Rich tropical forest ecosystem surrounds the falls. Home to various plant species including ferns, mosses, and native trees. The river system supports freshwater fish and crustaceans. Birds and butterflies frequent the area. The continuous flow maintains a healthy aquatic ecosystem.',
        currentStatus: 'Managed by local barangay as eco-tourism site. Basic facilities including changing rooms and cottages. Ongoing environmental conservation efforts. Growing in popularity but still relatively uncrowded compared to other Cebu waterfalls.',
        visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱30. 4 hours from Cebu City (south). 15-minute walk from entrance to falls. Life jackets available for rent. Cottages for day use (₱100-200). Best visited during dry season (March-May). Bring own food and drinks. Habal-habal transport available from town.'
      },
      
      culturalPractices: [
        'Community-based tourism',
        'Local guide services',
        'Environmental conservation',
        'Summer recreation traditions'
      ],
      
      nativeFloraFauna: [
        'Tropical forest trees',
        'Freshwater fish',
        'Native ferns and mosses',
        'Forest birds and butterflies',
        'River crustaceans'
      ],
      
      preservation: 'Managed by Ginatilan Municipal Tourism Office and local barangay',
      highlights: ['Multi-Tiered Falls', 'Natural Pools', 'Forest Trek']
    },
    { 
      id: 20, 
      name: 'Cebu Provincial Capitol', 
      location: 'Cebu City, Cebu', 
      category: 'Historical Heritage',
      lat: 10.3156,
      lng: 123.8901,
      image: 'src/image/cebucapitol.jpg', 
      rating: 4.6,
      reviews: 1567,
      era: 'American Colonial (1937)',
      heritageStatus: 'National Historical Landmark',
      description: 'Iconic government building with neoclassical architecture, symbolizing Cebu\'s political heritage.',
      established: '1937',
      builtBy: 'Designed by Juan Arellano',
      
      detailedInfo: {
        overview: 'The Cebu Provincial Capitol is the seat of the provincial government of Cebu. Designed by renowned Filipino architect Juan Arellano and completed in 1937, it stands as one of the finest examples of neoclassical architecture in the Philippines. The building has been a witness to significant events in Cebu\'s political history.',
        culturalSignificance: 'Symbol of Cebu\'s governance and political heritage. The capitol has hosted countless historical events and political gatherings. Its architecture represents the American colonial period\'s influence on Philippine public buildings. The structure embodies Cebuano pride and identity.',
        architecture: 'Neoclassical design with prominent columns, symmetrical façade, and grand central dome. The building features marble interiors, detailed woodwork, and impressive halls. The capitol grounds include beautiful gardens, monuments, and the iconic Cebu seal emblem. The main building is flanked by wings housing various provincial offices.',
        currentStatus: 'Active government building serving as office of the Governor and provincial offices. The grounds are open to the public and serve as a popular gathering place for events, celebrations, and protests. Well-maintained with ongoing preservation efforts.',
        visitorInfo: 'Building exterior and grounds open daily. Interior access during office hours (Monday-Friday, 8:00 AM-5:00 PM). Free admission. Located along Osmeña Boulevard. Popular spot for photography, especially at sunset. Events and festivals often held on the grounds. Parking available.'
      },
      
      culturalPractices: [
        'Government ceremonies',
        'Political rallies and protests',
        'Cultural celebrations',
        'Public gatherings and events'
      ],
      
      nativeFloraFauna: [
        'Capitol garden ornamentals',
        'Century-old trees',
        'Manicured lawns',
        'Urban park birds'
      ],
      
      preservation: 'Maintained by Cebu Provincial Government',
      highlights: ['Neoclassical Architecture', 'Government Seat', 'Historical Landmark']
    },
    { 
      id: 21, 
      name: 'Cambuyo Falls', 
      location: 'Alegria, Cebu', 
      category: 'Natural Heritage',
      lat: 9.7500,
      lng: 123.3833,
      image: 'src/image/cambais.jpg', 
      rating: 4.8,
      reviews: 2456,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: 'Hidden cascade with emerald pools and canyon-like rock formations, perfect for adventure seekers.',
      established: 'Natural formation',
      builtBy: 'Natural geological erosion',
      
      detailedInfo: {
        overview: 'Cambuyo Falls, also known as Cambais Falls, is a hidden gem in the municipality of Alegria in southwestern Cebu. The falls feature crystal-clear emerald waters flowing through canyon-like rock formations. The site includes multiple cascades and deep natural pools perfect for swimming and cliff jumping.',
        culturalSignificance: 'Local swimming and recreation spot that has gained popularity among adventure tourists. The falls represent the pristine natural beauty of southwestern Cebu. Local communities benefit from tourism while working to preserve the natural environment.',
        biodiversity: 'Surrounded by dense tropical forest with rich biodiversity. The canyon walls host unique plant species adapted to the moist environment. The clear waters support healthy freshwater ecosystems. Various birds, butterflies, and small mammals inhabit the surrounding forest.',
        currentStatus: 'Emerging eco-tourism destination managed by local community. Basic facilities available. Growing in popularity but still maintains rustic charm. Conservation efforts in place to manage visitor impact.',
        visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱50. About 3.5 hours from Cebu City. 20-minute trek from road to falls. Bring water shoes for slippery rocks. Cliff jumping spots available (proceed with caution). Life jackets recommended for non-swimmers. Local guides available. Best visited during dry season.'
      },
      
      culturalPractices: [
        'Adventure tourism',
        'Cliff jumping culture',
        'Community guiding',
        'Environmental awareness'
      ],
      
      nativeFloraFauna: [
        'Canyon vegetation',
        'Moss and lichen',
        'Freshwater fish',
        'Forest birds',
        'Native tree species'
      ],
      
      preservation: 'Managed by Alegria Municipal Tourism Office and local barangay',
      highlights: ['Emerald Pools', 'Canyon Rocks', 'Adventure Spot']
    },
    { 
      id: 22, 
      name: 'University of San Carlos Museum', 
      location: 'Talamban, Cebu City', 
      category: 'Cultural Heritage',
      lat: 10.3500,
      lng: 123.9167,
      image: 'src/image/usc-museum.jpg', 
      rating: 4.7,
      reviews: 1234,
      era: 'Established 1967',
      heritageStatus: 'University Museum',
      description: 'Premier anthropological museum housing extensive collections of Cebuano and Visayan cultural artifacts.',
      established: '1967',
      builtBy: 'University of San Carlos',
      
      detailedInfo: {
        overview: 'The University of San Carlos Museum is one of the oldest and most comprehensive museums in Cebu. It houses extensive collections in natural history, anthropology, and cultural heritage of Cebu and the Visayas. The museum features pre-colonial artifacts, Spanish colonial religious art, ethnographic materials, and natural specimens.',
        culturalSignificance: 'Serves as an important repository of Cebuano and Visayan cultural heritage. The museum plays a crucial role in education, research, and cultural preservation. It documents the rich history and diverse cultures of the region from pre-colonial times to the present.',
        architecture: 'Purpose-built museum building with climate-controlled galleries. Modern museum facilities designed to properly preserve and display artifacts. Multiple exhibition halls organized by theme and period. Research facilities and archives for scholars.',
        currentStatus: 'Active university museum open to the public. Regularly updated exhibitions. Used for educational programs and research. Well-maintained collections with ongoing acquisition and preservation work.',
        visitorInfo: 'Open Tuesday to Saturday, 9:00 AM to 12:00 PM and 2:00 PM to 5:00 PM. Entrance fee: ₱50 for adults, ₱30 for students. Located at USC Talamban Campus. Guided tours available for groups (advance booking required). Photography restrictions in some areas. Educational programs for schools available.'
      },
      
      culturalPractices: [
        'Cultural education',
        'Research and documentation',
        'Heritage preservation',
        'Academic exhibitions'
      ],
      
      nativeFloraFauna: [
        'Museum botanical specimens',
        'Preserved native species',
        'Natural history collections',
        'Ethnobotanical samples'
      ],
      
      preservation: 'Managed by University of San Carlos',
      highlights: ['Anthropological Collection', 'Cultural Artifacts', 'Educational Resource']
    },
    { 
      id: 23, 
      name: 'Sumilon Island', 
      location: 'Oslob, Cebu', 
      category: 'Natural Heritage',
      lat: 9.4333,
      lng: 123.3833,
      image: 'src/image/sumilon.jpg', 
      rating: 4.9,
      reviews: 3678,
      era: 'Natural formation',
      heritageStatus: 'Marine Sanctuary',
      description: 'Pristine island with shifting sandbars, marine sanctuary, and crystal-clear lagoons.',
      established: 'First marine sanctuary in the Philippines (1974)',
      builtBy: 'Natural coral and sand formation',
      
      detailedInfo: {
        overview: 'Sumilon Island is a small, pristine island located off the coast of Oslob. It holds the distinction of being the site of the first marine sanctuary in the Philippines, established in 1974. The island is famous for its constantly shifting white sandbar, crystal-clear waters, and vibrant marine life. The island features a beautiful lagoon, coral reefs, and a marine sanctuary.',
        culturalSignificance: 'Pioneer in marine conservation in the Philippines. The success of Sumilon\'s marine sanctuary inspired the establishment of marine protected areas throughout the country. Represents Filipino commitment to environmental conservation and sustainable tourism.',
        biodiversity: 'Extremely rich marine biodiversity with healthy coral reefs. Marine sanctuary protects various coral species, tropical fish, sea turtles, and other marine life. The island itself has native coastal vegetation. Bird species use the island as resting point during migration. The shifting sandbar is a unique geological feature.',
        currentStatus: 'Protected marine sanctuary with regulated tourism. Day-trip destination and resort island. Strict environmental rules enforced. Marine research conducted regularly. Continuous conservation efforts by government and resort management.',
        visitorInfo: 'Day tour packages available (₱800-1,500). Resort accommodation available for overnight stays. 3.5 hours from Cebu City, boat transfer from Oslob (15 minutes). Snorkeling gear included in packages. Best visited March to June. Marine sanctuary fee applies. Register at tourism office in Oslob. Can be combined with whale shark watching.'
      },
      
      culturalPractices: [
        'Marine conservation',
        'Sustainable diving and snorkeling',
        'Environmental education',
        'Eco-resort tourism'
      ],
      
      nativeFloraFauna: [
        'Coral reefs (hard and soft)',
        'Tropical reef fish',
        'Sea turtles',
        'Coastal vegetation',
        'Migratory birds'
      ],
      
      preservation: 'Managed by Oslob Municipal Government and resort operator under DENR supervision',
      highlights: ['First Marine Sanctuary', 'Shifting Sandbar', 'Pristine Waters']
    },
    { 
      id: 24, 
      name: 'Colawin Protected Landscape', 
      location: 'Argao, Cebu', 
      category: 'Natural Heritage',
      lat: 9.8833,
      lng: 123.5000,
      image: 'src/image/colawin.jpg', 
      rating: 4.6,
      reviews: 1456,
      era: 'Natural formation',
      heritageStatus: 'Protected Landscape',
      description: 'Mountain forest reserve with diverse wildlife, bird watching opportunities, and eco-trails.',
      established: 'Declared protected area 1968',
      builtBy: 'Natural forest ecosystem',
      
      detailedInfo: {
        overview: 'Colawin Protected Landscape is a 3,000-hectare protected area in Argao, southern Cebu. It represents one of the few remaining montane forests in Cebu with relatively intact ecosystems. The area features diverse flora and fauna, pristine watersheds, and important bird habitats. It serves as a vital watershed for surrounding communities.',
        culturalSignificance: 'Important for biodiversity conservation in Cebu. Represents efforts to preserve remaining natural forests in the province. The protected area is significant for environmental education and research. Local communities play active roles in conservation efforts.',
        biodiversity: 'High biodiversity including endemic and endangered species. Home to various bird species including some endemic to Cebu and the Philippines. Forest supports mammals like civets, wild pigs, and flying foxes. Rich in native trees, orchids, and other plant species. Important watershed ecosystem.',
        currentStatus: 'Active protected area with ongoing conservation programs. Limited tourism to minimize impact. Research activities permitted with proper authorization. Reforestation and habitat restoration ongoing. Community-based forest management in place.',
        visitorInfo: 'Access requires permit from DENR and Argao Municipal Government. Guided eco-tours available through advance arrangement. About 3 hours from Cebu City. Challenging trek suitable for experienced hikers. Bring appropriate gear and supplies. Best for bird watching early morning. Camping possible with permit.'
      },
      
      culturalPractices: [
        'Forest conservation',
        'Community forestry',
        'Bird watching culture',
        'Environmental education'
      ],
      
      nativeFloraFauna: [
        'Native hardwood trees',
        'Endemic bird species',
        'Orchids and ferns',
        'Wild mammals',
        'Forest biodiversity'
      ],
      
      preservation: 'Managed by DENR with community participation',
      highlights: ['Protected Forest', 'Bird Watching', 'Biodiversity Hotspot']
    },
    { 
      id: 25, 
      name: 'Heritage of Cebu Monument', 
      location: 'Parian, Cebu City', 
      category: 'Cultural Heritage',
      lat: 10.2958,
      lng: 123.9006,
      image: 'src/image/heritagecebu.jpg', 
      rating: 4.8,
      reviews: 2789,
      era: 'Modern (2000)',
      heritageStatus: 'Public Monument',
      description: 'Massive sculpture depicting key events in Cebu\'s history from pre-colonial to modern times.',
      established: '2000',
      builtBy: 'Sculptor Eduardo Castrillo',
      
      detailedInfo: {
        overview: 'The Heritage of Cebu Monument is a massive outdoor sculpture located in the Parian district near the Basilica del Santo Niño and Magellan\'s Cross. Created by national artist Eduardo Castrillo, the monument depicts significant events in Cebu\'s history through detailed sculptures and tableaus. It serves as both an artistic masterpiece and historical educational tool.',
        culturalSignificance: 'Synthesizes over 400 years of Cebu\'s history in one artistic work. The monument celebrates Cebu\'s role in Philippine history, from Magellan\'s arrival to modern times. It has become an important landmark and gathering place, symbolizing Cebuano heritage and identity.',
        architecture: 'Multi-level concrete sculpture featuring life-sized figures depicting historical scenes. Key moments include Magellan\'s arrival, the blood compact, Spanish colonization, religious conversion, and modern Cebu. The monument uses various sculptural techniques and incorporates religious and historical symbols. Surrounding area includes heritage walk connecting to nearby historical sites.',
        currentStatus: 'Well-maintained public monument open 24/7. Popular tourist attraction and photography spot. Used as starting point for heritage walks. Hosts cultural events and commemorations. Illuminated at night creating dramatic effect.',
        visitorInfo: 'Open 24 hours. Free admission. Located in Parian district, walking distance from Basilica and Magellan\'s Cross. Best visited during daytime for photography. Heritage walk tours available from local guides. Nearby parking limited. Street food vendors around the area. Combine visit with other heritage sites in walking distance.'
      },
      
      culturalPractices: [
        'Historical education',
        'Heritage walks',
        'Cultural celebrations',
        'Photographic tourism'
      ],
      
      nativeFloraFauna: [
        'Urban plaza plants',
        'Ornamental species',
        'Heritage district trees',
        'City birds'
      ],
      
      preservation: 'Maintained by Cebu City Government',
      highlights: ['Historical Sculpture', 'Artistic Landmark', 'Heritage Site']
    },
    { 
      id: 26, 
      name: 'Cuartel (Spanish Barracks)', 
      location: 'Carcar City, Cebu', 
      category: 'Historical Heritage',
      lat: 10.1000,
      lng: 123.6333,
      image: 'src/image/cuartel.jpg', 
      rating: 4.5,
      reviews: 1123,
      era: 'Spanish Colonial (1870s)',
      heritageStatus: 'Heritage Structure',
      description: 'Ruins of Spanish military barracks, one of the few remaining colonial military structures in Cebu.',
      established: '1870s',
      builtBy: 'Spanish colonial government',
      
      detailedInfo: {
        overview: 'The Cuartel, or Spanish Barracks, is a historical military structure in Carcar City. Built during the late Spanish colonial period, it served as barracks for Spanish soldiers. The structure represents one of the few remaining examples of Spanish military architecture outside Metro Cebu. Though partially in ruins, significant portions remain standing.',
        culturalSignificance: 'Represents Spanish colonial military presence in southern Cebu. The structure witnessed the transition from Spanish to American rule. Important heritage site for understanding colonial-era military operations and architecture. Symbol of Carcar\'s historical significance as a colonial outpost.',
        architecture: 'Coral stone construction typical of Spanish colonial military buildings. Features thick walls for defense, archways, and chambers for soldiers. Original structure had two levels with guard towers. Despite deterioration, architectural details remain visible. The ruins show Spanish colonial construction techniques using local materials.',
        currentStatus: 'Heritage ruins partially preserved. Site accessible to public but under-maintained. Local government and heritage advocates pushing for restoration and conservation. Used occasionally for cultural events and heritage tours. Subject of ongoing preservation discussions.',
        visitorInfo: 'Accessible daily. Free admission. Located in Carcar City proper. About 1.5 hours from Cebu City. Best combined with Carcar heritage tour including churches and ancestral houses. Exercise caution around unstable structures. Carcar is also famous for chicharon (pork rinds) and lechon.'
      },
      
      culturalPractices: [
        'Heritage conservation efforts',
        'Historical education',
        'Cultural tours',
        'Local history preservation'
      ],
      
      nativeFloraFauna: [
        'Heritage site vegetation',
        'Native shrubs',
        'Urban adaptable plants',
        'Local birds'
      ],
      
      preservation: 'Under Carcar City Government with heritage conservation groups',
      highlights: ['Colonial Ruins', 'Military Heritage', 'Spanish Architecture']
    },
    { 
      id: 27, 
      name: 'Nug-as Forest', 
      location: 'Alcoy-Dalaguete, Cebu', 
      category: 'Natural Heritage',
      lat: 9.7167,
      lng: 123.4333,
      image: 'src/image/nugas.jpg', 
      rating: 4.7,
      reviews: 1987,
      era: 'Natural formation',
      heritageStatus: 'Natural Forest Reserve',
      description: 'Cool mountain forest with giant ancient trees, hanging bridges, and nature trails.',
      established: 'Protected forest',
      builtBy: 'Natural forest ecosystem',
      
      detailedInfo: {
        overview: 'Nug-as Forest is a mountain forest straddling the municipalities of Alcoy and Dalaguete in southern Cebu. The forest features towering ancient trees, some over 100 years old, creating a cool and refreshing atmosphere. The area has been developed for eco-tourism with hanging bridges, tree decks, and forest trails while maintaining environmental conservation.',
        culturalSignificance: 'Represents community-led forest conservation. Local communities have protected these forests for generations, recognizing their importance for water sources and biodiversity. The eco-tourism development provides alternative livelihood while preserving the forest. Symbol of successful community environmental management.',
        biodiversity: 'Diverse montane forest ecosystem with native tree species including giant dipterocarps. Home to various bird species, small mammals, and insects. The forest floor supports ferns, orchids, and other understory plants. Important watershed providing water for downstream communities. Microclimate supports unique plant species.',
        currentStatus: 'Active eco-tourism site managed by local community. Well-maintained trails and facilities. Environmental rules strictly enforced. Continuous reforestation efforts. Popular among nature lovers and eco-tourists. Forest research permitted with coordination.',
        visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱50. About 3 hours from Cebu City. Features hanging bridges and viewing decks. Guided forest walks available. Cool temperature, bring jacket. Steep trails require moderate fitness. Cottages for day use. Photography encouraged. Best visited morning or late afternoon.'
      },
      
      culturalPractices: [
        'Community forest management',
        'Eco-tourism',
        'Environmental education',
        'Traditional forest practices'
      ],
      
      nativeFloraFauna: [
        'Ancient native trees',
        'Native orchids',
        'Forest birds',
        'Native ferns',
        'Endemic plant species'
      ],
      
      preservation: 'Community-managed with support from Alcoy and Dalaguete LGUs',
      highlights: ['Ancient Trees', 'Hanging Bridges', 'Eco-Tourism']
    },
    { 
      id: 28, 
      name: 'Lantawan (Tres Reyes Islands)', 
      location: 'Bantayan Island, Cebu', 
      category: 'Natural Heritage',
      lat: 11.1833,
      lng: 123.7000,
      image: 'src/image/lantawan.jpg', 
      rating: 4.8,
      reviews: 2345,
      era: 'Natural formation',
      heritageStatus: 'Island Group',
      description: 'Three pristine islands with powdery white sand beaches, clear waters, and vibrant marine life.',
      established: 'Natural islands',
      builtBy: 'Natural coral and sand formation',
      
      detailedInfo: {
        overview: 'Lantawan, also known as Tres Reyes Islands, consists of three small islands off the coast of Bantayan: Doong Island, Hilantagaan Island, and Kinatarkan Island. These islands feature pristine white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs. Less commercialized than other destinations, they offer authentic island experiences.',
        culturalSignificance: 'Traditional fishing grounds for Bantayan islanders. The islands represent the unspoiled beauty of northern Cebu. Community-based tourism initiatives provide livelihood while preserving natural resources. Popular for island-hopping adventures, showcasing sustainable tourism practices.',
        biodiversity: 'Rich marine ecosystems with healthy coral reefs. Abundant fish species, some endemic to the region. Sea turtles occasionally visit the area. Seagrass beds support marine biodiversity. Islands have coastal vegetation including coconut palms and native shrubs. Important habitat for coastal and marine species.',
        currentStatus: 'Active island-hopping destinations. Managed by local communities. Basic facilities available on some islands. Growing tourism managed sustainably. Environmental conservation efforts ongoing. Some areas designated as fish sanctuaries.',
        visitorInfo: 'Access via island-hopping tours from Bantayan (₱1,500-2,500 for group). Tours typically visit 2-3 islands. Best visited March to June. Snorkeling gear often included. Bring own food and drinks (limited vendors). Day tours only, no overnight stays. Environmental fees apply. Book through Bantayan tourism office or accredited operators.'
      },
      
      culturalPractices: [
        'Traditional fishing',
        'Island-hopping culture',
        'Community-based tourism',
        'Marine conservation'
      ],
      
      nativeFloraFauna: [
        'Coral reefs',
        'Tropical fish species',
        'Coconut palms',
        'Seagrass beds',
        'Coastal birds'
      ],
      
      preservation: 'Community-managed with Bantayan Municipal Government oversight',
      highlights: ['Three Islands', 'Pristine Beaches', 'Island Hopping']
    },
    { 
      id: 29, 
      name: 'Cebu Metropolitan Cathedral', 
      location: 'Cebu City, Cebu', 
      category: 'Historical Heritage',
      lat: 10.2952,
      lng: 123.9022,
      image: 'src/image/cathedral.webp', 
      rating: 4.7,
      reviews: 2456,
      era: 'Spanish Colonial (1689, rebuilt 1835)',
      heritageStatus: 'Metropolitan Cathedral',
      description: 'The ecclesiastical seat of the Archdiocese of Cebu, featuring colonial architecture and religious heritage.',
      established: 'Original 1689, current structure 1835',
      builtBy: 'Catholic Church/Archdiocese of Cebu',
      
      detailedInfo: {
        overview: 'The Metropolitan Cathedral of Cebu, officially the Metropolitan Cathedral and Parish of St. Vitales, is the ecclesiastical seat of the Metropolitan Archdiocese of Cebu. The cathedral has a long history dating back to 1689, though the current structure was completed in 1835. It stands as one of the oldest cathedrals in the Philippines and witnessed significant events in Cebu\'s religious history.',
        culturalSignificance: 'Serves as the mother church of the Archdiocese of Cebu, one of the oldest dioceses in Asia. The cathedral represents the establishment and growth of Catholicism in the Philippines. Important venue for significant religious ceremonies and celebrations. Symbol of Cebuano Catholic faith and heritage.',
        architecture: 'Spanish colonial architecture with baroque influences. Features coral stone construction, thick walls, religious artwork, and stained glass windows. The cathedral underwent several renovations maintaining its historical character while improving structural integrity. Interior features ornate altars, religious statues, and historical artifacts.',
        currentStatus: 'Active cathedral with regular masses and religious ceremonies. Seat of the Archbishop of Cebu. Pilgrimage site for Catholics. Well-maintained through ongoing preservation efforts. Major venue for important religious celebrations including Sinulog religious activities.',
        visitorInfo: 'Open daily for mass and prayer. Free admission. Modest dress required. Mass schedules: Multiple times daily (check cathedral for current schedule). Located in downtown Cebu City. Walking distance from Basilica del Santo Niño. Museum and treasury visits by arrangement. Photography allowed but respectful behavior required.'
      },
      
      culturalPractices: [
        'Catholic masses and ceremonies',
        'Religious pilgrimages',
        'Sinulog religious activities',
        'Weddings and baptisms'
      ],
      
      nativeFloraFauna: [
        'Cathedral garden plants',
        'Heritage trees',
        'Ornamental flora',
        'Urban birds'
      ],
      
      preservation: 'Maintained by Archdiocese of Cebu',
      highlights: ['Mother Church', 'Colonial Architecture', 'Religious Heritage']
    },
    { 
      id: 30, 
      name: 'Buwakan ni Alejandra', 
      location: 'Balamban, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.4833,
      lng: 123.7167,
      image: 'src/image/buwakan.jpg', 
      rating: 4.6,
      reviews: 1678,
      era: 'Modern (2016)',
      heritageStatus: 'Agri-Tourism Site',
      description: 'Sprawling flower and vegetable farm featuring themed gardens, mountain views, and local produce.',
      established: '2016',
      builtBy: 'Local agricultural entrepreneurs',
      
      detailedInfo: {
        overview: 'Buwakan ni Alejandra is a vast flower and vegetable farm located in the mountains of Balamban, western Cebu. The 7-hectare farm features themed gardens including flower gardens, vegetable patches, and ornamental plant sections. The site offers panoramic mountain views and promotes agri-tourism, organic farming, and environmental awareness.',
        culturalSignificance: 'Represents the growing agri-tourism trend in Cebu. Showcases local agricultural practices and sustainable farming. The farm provides educational opportunities about farming and environmental stewardship. Important for rural economic development through tourism diversification.',
        biodiversity: 'Cultivated flower varieties including sunflowers, zinnias, and ornamental species. Organic vegetable production supports pollinators. The mountain location provides cool climate for temperate plants. Surrounding area retains some native mountain vegetation. Farm practices support soil health and biodiversity.',
        currentStatus: 'Active agri-tourism destination. Continuously developing new garden sections and attractions. Popular for family outings, team building, and photography. Farm-to-table restaurant on-site. Hosts events and festivals. Educational farm tours available.',
        visitorInfo: 'Open daily 7:00 AM to 6:00 PM. Entrance fee: ₱100-150. About 1.5-2 hours from Cebu City. Cool mountain temperature, bring light jacket. Restaurant serves organic vegetables grown on-site. Fresh produce available for purchase. Best visited during flower season. Photo spots throughout the farm. Parking available.'
      },
      
      culturalPractices: [
        'Agri-tourism',
        'Organic farming practices',
        'Environmental education',
        'Farm-to-table dining'
      ],
      
      nativeFloraFauna: [
        'Sunflowers',
        'Ornamental flowers',
        'Organic vegetables',
        'Pollinators (bees, butterflies)',
        'Mountain vegetation'
      ],
      
      preservation: 'Privately owned and maintained',
      highlights: ['Flower Gardens', 'Mountain Views', 'Organic Farm']
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

  const filteredDestinations = cebuSites
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.reviews - a.reviews;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Function to navigate to Explore page with selected location
  const goToMapLocation = (dest) => {
    // Create a destination object with all necessary data for Explore.jsx
    const destinationForExplore = {
      id: dest.id,
      name: dest.name,
      location: dest.location,
      lat: dest.lat,
      lng: dest.lng,
      image: dest.image,
      description: dest.description,
      category: dest.category,
      heritageStatus: dest.heritageStatus,
      era: dest.era,
      region: dest.region,
      established: dest.established,
      builtBy: dest.builtBy,
      detailedInfo: dest.detailedInfo,
      culturalPractices: dest.culturalPractices,
      nativeFloraFauna: dest.nativeFloraFauna,
      preservation: dest.preservation
    };
    
    localStorage.setItem('selectedDestination', JSON.stringify(destinationForExplore));
    navigate('/explore');
  };

  return (
    <div style={{ 
      paddingTop: `${navbarHeight}px`, 
      paddingBottom: `${footerHeight}px`, 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)'
    }}>
      {/* Hero Section - Changed background to Cebu-specific */}
      <div 
        className="position-relative overflow-hidden"
        style={{
          height: '400px',
          backgroundImage: 'url(src/image/cebu-skyline.jpg)', // Changed from coron.jpg to Cebu image
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.92) 0%, rgba(44, 82, 130, 0.88) 50%, rgba(26, 54, 93, 0.90) 100%)'
          }}
        />
        
        <div className="position-relative h-100 d-flex align-items-center justify-content-center text-center text-white px-4" style={{ zIndex: 1 }}>
          <div style={{ maxWidth: '800px', animation: 'fadeInUp 0.8s ease' }}>
            <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.7)' }}>
              More Cebu{' '}
              <span style={{
                background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Destinations
              </span>
            </h1>
            <p className="fs-5 mb-4" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
              Discover {cebuSites.length} more cultural, historical, and natural treasures across Cebu Province
            </p>
            
            {/* Search Bar */}
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <div className="position-relative">
                <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 py-3"
                  placeholder="Search more Cebu destinations..."
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
              {/* Category Filter */}
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: 'auto',
                  minWidth: '200px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  fontWeight: '500',
                  color: '#1e3a5f'
                }}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
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
              Showing <span className="fw-bold text-dark">{filteredDestinations.length}</span> destination{filteredDestinations.length !== 1 ? 's' : ''}
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
                        background: 'rgba(148, 163, 184, 0.9)',
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
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          border: 'none',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          animation: 'fadeIn 0.2s ease',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
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
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDestination(dest);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
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
            <h3 className="h4 mt-3 mb-2" style={{ color: '#64748b' }}>No destinations found</h3>
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
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '10px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    flex: 1,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                  onClick={() => {
                    setSelectedDestination(null);
                    goToMapLocation(selectedDestination);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
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

export default Destinations;