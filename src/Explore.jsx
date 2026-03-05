import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { MapPin, X, Info, Calendar, Users, Flag, Award, Globe, Home, Search, Navigation, Compass, Bus } from 'lucide-react';

// ─── Static sites ────────────────────────────────────────────────────────────
const cebuSites = [
  {
    id: 1,
    name: 'Magellan\'s Cross',
    location: 'Cebu City, Cebu',
    lat: 10.2935,
    lng: 123.9019,
    image: 'src/image/magellans-cross.jpg',
    description: 'Historic cross planted by Ferdinand Magellan upon arriving in Cebu in 1521.',
    category: 'Historical Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (1521)',
    region: 'Central Visayas',
    established: 'March 15, 1521',
    builtBy: 'Ferdinand Magellan and Spanish explorers',
    detailedInfo: {
      overview: 'Magellan\'s Cross is a Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan upon arriving in Cebu in the Philippines on March 15, 1521.',
      culturalSignificance: 'Marks the birth of Roman Catholicism in the Philippines and represents the beginning of Spanish colonization.',
      architecture: 'The cross is housed in a small octagonal chapel built in 1834 with a painted ceiling depicting the historic planting of the cross.',
      currentStatus: 'Active pilgrimage site visited by thousands daily.',
      visitorInfo: 'Open daily from 6:00 AM to 8:00 PM. Free admission.',
      transportationFee: 'Jeepney from Carbon Market: ₱12\nTaxi from any Cebu City hotel: ₱80–150\nWalking distance from Santo Niño Basilica: ~2 minutes'
    },
    culturalPractices: ['Candle lighting rituals','Prayer offerings for healing','Religious pilgrimages','Sinulog Festival connection'],
    nativeFloraFauna: ['Urban plaza trees (acacia)','Ornamental plants (bougainvillea)','City birds (maya sparrows)'],
    preservation: 'Managed by the Augustinian Province of Santo Niño de Cebu.'
  },
  {
    id: 2,
    name: 'Fort San Pedro',
    location: 'Cebu City, Cebu',
    lat: 10.2922,
    lng: 123.9058,
    image: 'src/image/fort-san-pedro.jpg',
    description: 'The oldest and smallest triangular bastion fort in the Philippines, built in 1565.',
    category: 'Historical Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (1565)',
    region: 'Central Visayas',
    established: '1565 (rebuilt 1738)',
    builtBy: 'Spanish conquistadors under Miguel López de Legazpi',
    detailedInfo: {
      overview: 'Fort San Pedro is a military defense structure built by Spanish conquistador Miguel López de Legazpi in 1565.',
      culturalSignificance: 'Represents the military might of Spanish colonial rule and served as a defense against Muslim raiders.',
      architecture: 'Triangular bastion fort made of coral stones featuring three bastions.',
      currentStatus: 'Now a historical park and museum.',
      visitorInfo: 'Open daily 7:00 AM to 7:00 PM. Entrance fee: ₱30 for adults.',
      transportationFee: 'Jeepney from Colon Street: ₱12\nTricycle from nearby areas: ₱20–30\nWalking from downtown Cebu: ~10 minutes'
    },
    culturalPractices: ['Historical reenactments','Cultural performances','Educational heritage tours'],
    nativeFloraFauna: ['Heritage trees (century-old acacia)','Flowering shrubs','Fort garden plants'],
    preservation: 'Managed by Cebu City Government Tourism Office and NHCP.'
  },
  {
    id: 3,
    name: 'Basilica del Santo Niño',
    location: 'Cebu City, Cebu',
    lat: 10.2947,
    lng: 123.9012,
    image: 'src/image/santo-nino.jpg',
    description: 'The oldest Roman Catholic church in the Philippines, founded in 1565.',
    category: 'Historical Heritage',
    heritageStatus: 'Minor Basilica, National Cultural Treasure',
    era: 'Spanish Colonial (1565)',
    region: 'Central Visayas',
    established: '1565',
    builtBy: 'Augustinian friars',
    detailedInfo: {
      overview: 'The Basilica Minore del Santo Niño de Cebu is the oldest Roman Catholic church in the Philippines.',
      culturalSignificance: 'Center of Catholic devotion in Cebu and the entire Philippines.',
      architecture: 'Baroque architecture with thick walls and buttresses.',
      currentStatus: 'Active place of worship with daily masses.',
      visitorInfo: 'Open daily 5:00 AM to 8:00 PM. Free admission.',
      transportationFee: 'Jeepney from Carbon Market: ₱12\nTaxi from Cebu City hotels: ₱80–120\nHabal-habal: ₱30–50 per person'
    },
    culturalPractices: ['Sinulog Festival (January)','Novena masses','Candle offerings','Traditional Catholic rituals'],
    nativeFloraFauna: ['Basilica courtyard plants','Heritage trees','Religious garden flora'],
    preservation: 'Managed by the Augustinian Province of Santo Niño de Cebu and National Museum.'
  },
  {
    id: 6,
    name: 'Osmeña Peak',
    location: 'Badian, Cebu',
    lat: 9.8201,
    lng: 123.4424,
    image: 'src/image/osmena-peak.jpg',
    description: 'The highest peak in Cebu at 1,015 meters, offering panoramic views of jagged hills.',
    category: 'Natural Heritage',
    heritageStatus: 'Natural Landmark',
    era: 'Geological formation',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural geological processes',
    detailedInfo: {
      overview: 'Osmeña Peak is the highest point in Cebu Island at 1,015 meters above sea level.',
      culturalSignificance: 'Named after Sergio Osmeña Sr., the second President of the Philippines.',
      biodiversity: 'Cool highland climate supporting unique vegetation.',
      currentStatus: 'Popular hiking and camping destination.',
      visitorInfo: 'Open 24/7. Entrance fee: ₱30. 3-4 hours drive from Cebu City.',
      transportationFee: 'Bus from South Bus Terminal to Dalaguete: ₱80–100 (3 hrs)\nHabal-habal from Dalaguete to Peak: ₱150–200 per person\nPrivate vehicle: Available via rental'
    },
    culturalPractices: ['Eco-tourism','Hiking and camping culture','Photography tourism'],
    nativeFloraFauna: ['Pine trees','Highland grasses','Wildflowers','Mountain birds'],
    preservation: 'Managed by Dalaguete Municipal Government with local community involvement.'
  },
  {
    id: 7,
    name: 'Kawasan Falls',
    location: 'Badian, Cebu',
    lat: 9.800,
    lng: 123.367,
    image: 'src/image/kawasan-falls.webp',
    description: 'A three-tiered waterfall system with turquoise blue waters, popular for canyoneering.',
    category: 'Natural Heritage',
    heritageStatus: 'Protected Natural Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural hydrological processes',
    detailedInfo: {
      overview: 'Kawasan Falls is a three-stage cascade of clear turquoise water located in the mountainous interior of Badian.',
      culturalSignificance: 'One of Cebu\'s most iconic natural attractions.',
      biodiversity: 'Lush tropical forest surrounds the falls with diverse plant and animal life.',
      currentStatus: 'Major tourist destination with developed facilities.',
      visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱40.',
      transportationFee: 'Bus from South Bus Terminal to Badian: ₱120–150 (3.5 hrs)\nHabal-habal from highway to falls: ₱100–150\nCanyoneering package from Badian: ₱500–800 (includes guide)'
    },
    culturalPractices: ['Adventure tourism','Canyoneering culture','Community-based tourism'],
    nativeFloraFauna: ['Tropical forest trees','Bamboo groves','Ferns and mosses','Freshwater fish'],
    preservation: 'Managed by Badian Municipal Government.'
  },
  {
    id: 10,
    name: 'Moalboal - Pescador Island',
    location: 'Moalboal, Cebu',
    lat: 9.9232,
    lng: 123.3435,
    image: 'src/image/moalboal.jpg',
    description: 'Famous for the sardine run, turtle sanctuary, and world-class diving at Pescador Island.',
    category: 'Natural Heritage',
    heritageStatus: 'Marine Protected Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Marine sanctuary since 1980s',
    builtBy: 'Natural marine ecosystem',
    detailedInfo: {
      overview: 'Moalboal is a coastal town famous for its incredible marine biodiversity.',
      culturalSignificance: 'Transformed from a quiet fishing village into an international diving destination.',
      biodiversity: 'Extremely rich marine life including millions of sardines, sea turtles, and colorful reef fish.',
      currentStatus: 'Thriving eco-tourism and diving destination.',
      visitorInfo: 'Best diving March to June. About 3 hours from Cebu City.',
      transportationFee: 'Bus from South Bus Terminal to Moalboal: ₱100–130 (3 hrs)\nHabal-habal to Panagsama Beach: ₱30–50\nBoat to Pescador Island: ₱500–700 per boat (shared)'
    },
    culturalPractices: ['Sustainable diving tourism','Marine conservation efforts','Community-based tourism'],
    nativeFloraFauna: ['Sardine schools (millions)','Green and hawksbill sea turtles','Coral reefs','Tropical reef fish'],
    preservation: 'Managed by Moalboal Municipal Government through Marine Protected Area.'
  },
  {
    id: 13,
    name: 'Temple of Leah',
    location: 'Busay, Cebu City',
    lat: 10.3689,
    lng: 123.8733,
    image: 'src/image/temple-leah.jpg',
    description: 'Grandiose Greco-Roman temple built as a monument of love, offering panoramic city views.',
    category: 'Cultural Heritage',
    heritageStatus: 'Private Monument',
    era: 'Modern (2012)',
    region: 'Central Visayas',
    established: '2012 (ongoing construction)',
    builtBy: 'Teodorico Soriano Adarna',
    detailedInfo: {
      overview: 'The Temple of Leah is a grand Greco-Roman-inspired structure built as a symbol of undying love.',
      culturalSignificance: 'Represents modern expressions of love and devotion. Often called the "Taj Mahal of Cebu."',
      architecture: 'Greco-Roman architecture with 24 chambers housing art collection and a chapel.',
      currentStatus: 'Open to public as a museum and tourist attraction.',
      visitorInfo: 'Open daily 6:00 AM to 11:00 PM. Entrance fee: ₱50.',
      transportationFee: 'Taxi from downtown Cebu: ₱150–250\nHabal-habal from Lahug: ₱80–120 per person\nPrivate car: ~20 minutes from IT Park'
    },
    culturalPractices: ['Modern monument culture','Wedding photography','Cultural tourism'],
    nativeFloraFauna: ['Landscaped gardens','Ornamental plants','Mountain vegetation'],
    preservation: 'Privately owned and maintained by the Adarna family.'
  },
  {
    id: 18,
    name: 'Cebu Taoist Temple',
    location: 'Beverly Hills, Cebu City',
    lat: 10.3338,
    lng: 123.8877,
    image: 'src/image/taoist.jpg',
    description: 'Stunning Chinese temple built by Cebu\'s Chinese community, offering panoramic city views.',
    category: 'Cultural Heritage',
    heritageStatus: 'Religious and Cultural Landmark',
    era: 'Modern (1972)',
    region: 'Central Visayas',
    established: '1972',
    builtBy: 'Cebu Chinese community',
    detailedInfo: {
      overview: 'The Cebu Taoist Temple is located 300 meters above sea level in the Beverly Hills subdivision.',
      culturalSignificance: 'Represents the rich Chinese-Filipino heritage in Cebu.',
      architecture: 'Multi-tiered temple featuring traditional Chinese architecture with ornate dragons and colorful pagoda roofs.',
      currentStatus: 'Active place of worship and major tourist attraction.',
      visitorInfo: 'Open Wednesday to Sunday, 6:00 AM to 6:00 PM. Free admission.',
      transportationFee: 'Taxi from downtown Cebu: ₱120–200\nHabal-habal from Lahug area: ₱60–100\nJeepney to Beverly Hills gate, then walk: ₱12 + ₱30 tricycle'
    },
    culturalPractices: ['Taoist worship rituals','Fortune telling traditions','Chinese festivals'],
    nativeFloraFauna: ['Temple garden plants','Ornamental Chinese plants','Bonsai trees'],
    preservation: 'Maintained by Cebu Chinese community and temple management.'
  },
  {
    id: 11,
    name: 'Malapascua Island',
    location: 'Daanbantayan, Cebu',
    lat: 11.3347,
    lng: 124.1161,
    image: 'src/image/malapascua.jpg',
    description: 'Small island paradise famous for thresher shark diving and pristine white beaches.',
    category: 'Natural Heritage',
    heritageStatus: 'Marine Protected Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural island',
    builtBy: 'Natural coral and sand formation',
    detailedInfo: {
      overview: 'Malapascua Island is a small tropical island measuring only 2.5km long, world-renowned for thresher shark diving.',
      culturalSignificance: 'Rose to international fame in the 1990s when divers discovered regular thresher shark sightings.',
      biodiversity: 'Famous for pelagic thresher sharks, manta rays, and occasional whale sharks.',
      currentStatus: 'Premier diving destination attracting divers worldwide.',
      visitorInfo: 'Access via 30-minute boat from Maya Port. Best season November to May.',
      transportationFee: 'Bus from North Bus Terminal to Maya Port: ₱130–150 (4 hrs)\nBoat from Maya Port to Malapascua: ₱100–150 per person (30 min)\nDive packages: ₱1,200–2,500 per dive'
    },
    culturalPractices: ['World-class diving culture','Sustainable island tourism','Traditional fishing practices'],
    nativeFloraFauna: ['Thresher sharks','Manta rays','Coral reefs','Macro marine life'],
    preservation: 'Managed by Daanbantayan Municipal Government with dive operator consortium.'
  },
  {
    id: 57,
    name: '10,000 Roses Cafe & More',
    location: 'Cordova, Cebu',
    lat: 10.256639,
    lng: 123.932403,
    image: 'src/image/10,000Roses.webp',
    description: 'Cebu\'s most photographed Instagram landmark — thousands of white LED roses along the Cordova coastline.',
    category: 'Cultural Heritage',
    heritageStatus: 'Iconic Tourist Landmark and Cafe',
    era: 'Modern (2016)',
    region: 'Central Visayas',
    established: '2016',
    builtBy: 'Private developers and Cordova local government',
    detailedInfo: {
      overview: '10,000 Roses features a breathtaking installation of thousands of white artificial roses by the sea.',
      culturalSignificance: 'One of the most widely photographed tourist attractions in Cebu.',
      architecture: 'Thousands of white artificial roses with LED lights along the waterfront.',
      currentStatus: 'Active tourist attraction and cafe open daily.',
      visitorInfo: 'Open daily, best after 6:00 PM. Entrance fee: ₱50–100.',
      transportationFee: 'Jeepney from Cebu City to Cordova: ₱15–20\nMotorcycle/habal-habal from Cordova town: ₱30–50\nTaxi from Mactan Airport: ₱200–300'
    },
    culturalPractices: ['Romantic date outings','Social media photography','Evening seaside recreation'],
    nativeFloraFauna: ['Artificial LED rose installation','Coastal vegetation','Seabirds'],
    preservation: 'Maintained by private management in coordination with Cordova Municipal Government.'
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
      culturalPractices: ['Community-based tourism','Local guide services','Environmental conservation','Summer recreation traditions'],
      nativeFloraFauna: ['Tropical forest trees','Freshwater fish','Native ferns and mosses','Forest birds and butterflies','River crustaceans'],
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
      culturalPractices: ['Government ceremonies','Political rallies and protests','Cultural celebrations','Public gatherings and events'],
      nativeFloraFauna: ['Capitol garden ornamentals','Century-old trees','Manicured lawns','Urban park birds'],
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
      culturalPractices: ['Adventure tourism','Cliff jumping culture','Community guiding','Environmental awareness'],
      nativeFloraFauna: ['Canyon vegetation','Moss and lichen','Freshwater fish','Forest birds','Native tree species'],
      preservation: 'Managed by Alegria Municipal Tourism Office and local barangay',
      highlights: ['Emerald Pools', 'Canyon Rocks', 'Adventure Spot']
    },
    { 
      id: 22, 
      name: 'University of San Carlos Museum', 
      location: 'Cebu City, Cebu', 
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
      culturalPractices: ['Cultural education','Research and documentation','Heritage preservation','Academic exhibitions'],
      nativeFloraFauna: ['Museum botanical specimens','Preserved native species','Natural history collections','Ethnobotanical samples'],
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
      culturalPractices: ['Marine conservation','Sustainable diving and snorkeling','Environmental education','Eco-resort tourism'],
      nativeFloraFauna: ['Coral reefs (hard and soft)','Tropical reef fish','Sea turtles','Coastal vegetation','Migratory birds'],
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
      culturalPractices: ['Forest conservation','Community forestry','Bird watching culture','Environmental education'],
      nativeFloraFauna: ['Native hardwood trees','Endemic bird species','Orchids and ferns','Wild mammals','Forest biodiversity'],
      preservation: 'Managed by DENR with community participation',
      highlights: ['Protected Forest', 'Bird Watching', 'Biodiversity Hotspot']
    },
    { 
      id: 25, 
      name: 'Heritage of Cebu Monument', 
      location: 'Cebu City, Cebu', 
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
      culturalPractices: ['Historical education','Heritage walks','Cultural celebrations','Photographic tourism'],
      nativeFloraFauna: ['Urban plaza plants','Ornamental species','Heritage district trees','City birds'],
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
      culturalPractices: ['Heritage conservation efforts','Historical education','Cultural tours','Local history preservation'],
      nativeFloraFauna: ['Heritage site vegetation','Native shrubs','Urban adaptable plants','Local birds'],
      preservation: 'Under Carcar City Government with heritage conservation groups',
      highlights: ['Colonial Ruins', 'Military Heritage', 'Spanish Architecture']
    },
    { 
      id: 27, 
      name: 'Nug-as Forest', 
      location: 'Alcoy, Cebu', 
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
      culturalPractices: ['Community forest management','Eco-tourism','Environmental education','Traditional forest practices'],
      nativeFloraFauna: ['Ancient native trees','Native orchids','Forest birds','Native ferns','Endemic plant species'],
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
      culturalPractices: ['Traditional fishing','Island-hopping culture','Community-based tourism','Marine conservation'],
      nativeFloraFauna: ['Coral reefs','Tropical fish species','Coconut palms','Seagrass beds','Coastal birds'],
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
      culturalPractices: ['Catholic masses and ceremonies','Religious pilgrimages','Sinulog religious activities','Weddings and baptisms'],
      nativeFloraFauna: ['Cathedral garden plants','Heritage trees','Ornamental flora','Urban birds'],
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
      culturalPractices: ['Agri-tourism','Organic farming practices','Environmental education','Farm-to-table dining'],
      nativeFloraFauna: ['Sunflowers','Ornamental flowers','Organic vegetables','Pollinators (bees, butterflies)','Mountain vegetation'],
      preservation: 'Privately owned and maintained',
      highlights: ['Flower Gardens', 'Mountain Views', 'Organic Farm']
    },
    { 
      id: 31, 
      name: 'Kugtong Spring', 
      location: 'Alcantara, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3667,
      lng: 123.4000,
      image: 'src/image/kugtong.webp', 
      rating: 4.5,
      reviews: 1234,
      era: 'Natural formation',
      heritageStatus: 'Natural Spring',
      description: 'Natural spring with crystal-clear freshwater pools, perfect for swimming and relaxation in a serene environment.',
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: 'Kugtong Spring is a natural freshwater spring located in Alcantara, western Cebu. The spring features cool, clear water that flows year-round, creating natural pools perfect for swimming. Surrounded by lush vegetation, it offers a refreshing escape and a peaceful natural setting for visitors.',
        culturalSignificance: 'Important natural resource for the local community of Alcantara. The spring has been a gathering place for locals for generations and represents the natural beauty of western Cebu. Growing popularity as an eco-tourism destination while maintaining its natural charm.',
        biodiversity: 'Freshwater ecosystem supporting aquatic plants and fish. The surrounding area features native trees and vegetation that provide shade and habitat for birds and small animals. The clean spring water indicates a healthy watershed.',
        currentStatus: 'Managed by local community as a natural swimming spot. Basic facilities available. Growing in popularity among locals and tourists. Efforts to maintain cleanliness and preserve natural environment.',
        visitorInfo: 'Open daily. Entrance fee varies. About 1.5 hours from Cebu City. Basic facilities including changing areas. Best visited during dry season. Bring own food and towels. The water is naturally cool and refreshing. Popular on weekends and holidays.'
      },
      culturalPractices: ['Community swimming traditions','Local recreation','Environmental conservation','Family gatherings'],
      nativeFloraFauna: ['Freshwater fish','Native trees','Aquatic plants','Forest birds','Stream vegetation'],
      preservation: 'Managed by Alcantara local community',
      highlights: ['Natural Spring', 'Swimming Spot', 'Cool Waters']
    },
    { 
      id: 32, 
      name: 'Sea Paradise Boardwalk', 
      location: 'Alcantara, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.3583,
      lng: 123.4083,
      image: 'src/image/Alcantara-Cebu-Sea-Paradise.webp', 
      rating: 4.6,
      reviews: 1567,
      era: 'Modern (Recent)',
      heritageStatus: 'Coastal Tourism Attraction',
      description: 'Scenic boardwalk along the coast offering stunning sea views, sunset watching, and a relaxing walk by the water.',
      established: 'Recent development',
      builtBy: 'Alcantara Municipal Government',
      detailedInfo: {
        overview: 'Sea Paradise Boardwalk is a modern coastal attraction in Alcantara that provides visitors with a scenic walkway along the shoreline. The boardwalk offers panoramic views of the sea, making it a popular spot for sunset watching, photography, and leisurely walks. It has become a key attraction for both locals and tourists visiting western Cebu.',
        culturalSignificance: 'Represents Alcantara\'s development of coastal tourism infrastructure. The boardwalk has become a gathering place for the community and helps showcase the natural beauty of the town\'s coastline. Important for local economy through tourism development.',
        architecture: 'Modern boardwalk construction with sturdy materials designed to withstand coastal conditions. Features viewing areas, benches, and lighting for evening visits. The design complements the natural coastal landscape while providing safe access to the shoreline.',
        currentStatus: 'Active tourism destination managed by local government. Well-maintained with regular upkeep. Popular during sunset hours and weekends. Used for community events and gatherings. Continues to attract visitors to Alcantara.',
        visitorInfo: 'Open daily. Free or minimal entrance fee. About 1.5 hours from Cebu City. Best visited during late afternoon for sunset views. Parking available nearby. Food vendors often present. Good for photography. Bring sun protection during daytime visits.'
      },
      culturalPractices: ['Sunset watching','Community gatherings','Photography','Coastal recreation'],
      nativeFloraFauna: ['Coastal vegetation','Seabirds','Marine life views','Mangrove species','Coastal plants'],
      preservation: 'Maintained by Alcantara Municipal Government',
      highlights: ['Coastal Views', 'Sunset Spot', 'Boardwalk']
    },
    { 
      id: 33, 
      name: 'Hermit\'s Cove', 
      location: 'Aloguinsan, Cebu', 
      category: 'Natural Heritage',
      lat: 10.2167,
      lng: 123.5500,
      image: 'src/image/hermits-cove.webp', 
      rating: 4.7,
      reviews: 1845,
      era: 'Natural formation',
      heritageStatus: 'Natural Beach Cove',
      description: 'Hidden beach cove with pristine white sand, crystal-clear waters, and dramatic limestone cliffs perfect for cliff diving.',
      established: 'Natural formation',
      builtBy: 'Natural coastal and geological processes',
      detailedInfo: {
        overview: 'Hermit\'s Cove is a secluded beach destination in Aloguinsan, western Cebu. The cove features a beautiful white sand beach surrounded by towering limestone cliffs and clear turquoise waters. Popular for its cliff diving spots, natural rock formations, and relatively uncrowded atmosphere, it offers an authentic beach experience away from commercialized resorts.',
        culturalSignificance: 'Represents the natural coastal beauty of western Cebu. The cove has become an important eco-tourism destination for Aloguinsan, providing livelihood opportunities for local communities through tourism services. The name reflects the area\'s secluded, peaceful nature, making it feel like a hidden hermit\'s retreat.',
        biodiversity: 'Healthy marine ecosystem with coral formations and diverse fish species. The limestone cliffs support unique coastal vegetation adapted to the salt spray environment. Coastal birds frequent the area. The clear waters indicate good water quality and minimal pollution. Rock pools at low tide reveal small marine creatures.',
        currentStatus: 'Growing eco-tourism destination managed by local community. Basic facilities including cottages and changing areas. Adventure tourism activities like cliff diving available. Efforts to maintain natural environment while accommodating visitors. Popular among local and domestic tourists.',
        visitorInfo: 'Open daily. Entrance fee: ₱50-100. About 2 hours from Cebu City. 15-minute walk or short boat ride from main road. Cliff diving spots at various heights (proceed with caution). Life jackets recommended for non-swimmers. Cottages available for day use. Bring own food and drinks. Best visited during dry season. Snorkeling possible in calm waters.'
      },
      culturalPractices: ['Cliff diving culture','Community-based tourism','Beach recreation','Environmental conservation'],
      nativeFloraFauna: ['Limestone cliff vegetation','Coastal fish species','Coral formations','Seabirds','Native coastal plants'],
      preservation: 'Managed by Aloguinsan local community and municipal tourism office',
      highlights: ['Hidden Cove', 'Cliff Diving', 'White Sand Beach']
    },
    { 
      id: 34, 
      name: 'Buswang Lake', 
      location: 'Asturias, Cebu', 
      category: 'Natural Heritage',
      lat: 10.5500,
      lng: 123.7167,
      image: 'src/image/BuswangLake.webp', 
      rating: 4.6,
      reviews: 1456,
      era: 'Natural formation',
      heritageStatus: 'Natural Lake',
      description: 'Serene mountain lake surrounded by lush forest, perfect for kayaking, fishing, and peaceful nature immersion.',
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: 'Buswang Lake is a tranquil freshwater lake nestled in the mountains of Asturias, northern Cebu. The lake is surrounded by verdant forest and offers a peaceful escape from the busy coastal areas. Known for its calm waters and scenic beauty, it has become a destination for nature lovers seeking relaxation and outdoor activities like kayaking and fishing.',
        culturalSignificance: 'Important natural resource for the local communities of Asturias. The lake has historical significance as a traditional fishing area and water source. Represents the natural heritage of northern Cebu and the importance of preserving inland freshwater ecosystems. Growing in recognition as an eco-tourism destination.',
        biodiversity: 'Freshwater ecosystem supporting various fish species including tilapia and other native species. The surrounding forest provides habitat for birds, butterflies, and small mammals. Aquatic plants grow along the lake edges. The area\'s biodiversity is relatively intact due to its remote mountain location and community conservation efforts.',
        currentStatus: 'Managed as a community eco-tourism destination. Basic facilities including bamboo rafts and cottages available. Growing in popularity among locals and adventure tourists. Conservation efforts in place to maintain water quality and surrounding forest. Still relatively undeveloped, maintaining its natural character.',
        visitorInfo: 'Open daily. Entrance fee: ₱50-100. About 2-2.5 hours from Cebu City. Bamboo raft rides available (₱150-200). Fishing allowed with local permits. Cottages for day use. Bring own food and drinks. Best visited during dry season for clearer skies. Cool mountain temperature, bring light jacket. Swimming possible but water can be deep. Life jackets recommended.'
      },
      culturalPractices: ['Traditional fishing','Community-based tourism','Lake conservation','Nature appreciation'],
      nativeFloraFauna: ['Freshwater fish species','Aquatic plants','Forest trees','Mountain birds','Native vegetation'],
      preservation: 'Managed by Asturias local community and municipal tourism office',
      highlights: ['Mountain Lake', 'Kayaking', 'Peaceful Retreat']
    },
    { 
      id: 35, 
      name: 'Osmeña Peak', 
      location: 'Badian, Cebu', 
      category: 'Natural Heritage',
      lat: 9.8201,
      lng: 123.4424,
      image: 'src/image/osmena-peak.jpg', 
      rating: 4.8,
      reviews: 3456,
      era: 'Geological formation',
      heritageStatus: 'Natural Landmark',
      description: 'The highest peak in Cebu at 1,015 meters, offering panoramic views of jagged hills.',
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: 'Osmeña Peak is the highest point in Cebu Island at 1,015 meters (3,330 feet) above sea level. Located in the Mantalongon mountain range in Dalaguete, it offers spectacular 360-degree views of jagged, verdant hills reminiscent of the Chocolate Hills in Bohol. On clear days, visitors can see neighboring islands including Negros and Bohol.',
        culturalSignificance: 'Named after Sergio Osmeña Sr., the second President of the Philippines who hailed from Cebu. Popular trekking and camping destination for locals and tourists. Important for environmental awareness and eco-tourism.',
        biodiversity: 'Cool highland climate supporting unique vegetation. Area is rich in pine trees, wildflowers, and grasslands. Bird watching opportunities. Part of the Mantalongon mountain range ecosystem.',
        currentStatus: 'Popular hiking and camping destination. Basic facilities available. Environmental conservation efforts ongoing to prevent degradation from over-tourism.',
        visitorInfo: 'Open 24/7. Entrance fee: ₱30. Easy 20-minute hike from parking area. Best visited early morning for sunrise or late afternoon. Camping allowed (bring own equipment). Dress warmly as temperature can drop at night. 3-4 hours drive from Cebu City.'
      },
      culturalPractices: ['Eco-tourism','Hiking and camping culture','Photography tourism','Environmental awareness programs'],
      nativeFloraFauna: ['Pine trees','Highland grasses','Wildflowers','Mountain birds','Native shrubs'],
      preservation: 'Managed by Dalaguete Municipal Government with local community involvement',
      highlights: ['Highest Peak in Cebu', 'Jagged Hills', 'Sunrise/Sunset Views']
    },
    { 
      id: 36, 
      name: 'Kawasan Falls', 
      location: 'Badian, Cebu', 
      category: 'Natural Heritage',
      lat: 9.8000,
      lng: 123.3670,
      image: 'src/image/kawasan-falls.webp', 
      rating: 4.9,
      reviews: 5234,
      era: 'Natural formation',
      heritageStatus: 'Protected Natural Area',
      description: 'A three-tiered waterfall system with turquoise blue waters, popular for canyoneering.',
      established: 'Natural formation',
      builtBy: 'Natural hydrological processes',
      detailedInfo: {
        overview: 'Kawasan Falls is a three-stage cascade of clear turquoise water located in the mountainous interior of Badian. The main waterfall drops about 40 meters into a natural pool perfect for swimming. The falls are fed by the Matutinao River and flow year-round. The area has become famous for canyoneering adventures where participants jump off cliffs, swim through canyons, and rappel down waterfalls.',
        culturalSignificance: 'One of Cebu\'s most iconic natural attractions, drawing thousands of local and international visitors. Has become a symbol of Cebu\'s natural beauty and adventure tourism. Important source of livelihood for Badian residents through tourism.',
        biodiversity: 'Lush tropical forest surrounds the falls with diverse plant and animal life. The river ecosystem supports various freshwater species. Bamboo groves, ferns, and native trees thrive in the area. Wildlife includes birds, butterflies, and small mammals.',
        currentStatus: 'Major tourist destination with developed facilities including bamboo cottages, changing rooms, and food stalls. Ongoing efforts to balance tourism with environmental conservation.',
        visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱40. 15-20 minute walk from entrance to first falls. Life jackets available for rent (₱50). Bamboo rafts available. Canyoneering packages start at ₱1,500. Best visited on weekdays to avoid crowds. 3 hours from Cebu City.'
      },
      culturalPractices: ['Adventure tourism','Canyoneering culture','Community-based tourism','Environmental conservation efforts'],
      nativeFloraFauna: ['Tropical forest trees','Bamboo groves','Ferns and mosses','Freshwater fish','Forest birds and butterflies'],
      preservation: 'Managed by Badian Municipal Government and local barangay with private operators',
      highlights: ['Three-Tiered Falls', 'Turquoise Waters', 'Canyoneering']
    },
    { 
      id: 37, 
      name: 'St. Peter and Paul Apostle Parish', 
      location: 'Bantayan, Cebu', 
      category: 'Historical Heritage',
      lat: 11.1667,
      lng: 123.7167,
      image: 'src/image/St.PeterandPaulApostleParish.webp', 
      rating: 4.8,
      reviews: 2134,
      era: 'Spanish Colonial (1580s)',
      heritageStatus: 'National Cultural Treasure',
      description: 'One of the oldest coral stone churches in the Philippines, a stunning example of Spanish colonial religious architecture standing at the heart of Bantayan Island.',
      established: '1580s (completed 1878)',
      builtBy: 'Augustinian Friars and local community',
      detailedInfo: {
        overview: 'The Parish of Saints Peter and Paul in Bantayan is one of the oldest churches in Cebu and the entire Philippines. Built by Augustinian friars using coral stone in the late 16th century, the church has stood as the spiritual center of Bantayan Island for over four centuries. The current structure, completed in 1878, showcases the remarkable craftsmanship of Spanish colonial religious architecture and remains remarkably well-preserved to this day.',
        culturalSignificance: 'A cornerstone of faith and identity for the Bantayanon people. The parish has witnessed centuries of history including Spanish colonization, the Philippine Revolution, and World War II. It serves as the spiritual anchor of the island community and is deeply woven into local traditions, festivals, and daily life. The church\'s enduring presence reflects the steadfast Catholic faith of the Bantayanons across generations.',
        architecture: 'Constructed from coral stone blocks, the church features thick fortress-like walls typical of Spanish colonial churches built to double as defensive structures. The facade displays baroque-influenced ornamentation with a prominent bell tower. The interior houses centuries-old religious artifacts, wooden carvings, and religious paintings. The adjoining convento (convent) is among the oldest surviving structures on the island, and the broad churchyard serves as a traditional gathering place for the community.',
        currentStatus: 'Active parish church serving the community of Bantayan. Regular masses held daily. Well-maintained with ongoing restoration efforts to preserve its historical integrity. A significant pilgrimage and heritage tourism destination, particularly during Holy Week when the island draws large numbers of devotees, and during the Bantayan Island Festival.',
        visitorInfo: 'Open daily for masses and visitors. Free admission. Located in the town center of Bantayan proper, easily walkable from the port area. Modest attire required (no sleeveless tops or shorts). Masses held multiple times daily — check the parish bulletin for current schedules. Best visited in the morning or late afternoon. Can be combined with Bantayan Island beach tourism and island-hopping to Tres Reyes Islands.'
      },
      culturalPractices: [
        'Catholic masses and novenas',
        'Holy Week processions and rituals',
        'Bantayan Island Festival celebrations',
        'Patron saint feast day observances',
        'Baptisms and wedding ceremonies'
      ],
      nativeFloraFauna: [
        'Heritage coral stone walls',
        'Church courtyard shade trees',
        'Ornamental garden plants',
        'Urban birds',
        'Coastal island vegetation'
      ],
      preservation: 'Maintained by the Diocese of San Carlos and the Parish of Saints Peter and Paul with support from the National Historical Commission of the Philippines',
      highlights: ['16th Century Coral Stone Church', 'National Cultural Treasure', 'Spanish Colonial Architecture']
    },
    { 
      id: 38, 
      name: 'Omagieca Mangrove Garden', 
      location: 'Bantayan, Cebu', 
      category: 'Natural Heritage',
      lat: 11.1700,
      lng: 123.7250,
      image: 'src/image/OmagiecaMangroveGarden.webp', 
      rating: 4.7,
      reviews: 1543,
      era: 'Natural formation',
      heritageStatus: 'Community-Managed Eco-Tourism Site',
      description: 'A thriving mangrove garden and eco-park along the Bantayan coastline, offering guided tours through lush mangrove forests and coastal wildlife viewing.',
      established: 'Community-developed eco-tourism site',
      builtBy: 'Local Bantayan community and environmental advocates',
      detailedInfo: {
        overview: 'Omagieca Mangrove Garden is a community-managed coastal eco-park located in Bantayan, Cebu. The site features a network of walkways and boardwalks weaving through dense mangrove forests along the shoreline. Developed and maintained by local residents, the garden serves as both a conservation area and an eco-tourism destination that showcases the ecological importance of mangrove ecosystems to the island.',
        culturalSignificance: 'Represents the Bantayanon community\'s deep commitment to coastal environmental stewardship. The garden has become a symbol of grassroots conservation, demonstrating how local communities can actively protect and restore critical coastal habitats. It provides sustainable livelihood for locals through eco-tourism while educating visitors on the value of mangroves as natural barriers against storms and coastal erosion.',
        biodiversity: 'The mangrove forest hosts a rich variety of coastal wildlife including mudskippers, fiddler crabs, shellfish, and various wading bird species. The dense root systems of the mangroves provide nursery habitats for juvenile fish and marine invertebrates. The area supports several mangrove species typical to the Visayas region, along with native coastal flora along the garden\'s edges.',
        currentStatus: 'Actively managed by the local community with support from the Bantayan municipal government. Boardwalks and viewing platforms are regularly maintained. Guided tours available through local community members. Growing in popularity as a nature and educational destination, particularly among school groups and eco-tourists visiting Bantayan Island.',
        visitorInfo: 'Open daily during daylight hours. Minimal entrance fee managed by the community. Located along the Bantayan coastline, accessible from the town center. Guided mangrove walks available — local guides explain the ecology and conservation efforts. Wear comfortable shoes suitable for boardwalk walking. Best visited in the morning when bird activity is highest. Can be combined with a visit to St. Peter and Paul Apostle Parish nearby.'
      },
      culturalPractices: [
        'Community-based eco-tourism',
        'Coastal conservation and reforestation',
        'Environmental education tours',
        'Traditional coastal resource management'
      ],
      nativeFloraFauna: [
        'Native mangrove species',
        'Mudskippers and fiddler crabs',
        'Wading and coastal birds',
        'Juvenile marine fish',
        'Coastal shellfish'
      ],
      preservation: 'Managed by the local Bantayan community with support from Bantayan Municipal Government and environmental organizations',
      highlights: ['Mangrove Boardwalk', 'Coastal Eco-Tourism', 'Community Conservation']
    },
    { 
      id: 39, 
      name: 'Bantayan Island Nature Park & Resort', 
      location: 'Bantayan Island, Cebu', 
      category: 'Natural Heritage',
      lat: 11.1750,
      lng: 123.7350,
      image: 'src/image/resortbantayan.webp', 
      rating: 4.8,
      reviews: 2678,
      era: 'Modern (established resort and nature park)',
      heritageStatus: 'Nature Park and Eco-Resort',
      description: 'A sprawling nature park and resort on Bantayan Island featuring lush tropical gardens, pristine beachfront, wildlife, and immersive eco-tourism experiences.',
      established: 'Modern development',
      builtBy: 'Private developers in partnership with local community',
      detailedInfo: {
        overview: 'Bantayan Island Nature Park & Resort is a premier eco-tourism destination on Bantayan Island that blends natural park experiences with resort amenities. The property features extensive tropical gardens, native tree groves, beachfront areas, and designated nature trails. It serves as a showcase for the island\'s biodiversity while offering visitors a comfortable base to explore the natural beauty of Bantayan. The park promotes environmental awareness alongside tourism.',
        culturalSignificance: 'Has become one of Bantayan Island\'s signature attractions, contributing to the island\'s reputation as a well-rounded eco-tourism destination beyond just beach tourism. The park celebrates and preserves the island\'s natural heritage, providing a space where both locals and visitors can reconnect with nature. It plays an important role in the local economy while modeling sustainable tourism practices for the region.',
        biodiversity: 'The nature park supports a diverse range of tropical flora including native trees, ornamental plants, and coastal vegetation. Wildlife in the park includes various bird species, butterflies, lizards, and other small fauna native to Bantayan Island. The beachfront areas connect to marine ecosystems with coral fragments and coastal fish species visible in the clear shallow waters. The park\'s gardens are designed to attract pollinators and support local biodiversity.',
        currentStatus: 'Active nature park and resort open year-round. Well-maintained facilities including nature trails, garden areas, beachfront, and resort accommodations. Popular with families, couples, and nature enthusiasts. Hosts educational programs and eco-tours. Continues to develop new nature-based experiences and conservation initiatives.',
        visitorInfo: 'Open daily. Day tour and overnight accommodation packages available. Entrance fee for day visitors. Located on Bantayan Island — accessible via ferry from Hagnaya Port in San Remigio, Cebu (approximately 1 hour ferry ride). Activities include nature walks, bird watching, beach swimming, and garden tours. Resort facilities include cottages and overnight rooms. Advance booking recommended during peak season (Holy Week and summer months). Combine with other Bantayan Island attractions such as Santa Fe Beach, Otar Beach, and island-hopping tours.'
      },
      culturalPractices: [
        'Eco-tourism and nature walks',
        'Environmental education programs',
        'Sustainable resort practices',
        'Community-integrated tourism'
      ],
      nativeFloraFauna: [
        'Native tropical trees',
        'Island bird species',
        'Butterflies and pollinators',
        'Coastal and marine life',
        'Ornamental and native garden plants'
      ],
      preservation: 'Maintained by private resort management in coordination with Bantayan Island local government and environmental agencies',
      highlights: ['Nature Trails', 'Beachfront Park', 'Eco-Resort Experience']
    },
    { 
      id: 40, 
      name: 'Mantayupan Falls', 
      location: 'Barili, Cebu', 
      category: 'Natural Heritage',
      lat: 10.1167,
      lng: 123.5333,
      image: 'src/image/mantayupanfalls-12-1024x767.webp', 
      rating: 4.8,
      reviews: 2987,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: 'One of the tallest waterfalls in Cebu, cascading dramatically down lush forest cliffs into a wide natural pool perfect for swimming.',
      established: 'Natural formation',
      builtBy: 'Natural hydrological processes',
      detailedInfo: {
        overview: 'Mantayupan Falls is widely regarded as one of the tallest and most impressive waterfalls in Cebu, with a drop of approximately 98 meters across two tiers. Located in the interior mountains of Barili, the falls cascade powerfully down moss-covered rock faces into a wide, cool natural pool at the base. The surrounding area is blanketed in dense tropical forest, creating a dramatic and refreshing natural retreat that draws visitors from across the province.',
        culturalSignificance: 'A source of immense local pride for the people of Barili, Mantayupan Falls has long been a cherished natural landmark and gathering place for the community. It has played a key role in putting Barili on the tourism map of Cebu, providing sustainable livelihood through eco-tourism for local residents. The falls are deeply associated with the identity of Barili and are featured prominently in the town\'s heritage and promotional materials.',
        biodiversity: 'The forested watershed surrounding the falls supports a rich tropical ecosystem. Native trees, ferns, mosses, and climbing plants thrive in the mist-laden environment near the cascades. The river and pool host freshwater fish and crustaceans. Various bird species, butterflies, and small forest mammals inhabit the surrounding woodland. The continuous water flow sustains a healthy riparian ecosystem downstream.',
        currentStatus: 'Well-developed eco-tourism site managed by the Barili municipal government. Facilities include paved pathways, viewing platforms, cottages, changing rooms, and a picnic area. One of Barili\'s top tourist attractions. Ongoing conservation efforts protect the watershed. Popular among local and domestic tourists year-round, with peak visits during summer months.',
        visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱30 for adults, ₱20 for children. About 2 hours from Cebu City via the south road. Short paved walk from the entrance to the falls. Life jackets available for rent for swimming in the pool. Cottages available for day use. Bring own food and drinks. Best visited on weekdays to avoid crowds. Wear water shoes for comfort near the pool area.'
      },
      culturalPractices: [
        'Community-based eco-tourism',
        'Local guiding services',
        'Environmental conservation',
        'Summer recreation and swimming traditions'
      ],
      nativeFloraFauna: [
        'Tropical forest trees',
        'Native ferns and mosses',
        'Freshwater fish and crustaceans',
        'Forest birds and butterflies',
        'Riparian vegetation'
      ],
      preservation: 'Managed by Barili Municipal Tourism Office and local barangay government',
      highlights: ['One of Cebu\'s Tallest Falls', 'Natural Swimming Pool', 'Forest Setting']
    },
    { 
      id: 41, 
      name: 'Sayaw Beach', 
      location: 'Barili, Cebu', 
      category: 'Natural Heritage',
      lat: 10.1083,
      lng: 123.5167,
      image: 'src/image/SayawBeach.webp', 
      rating: 4.6,
      reviews: 1678,
      era: 'Natural formation',
      heritageStatus: 'Natural Coastal Attraction',
      description: 'A serene and relatively undiscovered beach in Barili featuring calm clear waters, white to golden sand, and a peaceful atmosphere away from crowded tourist spots.',
      established: 'Natural formation',
      builtBy: 'Natural coastal and geological processes',
      detailedInfo: {
        overview: 'Sayaw Beach is a quiet and charming coastal destination nestled along the western shoreline of Barili in southwestern Cebu. The beach features calm, clear waters ideal for swimming and wading, with a pleasant stretch of sand backed by coconut palms and coastal vegetation. Less commercialized than many Cebu beaches, Sayaw offers a laid-back and authentic local beach experience where visitors can truly unwind.',
        culturalSignificance: 'An important recreational and livelihood area for the Barili coastal community. Local fishing families have long relied on these waters, and the beach serves as a traditional gathering spot for residents. As eco-tourism grows in Barili — particularly alongside nearby Mantayupan Falls — Sayaw Beach is gaining recognition as a complementary natural attraction that rounds out a full day itinerary in the municipality.',
        biodiversity: 'The coastal waters support marine life including small reef fish, sea grass beds, and invertebrates in the shallower areas. Coconut palms, coastal shrubs, and other shoreline vegetation line the beach. Seabirds are commonly spotted along the shoreline. The relatively undisturbed coastal habitat makes it a pleasant environment for both wildlife and visitors.',
        currentStatus: 'Emerging local beach destination managed by the Barili community. Basic facilities available. Growing steadily in popularity among locals and tourists looking for a quieter beach alternative in southwestern Cebu. Community efforts are in place to maintain the beach\'s cleanliness and natural appeal.',
        visitorInfo: 'Open daily. Minimal entrance fee. About 2 hours from Cebu City. Best combined with a visit to Mantayupan Falls for a full Barili day trip. Calm waters suitable for families with children. Bring own food and drinks as commercial vendors may be limited. Best visited during dry season (January to June) for optimal beach conditions. Sunset views over the Tañon Strait are particularly scenic.'
      },
      culturalPractices: [
        'Traditional coastal fishing',
        'Community beach recreation',
        'Local eco-tourism development',
        'Sunset watching along Tañon Strait'
      ],
      nativeFloraFauna: [
        'Coconut palms',
        'Coastal shrubs and vegetation',
        'Seabirds',
        'Shallow marine fish',
        'Seagrass beds'
      ],
      preservation: 'Managed by Barili local community and municipal government',
      highlights: ['Quiet Beach Escape', 'Tañon Strait Views', 'Combine with Mantayupan Falls']
    },
    { 
      id: 42, 
      name: 'Capitancillo Island', 
      location: 'Bogo City, Cebu', 
      category: 'Natural Heritage',
      lat: 11.0667,
      lng: 124.0167,
      image: 'src/image/CapitancilloIsland.webp', 
      rating: 4.9,
      reviews: 2134,
      era: 'Natural formation',
      heritageStatus: 'Marine Sanctuary and Bird Sanctuary',
      description: 'A tiny uninhabited island off the coast of Bogo City renowned as a world-class diving destination and important bird and marine sanctuary in northern Cebu.',
      established: 'Natural formation — declared sanctuary',
      builtBy: 'Natural coral and geological formation',
      detailedInfo: {
        overview: 'Capitancillo Island is a small, uninhabited islet located off the northeastern coast of Bogo City in northern Cebu. Despite its modest size, the island has earned an outstanding reputation among divers and nature lovers for its extraordinary marine biodiversity. The surrounding waters feature dramatic coral walls, underwater caves, and an abundance of marine life, making it one of the premier dive sites in the Visayas. The island itself also serves as a nesting ground for various seabirds, adding to its ecological significance.',
        culturalSignificance: 'Capitancillo Island is a point of immense pride for Bogo City and northern Cebu, placing the city firmly on the map of world-class diving destinations in the Philippines. The island represents the rich natural heritage of the region and underscores the importance of marine conservation. It has become an important driver of eco-tourism in Bogo City, attracting both local and international divers and nature enthusiasts who contribute to the local economy.',
        biodiversity: 'The marine environment surrounding Capitancillo is exceptionally rich, featuring healthy hard and soft coral formations, vertical coral walls dropping to significant depths, and underwater caves and swim-throughs. Marine life includes thresher sharks, manta rays, sea turtles, barracuda, schools of jacks, and a vast array of reef fish species. The island surface provides nesting habitat for seabirds. The combination of pelagic and reef species makes the site one of the most biodiverse marine areas in northern Cebu.',
        currentStatus: 'Protected marine and bird sanctuary with regulated access. Popular diving destination attracting enthusiasts from across the Philippines and internationally. Dive operators in Bogo City offer guided dive trips to the island. Conservation measures are in place to protect the fragile coral and wildlife. No permanent structures on the island to preserve its pristine condition.',
        visitorInfo: 'Access via boat from Bogo City (approximately 30–45 minutes). Dive trips arranged through accredited dive operators and tourism offices in Bogo City. Snorkeling possible in shallower areas. No overnight stays on the island. Marine sanctuary fees apply. Respect wildlife and no-touch policy for corals strictly enforced. Best diving conditions during calm weather months (March to June). Bogo City is approximately 3 hours from Cebu City via the north road.'
      },
      culturalPractices: [
        'Scuba diving and snorkeling tourism',
        'Marine conservation advocacy',
        'Bird watching',
        'Environmental research and monitoring'
      ],
      nativeFloraFauna: [
        'Hard and soft coral formations',
        'Thresher sharks and manta rays',
        'Sea turtles',
        'Diverse reef and pelagic fish',
        'Nesting seabirds'
      ],
      preservation: 'Managed by Bogo City Government and DENR as a protected marine and bird sanctuary',
      highlights: ['World-Class Dive Site', 'Marine Sanctuary', 'Thresher Sharks & Mantas']
    },
    { 
      id: 43, 
      name: 'Shrine of Our Lady of Miraculous Medal', 
      location: 'Bogo City, Cebu', 
      category: 'Historical Heritage',
      lat: 11.0511,
      lng: 124.0103,
      image: 'src/image/ShrineofOurLadyofMiraculousMedal.webp', 
      rating: 4.7,
      reviews: 1876,
      era: 'Spanish Colonial heritage',
      heritageStatus: 'Religious Shrine and Pilgrimage Site',
      description: 'A beloved Catholic shrine in Bogo City dedicated to Our Lady of the Miraculous Medal, drawing pilgrims and devotees from across northern Cebu.',
      established: 'Spanish Colonial period, developed as shrine over subsequent centuries',
      builtBy: 'Catholic Church and Bogo City faithful community',
      detailedInfo: {
        overview: 'The Shrine of Our Lady of the Miraculous Medal in Bogo City is one of the most revered Catholic pilgrimage sites in northern Cebu. Dedicated to the Blessed Virgin Mary under the title of the Miraculous Medal — a devotion originating from apparitions in Paris in 1830 — the shrine has become a spiritual landmark drawing devotees from Bogo City and surrounding municipalities. The site combines deep religious tradition with a serene and prayerful atmosphere.',
        culturalSignificance: 'The shrine is a cornerstone of Catholic faith and identity for the people of Bogo City and the wider northern Cebu region. Marian devotion is deeply ingrained in Cebuano culture, and this shrine serves as a focal point for communal prayer, healing, and thanksgiving. Pilgrims visit regularly to seek intercession, offer gratitude for answered prayers, and participate in religious celebrations, making it an important center of spiritual life in the north.',
        architecture: 'The shrine features religious architecture consistent with Cebuano Catholic tradition, incorporating elements of Spanish colonial ecclesiastical design. The main chapel houses the venerated image of Our Lady of the Miraculous Medal, adorned with devotional offerings from grateful pilgrims. The shrine grounds include prayer gardens, stations of devotion, and spaces for communal religious gatherings and processions.',
        currentStatus: 'Active pilgrimage site and place of worship with regular masses and novenas. Well-maintained by the local Catholic parish and devoted community. Attracts steady streams of pilgrims throughout the year, with heightened activity during Marian feast days and special novenas. An important stop for religious tourists visiting Bogo City.',
        visitorInfo: 'Open daily for prayer and visitation. Free admission. Modest attire required (no sleeveless tops or shorts). Located within Bogo City proper, easily accessible from the city center. Masses and novenas held regularly — check with the parish for current schedules. Bogo City is approximately 3 hours from Cebu City via the north road. Can be combined with a visit to Capitancillo Island for a full Bogo City itinerary.'
      },
      culturalPractices: [
        'Marian devotion and novenas',
        'Pilgrimage traditions',
        'Candle lighting and prayer offerings',
        'Feast day processions and celebrations'
      ],
      nativeFloraFauna: [
        'Shrine garden ornamentals',
        'Shade trees in prayer grounds',
        'Flowering devotional plants',
        'Urban birds'
      ],
      preservation: 'Maintained by the Catholic Parish of Bogo City and the Diocese of San Carlos',
      highlights: ['Marian Pilgrimage Site', 'Northern Cebu Devotion', 'Religious Heritage']
    },
    { 
      id: 44, 
      name: 'Boljoon Heritage Museum', 
      location: 'Boljoon, Cebu', 
      category: 'Cultural Heritage',
      lat: 9.6333,
      lng: 123.4167,
      image: 'src/image/BoljoonHeritageMuseum.webp', 
      rating: 4.7,
      reviews: 1123,
      era: 'Spanish Colonial heritage',
      heritageStatus: 'Heritage Museum and Cultural Site',
      description: 'A dedicated heritage museum in one of Cebu\'s oldest towns, preserving centuries of Boljoon\'s rich Spanish colonial history, religious artifacts, and Cebuano cultural heritage.',
      established: 'Modern museum established to preserve colonial-era heritage',
      builtBy: 'Boljoon Municipal Government and heritage conservation community',
      detailedInfo: {
        overview: 'The Boljoon Heritage Museum is located in the municipality of Boljoon, one of the oldest and most historically significant towns in Cebu. Boljoon is renowned for its remarkably well-preserved Spanish colonial structures, including the iconic Nuestra Señora del Patrocinio Parish Church — a National Cultural Treasure. The heritage museum complements these historic sites by housing a curated collection of artifacts, photographs, documents, and cultural objects that chronicle Boljoon\'s long and storied past from pre-colonial times through the Spanish colonial era and beyond.',
        culturalSignificance: 'Boljoon is considered one of the best-preserved colonial towns in the Philippines, and the heritage museum serves as the primary repository and interpretive center for this remarkable legacy. The museum plays a vital role in educating both residents and visitors about the town\'s unique historical identity, fostering a sense of pride and responsibility toward preservation. It also documents the traditions, crafts, and way of life of the Boljoon community across generations.',
        architecture: 'The museum is housed in a heritage structure befitting its colonial surroundings, with exhibits thoughtfully arranged to guide visitors through Boljoon\'s chronological and cultural history. Displays include Spanish-era religious artifacts, antique household items, traditional tools, historical photographs, and documents. The museum building itself reflects the architectural character of Boljoon\'s heritage district.',
        currentStatus: 'Active heritage museum open to the public and visiting groups. Managed by the local government with support from heritage conservation advocates. Regularly visited by students, researchers, and cultural tourists. Part of the broader Boljoon heritage tourism circuit that includes the parish church, watchtower, and other colonial-era structures.',
        visitorInfo: 'Open during regular business hours (Monday to Friday, 8:00 AM to 5:00 PM; weekend hours may vary — check with municipal tourism office). Minimal or free admission. Located in Boljoon town center, within walking distance of the parish church and other heritage structures. About 3.5 to 4 hours from Cebu City via the south road. Guided heritage walks of the town available. Best combined with visits to other Boljoon landmarks for a full colonial heritage experience.'
      },
      culturalPractices: [
        'Heritage education and cultural tours',
        'Documentation of colonial-era traditions',
        'Community heritage preservation',
        'School and academic visits'
      ],
      nativeFloraFauna: [
        'Heritage district shade trees',
        'Ornamental garden plants',
        'Colonial townscape flora',
        'Urban birds'
      ],
      preservation: 'Managed by Boljoon Municipal Government with support from the National Historical Commission of the Philippines and local heritage advocates',
      highlights: ['Colonial Heritage Collection', 'One of Cebu\'s Oldest Towns', 'Heritage Tourism Hub']
    },
    { 
      id: 45, 
      name: 'Dayhag Falls', 
      location: 'Boljoon, Cebu', 
      category: 'Natural Heritage',
      lat: 9.6417,
      lng: 123.4250,
      image: 'src/image/DayhagFalls.webp', 
      rating: 4.6,
      reviews: 987,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: 'A picturesque waterfall tucked in the forest hills of Boljoon, offering a cool and refreshing retreat amid lush tropical greenery.',
      established: 'Natural formation',
      builtBy: 'Natural hydrological processes',
      detailedInfo: {
        overview: 'Dayhag Falls is a scenic waterfall nestled in the forested interior of Boljoon, one of southern Cebu\'s most historically rich municipalities. The falls cascade down into a natural pool surrounded by lush tropical vegetation, offering visitors a peaceful and refreshing nature experience. While lesser known compared to other Cebu waterfalls, Dayhag Falls is a hidden gem that rewards those who make the journey to this quiet corner of southern Cebu with its unspoiled natural beauty.',
        culturalSignificance: 'Dayhag Falls complements Boljoon\'s identity as a destination of both cultural and natural richness. For the local community, the falls represent an important natural resource and a source of local pride. Its growing presence in eco-tourism itineraries helps diversify Boljoon\'s tourism offerings beyond its celebrated colonial heritage, providing additional livelihood opportunities for residents through guiding and community-based tourism services.',
        biodiversity: 'The watershed forest surrounding Dayhag Falls supports a healthy tropical ecosystem with native trees, ferns, mosses, and climbing vegetation thriving in the moist microclimate near the cascade. The freshwater pool and stream host local fish and aquatic invertebrates. Various bird species and butterflies are commonly observed in the surrounding forest, and the area retains much of its natural character due to limited development.',
        currentStatus: 'Emerging eco-tourism destination managed by the local community. Basic facilities in place. Gaining recognition as part of Boljoon\'s broader tourism circuit. Conservation efforts ongoing to protect the surrounding watershed. Best suited for visitors seeking an off-the-beaten-path natural experience in southern Cebu.',
        visitorInfo: 'Open daily. Minimal entrance fee managed by local community. Located in the hills of Boljoon — a trek of approximately 20 to 30 minutes from the main road through forested terrain. About 3.5 to 4 hours from Cebu City via the south road. Wear appropriate footwear for the forest trail. Bring water and snacks. Best visited during the dry season (January to June). Can be paired with a visit to the Boljoon Heritage Museum and parish church for a complete Boljoon day tour.'
      },
      culturalPractices: [
        'Community eco-tourism',
        'Local guiding services',
        'Environmental conservation',
        'Nature trekking culture'
      ],
      nativeFloraFauna: [
        'Native tropical forest trees',
        'Ferns and mosses',
        'Freshwater fish and invertebrates',
        'Forest birds and butterflies',
        'Riparian and understory vegetation'
      ],
      preservation: 'Managed by Boljoon local community and municipal tourism office',
      highlights: ['Hidden Waterfall', 'Forest Trek', 'Pair with Boljoon Heritage Tour']
    },
    { 
      id: 46, 
      name: 'Silmugi River Park', 
      location: 'Borbon, Cebu', 
      category: 'Natural Heritage',
      lat: 10.8333,
      lng: 124.0167,
      image: 'src/image/SilmugiRiverPark.webp', 
      rating: 4.6,
      reviews: 1134,
      era: 'Natural formation',
      heritageStatus: 'Community Nature Park',
      description: 'A scenic riverside nature park along the Silmugi River in Borbon, offering freshwater swimming, picnic areas, and a tranquil natural escape in northern Cebu.',
      established: 'Community-developed nature park',
      builtBy: 'Borbon local community and municipal government',
      detailedInfo: {
        overview: 'Silmugi River Park is a community-developed nature park situated along the banks of the Silmugi River in Borbon, northern Cebu. The park harnesses the natural beauty of the river environment, offering visitors clean freshwater swimming spots, shaded picnic areas, and a peaceful riverside atmosphere. Developed through local initiative, the park has become a popular weekend destination for residents of Borbon and nearby municipalities seeking a refreshing natural retreat close to home.',
        culturalSignificance: 'The Silmugi River has long been an integral part of daily life and recreation for the Borbon community. The establishment of the river park formalizes this connection, transforming a beloved natural resource into a structured eco-tourism and recreation destination. It represents community-led efforts to harness natural assets for sustainable local development while preserving the river ecology for future generations.',
        biodiversity: 'The Silmugi River and its surrounding riparian forest support a variety of freshwater species including fish, aquatic insects, and crustaceans. Riverbank vegetation including native trees, grasses, and shrubs provides habitat for birds and small wildlife. The park environment maintains much of its natural character, with the river flowing through a verdant landscape typical of northern Cebu.',
        currentStatus: 'Active community-managed nature park open to the public. Basic facilities including picnic areas, cottages, and riverside amenities are in place. Growing in popularity among locals and visitors to northern Cebu. Community conservation efforts ensure the river and surrounding environment remain clean and well-maintained.',
        visitorInfo: 'Open daily during daylight hours. Minimal entrance fee managed by the local community. Located in Borbon municipality, approximately 2.5 to 3 hours from Cebu City via the north road. Freshwater swimming in designated areas. Cottages and picnic shelters available for day use. Bring own food and drinks. Best visited on weekdays to enjoy a quieter atmosphere. Suitable for families and groups.'
      },
      culturalPractices: [
        'Community riverside recreation',
        'Family picnic and gathering traditions',
        'Environmental stewardship of the river',
        'Community-based eco-tourism'
      ],
      nativeFloraFauna: [
        'Native riverbank trees',
        'Freshwater fish and crustaceans',
        'Aquatic insects',
        'Riparian shrubs and grasses',
        'River and forest birds'
      ],
      preservation: 'Managed by Borbon local community and municipal government',
      highlights: ['Freshwater River Swimming', 'Riverside Picnic Park', 'Community Eco-Tourism']
    },
    { 
      id: 47, 
      name: 'Torre de Borbon', 
      location: 'Borbon, Cebu', 
      category: 'Historical Heritage',
      lat: 10.8292,
      lng: 124.0089,
      image: 'src/image/TorredeBorbon.webp', 
      rating: 4.7,
      reviews: 1356,
      era: 'Spanish Colonial (17th-18th century)',
      heritageStatus: 'Heritage Watchtower - Historical Landmark',
      description: "A remarkably preserved Spanish colonial watchtower standing as a sentinel over Borbon, one of the finest surviving examples of defensive colonial architecture in northern Cebu.",
      established: '17th-18th century Spanish colonial period',
      builtBy: 'Spanish colonial government with local labor',
      detailedInfo: {
        overview: "Torre de Borbon is a well-preserved Spanish colonial watchtower located in the municipality of Borbon in northern Cebu. Built during the Spanish colonial era as part of a network of defensive structures along the Cebu coastline, the tower served as a lookout post to warn communities of Moro raids and other threats. Standing as one of the more intact examples of colonial military architecture in northern Cebu, Torre de Borbon is a tangible reminder of the island's colonial past and the realities of life during the Spanish period.",
        culturalSignificance: "The watchtower is a defining historical landmark of Borbon and an important piece of Cebu's broader colonial heritage. It represents the extensive network of coastal defense structures the Spanish built throughout the Philippines to protect settlements from raids. For the people of Borbon, the torre is a symbol of their town's long history and resilience. It serves as an outdoor heritage monument that connects the community to its colonial past and attracts history enthusiasts visiting northern Cebu.",
        architecture: 'Constructed from coral stone and lime mortar in the traditional Spanish colonial military style, the tower features thick, sturdy walls designed to withstand attack and the test of time. The cylindrical or polygonal structure rises several meters above ground level, affording commanding views of the surrounding coastline and landscape. Narrow openings served as lookout points. The construction technique using locally sourced coral stone is characteristic of Spanish colonial defensive architecture throughout Cebu.',
        currentStatus: 'Heritage structure accessible to the public. Reasonably well-preserved with its core structure largely intact. Recognized as an important historical landmark of Borbon. Heritage conservation efforts ongoing to protect the structure from further deterioration. Visited by history buffs, students, and cultural tourists passing through northern Cebu.',
        visitorInfo: 'Accessible daily. Free admission. Located in Borbon town proper, easily reached from the main road. About 2.5 to 3 hours from Cebu City via the north road. A short and easy visit that pairs well with the Silmugi River Park for a full Borbon day itinerary. Photography welcome. Exercise care around older structural areas. Local residents can provide additional historical context about the torre.'
      },
      culturalPractices: [
        'Heritage tourism and historical education',
        'Cultural landmark appreciation',
        'Local history storytelling',
        'Heritage conservation advocacy'
      ],
      nativeFloraFauna: [
        'Coral stone heritage structure',
        'Heritage site surrounding vegetation',
        'Native shrubs and grasses',
        'Urban and coastal birds'
      ],
      preservation: 'Under Borbon Municipal Government with support from the National Historical Commission of the Philippines',
      highlights: ['Spanish Watchtower', 'Colonial Defense Architecture', 'Northern Cebu Heritage']
    },
    { 
      id: 48, 
      name: 'Cebu Safari and Adventure Park', 
      location: 'Carmen, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.5833,
      lng: 124.0167,
      image: 'src/image/CebuSafariandAdventurePark.webp', 
      rating: 4.9,
      reviews: 5876,
      era: 'Modern (opened 2018)',
      heritageStatus: 'Wildlife Park and Eco-Tourism Destination',
      description: "The largest zoological park in the Philippines, home to hundreds of animal species from across the world, set within a sprawling wildlife reserve in the hills of Carmen, northern Cebu.",
      established: '2018',
      builtBy: 'Cebu Safari and Adventure Park developers',
      detailedInfo: {
        overview: "Cebu Safari and Adventure Park is the largest zoological and wildlife park in the Philippines, spanning over 170 hectares of rolling hills in Carmen, northern Cebu. The park is home to hundreds of animal species from Africa, Asia, and the Americas, including lions, giraffes, tigers, zebras, orangutans, and many more. Visitors experience world-class wildlife encounters through open safari drives, animal feedings, and up-close exhibits — all set against the breathtaking landscape of Carmen's hills.",
        culturalSignificance: "A landmark achievement for Cebu and the Philippines, the safari park has elevated the province's profile as a world-class tourism destination. It promotes wildlife conservation awareness and environmental education among Filipino visitors and international tourists alike. The park has become one of the most visited attractions in all of Cebu, significantly boosting tourism in Carmen and northern Cebu while fostering a culture of appreciation for global biodiversity.",
        architecture: "The park is designed as a sprawling open-air wildlife reserve with themed zones representing different regions of the world and their native animals. Safari vehicles traverse wide open habitats where animals roam freely. Facilities include visitor lodges, restaurants, souvenir shops, a botanical garden, and children's play areas. The landscape design integrates natural topography with animal enclosures, creating immersive environments that prioritize animal welfare.",
        currentStatus: "One of the premier tourist attractions in Cebu and the Philippines. Fully operational with a wide range of animal exhibits, safari experiences, and adventure activities. Popular with families, school groups, and international tourists. Continuously expanding with new species and attractions. Strong focus on conservation education and responsible wildlife tourism.",
        visitorInfo: "Open daily 8:00 AM to 5:00 PM. Entrance fee varies by package (approximately ₱800–₱1,500 for adults; discounts for children). Located in Carmen, approximately 1.5 to 2 hours from Cebu City via the north road. Safari tram tours included in admission. Animal feeding sessions scheduled throughout the day. Full day recommended to see all exhibits. Food and drinks available on-site. Advance online booking recommended during peak season and holidays. Comfortable walking shoes advised."
      },
      culturalPractices: [
        'Wildlife conservation education',
        'Safari and nature tourism',
        'Environmental awareness programs',
        'Family and school educational visits'
      ],
      nativeFloraFauna: [
        'African savanna animals (lions, giraffes, zebras)',
        'Asian wildlife (tigers, orangutans)',
        'Native Philippine species',
        'Tropical park vegetation',
        'Free-roaming bird species'
      ],
      preservation: 'Managed by Cebu Safari and Adventure Park with partnerships with international wildlife conservation organizations',
      highlights: ["Largest Zoo in the Philippines", 'Open Safari Drive', 'Hundreds of Animal Species']
    },
    { 
      id: 49, 
      name: 'Middle Earth Mountain Resort', 
      location: 'Carmen, Cebu', 
      category: 'Natural Heritage',
      lat: 10.5750,
      lng: 124.0083,
      image: 'src/image/MiddleEarthMountainResort.webp', 
      rating: 4.7,
      reviews: 2143,
      era: 'Modern resort development',
      heritageStatus: 'Mountain Eco-Resort',
      description: "A fantasy-themed mountain resort perched in the scenic hills of Carmen, offering breathtaking panoramic views, cool highland air, hobbit-inspired accommodations, and immersive nature experiences.",
      established: 'Modern development',
      builtBy: 'Private resort developers',
      detailedInfo: {
        overview: "Middle Earth Mountain Resort is a uniquely themed highland retreat nestled in the hills of Carmen, northern Cebu. Drawing inspiration from the beloved fantasy world of J.R.R. Tolkien, the resort features hobbit-hole style accommodations, whimsical garden landscapes, and rustic wooden structures set against sweeping views of the Carmen countryside and Cebu's northern mountain ranges. The resort offers a magical escape from the lowlands, combining fantasy aesthetics with the natural beauty of the Cebu highlands.",
        culturalSignificance: "Middle Earth Mountain Resort represents the creative evolution of Cebu's tourism landscape, demonstrating how themed eco-resorts can attract a new generation of travelers while celebrating the natural beauty of the highlands. It has become a popular destination for couples, groups, and families seeking a distinctive and Instagram-worthy mountain experience in northern Cebu. The resort contributes to Carmen's growing reputation as a multi-attraction tourism hub alongside the nearby Cebu Safari and Adventure Park.",
        architecture: "The resort features fantasy-inspired architecture including hobbit-hole accommodations built into hillsides, rustic wooden cottages, stone pathways, lush garden landscaping, and themed viewdecks. Structures are designed to blend harmoniously with the natural highland environment. The interiors of the accommodations combine rustic charm with modern comforts. Outdoor spaces include garden terraces, fire pits, and panoramic viewing areas that take full advantage of the elevated mountain setting.",
        currentStatus: "Active mountain resort open for day tours and overnight stays. Well-maintained themed grounds and accommodations. Popular for overnight getaways, special occasions, and group events. Advance booking required for overnight stays. Continues to develop new themed attractions and amenities to enhance the visitor experience.",
        visitorInfo: "Open daily. Day tour entrance fee applies (check resort for current rates). Overnight accommodation packages available — advance booking required. Located in the hills of Carmen, approximately 1.5 to 2 hours from Cebu City. Cool mountain temperature, bring a light jacket especially for evenings. Best visited during the dry season for clear views. Can be combined with a visit to Cebu Safari and Adventure Park for a full Carmen day or weekend itinerary. Restaurant on-site serving local and international cuisine."
      },
      culturalPractices: [
        'Mountain eco-tourism',
        'Themed resort and nature experience',
        'Romantic and leisure getaways',
        'Highland photography and nature walks'
      ],
      nativeFloraFauna: [
        'Highland tropical vegetation',
        'Ornamental garden plants',
        'Mountain birds',
        'Native highland flora',
        'Butterfly species'
      ],
      preservation: 'Maintained by private resort management with adherence to local environmental guidelines',
      highlights: ['Hobbit-Themed Accommodations', 'Panoramic Mountain Views', 'Highland Nature Retreat']
    },
    { 
      id: 50, 
      name: 'Mt. Kapayas (Lantawan Peak)', 
      location: 'Catmon, Cebu', 
      category: 'Natural Heritage',
      lat: 10.7167,
      lng: 123.9833,
      image: 'src/image/MtKapayas.webp', 
      rating: 4.8,
      reviews: 1876,
      era: 'Natural/Geological formation',
      heritageStatus: 'Natural Landmark and Hiking Destination',
      description: "A scenic mountain peak in Catmon offering sweeping panoramic views of northern Cebu, the surrounding seas, and neighboring islands — a rewarding trek for hikers and nature lovers.",
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: "Mt. Kapayas, also known as Lantawan Peak, is a prominent mountain summit located in the municipality of Catmon in northern Cebu. The peak is one of the notable hiking destinations in northern Cebu, offering trekkers expansive 360-degree views of the surrounding landscape including the rolling hills of Catmon, the coastlines of northern Cebu, and on clear days, the neighboring islands of Bohol, Leyte, and the Camotes Islands. The name 'Lantawan' itself means 'viewpoint' in Cebuano, perfectly describing the mountain's most celebrated feature.",
        culturalSignificance: "Mt. Kapayas holds a special place in the hearts of Catmon residents as a defining natural landmark of their municipality. The peak has become an important eco-tourism asset for Catmon, drawing hikers and nature enthusiasts and providing livelihood opportunities for local guides. The mountain also serves as an important watershed, supplying water to communities in the area. Its growing popularity as a trekking destination reflects the broader eco-tourism development of northern Cebu.",
        biodiversity: "The slopes of Mt. Kapayas are blanketed in tropical forest and grassland vegetation typical of Cebu's northern highlands. The mountain ecosystem supports various bird species, insects, and small wildlife. Native trees, shrubs, and grasses thrive along the trail, and the summit grasslands offer a unique highland microhabitat. The forested areas also serve as important watershed zones for the municipality.",
        currentStatus: "Active hiking and eco-tourism destination managed by the Catmon local government and community. Trails are maintained with local guides available. Growing in popularity among hiking enthusiasts from Cebu City and beyond. Basic facilities at the trailhead. Conservation efforts ongoing to protect the mountain ecosystem from over-tourism.",
        visitorInfo: "Open daily — best started early morning (4:00–5:00 AM) to catch the sunrise and avoid midday heat. Minimal entrance and guide fees. Located in Catmon, approximately 2 to 2.5 hours from Cebu City via the north road. Trekking time approximately 1.5 to 2 hours to the summit depending on fitness level. Local guides required and available at the trailhead. Bring sufficient water, snacks, and sun protection. Wear proper trekking shoes. Camping possible at the summit with advance arrangement. Can be combined with a visit to Tinubdan Falls for a full Catmon nature itinerary."
      },
      culturalPractices: [
        'Eco-trekking and hiking culture',
        'Sunrise viewing traditions',
        'Community guiding and eco-tourism',
        'Environmental conservation of the watershed'
      ],
      nativeFloraFauna: [
        'Highland tropical forest trees',
        'Summit grassland vegetation',
        'Native shrubs and wildflowers',
        'Mountain bird species',
        'Forest insects and butterflies'
      ],
      preservation: 'Managed by Catmon Municipal Government and local community guides',
      highlights: ['Panoramic 360° Views', 'Northern Cebu Sunrise Trek', 'Island and Sea Vistas']
    },
    { 
      id: 51, 
      name: 'Tinubdan Falls', 
      location: 'Catmon, Cebu', 
      category: 'Natural Heritage',
      lat: 10.7083,
      lng: 123.9750,
      image: 'src/image/TinubdanFalls.webp', 
      rating: 4.7,
      reviews: 1543,
      era: 'Natural formation',
      heritageStatus: 'Natural Landmark',
      description: "A beautiful multi-layered waterfall cascading through the lush forest of Catmon, featuring cool natural pools and a peaceful atmosphere perfect for swimming and nature immersion.",
      established: 'Natural formation',
      builtBy: 'Natural hydrological processes',
      detailedInfo: {
        overview: "Tinubdan Falls is a scenic waterfall destination tucked within the forested interior of Catmon municipality in northern Cebu. The falls feature cascading waters flowing over layered rock formations into cool, inviting natural pools below. Surrounded by dense tropical vegetation, Tinubdan offers a serene and refreshing natural escape that complements Catmon's growing eco-tourism offerings alongside nearby Mt. Kapayas. The falls remain relatively undiscovered, preserving much of their natural charm and tranquility.",
        culturalSignificance: "Tinubdan Falls is an important natural asset for the Catmon community, providing a freshwater recreational spot that has been enjoyed by local residents for generations. The name 'Tinubdan' in Cebuano relates to the source or origin of water, reflecting the falls' role as a natural water source in the area. As eco-tourism develops in Catmon, the falls serve as a key attraction that helps diversify the municipality's tourism offerings and provides additional income for local community members through guiding and tourism services.",
        biodiversity: "The watershed forest surrounding Tinubdan Falls supports a healthy and diverse tropical ecosystem. Native trees, ferns, mosses, and climbing plants thrive in the moist, shaded environment near the cascade. The freshwater pools and streams host local fish, crustaceans, and aquatic invertebrates. Various bird species, dragonflies, and butterflies are commonly seen in the area. The relatively undisturbed forest habitat maintains good biodiversity.",
        currentStatus: "Community-managed eco-tourism destination open to visitors. Basic facilities available at the site. Gaining recognition as part of Catmon's emerging nature tourism circuit. Local guides available to assist visitors along the forest trail to the falls. Conservation-minded management to preserve the natural environment.",
        visitorInfo: "Open daily. Minimal entrance fee managed by local community. Located in the forested interior of Catmon — a trek of approximately 20 to 30 minutes from the road through forest trails. About 2 to 2.5 hours from Cebu City via the north road. Wear water-resistant footwear for the trail and pool area. Bring water and light snacks. Best visited during the dry season (January to June) for optimal water conditions and trail accessibility. Pairs perfectly with a trek up Mt. Kapayas for a complete Catmon nature day tour."
      },
      culturalPractices: [
        'Community eco-tourism and guiding',
        'Freshwater swimming traditions',
        'Environmental conservation',
        'Nature trekking and exploration'
      ],
      nativeFloraFauna: [
        'Native tropical forest trees',
        'Ferns, mosses, and climbing plants',
        'Freshwater fish and crustaceans',
        'Forest birds and dragonflies',
        'Riparian and understory vegetation'
      ],
      preservation: 'Managed by Catmon local community and municipal tourism office',
      highlights: ['Multi-Layered Waterfall', 'Natural Swimming Pools', 'Pair with Mt. Kapayas Trek']
    },
    { 
      id: 52, 
      name: 'Paradise Hills Mountain Resort', 
      location: 'Compostela, Cebu', 
      category: 'Natural Heritage',
      lat: 10.4583,
      lng: 124.0083,
      image: 'src/image/ParadiseHillsMountainResort.webp', 
      rating: 4.7,
      reviews: 2234,
      era: 'Modern resort development',
      heritageStatus: 'Mountain Eco-Resort',
      description: "A lush mountain resort in Compostela featuring verdant hillside gardens, refreshing pools, ziplines, and sweeping views of the Cebu countryside — a popular highland escape just north of Cebu City.",
      established: 'Modern development',
      builtBy: 'Private resort developers',
      detailedInfo: {
        overview: "Paradise Hills Mountain Resort is a sprawling highland retreat located in the scenic hills of Compostela, just north of Cebu City. The resort lives up to its name with beautifully landscaped gardens cascading down the hillside, multiple swimming pools, adventure activities including ziplines and nature trails, and spectacular panoramic views of the surrounding countryside and distant coastlines. It is one of the most accessible mountain resort destinations from Cebu City, making it a favorite for day trips and weekend getaways.",
        culturalSignificance: "Paradise Hills has played a significant role in establishing Compostela as a highland tourism destination for Cebu City residents and visitors. The resort showcases the natural beauty of the hills north of the city and provides a refreshing contrast to the urban environment below. It contributes meaningfully to local employment and the economy of Compostela while promoting appreciation for the natural highland landscape of northern Cebu.",
        architecture: "The resort is designed around the natural contours of the hillside, with facilities terraced down the slope to maximize views and create distinct zones for relaxation and activity. Features include multiple swimming pools at different elevations, landscaped garden paths, nipa hut cottages, function halls, a restaurant, and adventure facilities. The design integrates tropical landscaping with resort amenities, creating a lush and inviting highland environment.",
        currentStatus: "Fully operational highland resort popular for day tours, overnight stays, and events. Well-maintained facilities and grounds. A go-to destination for Cebuanos seeking a quick mountain escape. Popular venue for team buildings, family outings, and special celebrations. Continues to develop new amenities and attractions.",
        visitorInfo: "Open daily. Day tour entrance fees apply (check resort for current rates). Overnight accommodations available — advance booking recommended. Located in Compostela, approximately 45 minutes to 1 hour from Cebu City via the north road. Swimming pools, zipline, and gardens included in day tour. Restaurant on-site. Bring a light jacket for cooler evenings. Best visited on weekdays to avoid weekend crowds. Can be combined with visits to Estaca Bay Gardens and Cascades Nature Park for a full Compostela itinerary."
      },
      culturalPractices: [
        'Highland leisure and recreation',
        'Family and group eco-tourism',
        'Team building and events',
        'Nature appreciation and garden walks'
      ],
      nativeFloraFauna: [
        'Tropical garden plants and ornamentals',
        'Highland native trees',
        'Mountain bird species',
        'Flowering garden species',
        'Butterfly visitors'
      ],
      preservation: 'Maintained by private resort management with adherence to local environmental guidelines',
      highlights: ['Hillside Gardens & Pools', 'Zipline Adventure', 'Panoramic Countryside Views']
    },
    { 
      id: 53, 
      name: 'Estaca Bay Gardens Conference Resort', 
      location: 'Compostela, Cebu', 
      category: 'Natural Heritage',
      lat: 10.4500,
      lng: 124.0167,
      image: 'src/image/EstacaBayGardensConferenceResort.webp', 
      rating: 4.6,
      reviews: 1567,
      era: 'Modern resort development',
      heritageStatus: 'Bay Garden Resort and Conference Center',
      description: "A tranquil garden resort and conference center in Compostela overlooking the scenic Estaca Bay, blending natural coastal beauty with lush tropical gardens and modern event facilities.",
      established: 'Modern development',
      builtBy: 'Private resort and conference center developers',
      detailedInfo: {
        overview: "Estaca Bay Gardens Conference Resort is a peaceful and beautifully landscaped resort situated in Compostela, overlooking the calm waters of Estaca Bay. The resort combines well-tended tropical gardens, coastal views, swimming facilities, and modern conference amenities in one serene location. It serves both leisure travelers seeking a quiet garden retreat and organizations requiring a professional yet scenic venue for conferences, seminars, and team-building events.",
        culturalSignificance: "Estaca Bay Gardens represents the development of Compostela as a versatile tourism and MICE (Meetings, Incentives, Conferences, and Events) destination in northern Cebu. The resort contributes to the local economy while showcasing the natural beauty of Estaca Bay and the Compostela coastline. It has become a valued venue for both corporate and private events, providing a refreshing alternative to city-based function venues.",
        architecture: "The resort features well-maintained tropical garden landscapes with pathways, water features, and shaded rest areas. Coastal-facing structures take advantage of the bay views with open-air terraces and function spaces. Conference facilities are modern and air-conditioned. Accommodation units range from standard rooms to cottages. The overall design balances natural garden aesthetics with functional resort and conference infrastructure.",
        currentStatus: "Fully operational resort and conference center. Active venue for corporate events, seminars, team buildings, and leisure stays. Well-maintained gardens and facilities. Popular for groups and organizations seeking an out-of-city venue with natural surroundings. Advance booking recommended for conference facilities and accommodations.",
        visitorInfo: "Open daily. Day tour and overnight accommodation packages available. Conference facilities available for booking — advance reservation required. Located in Compostela, approximately 45 minutes to 1 hour from Cebu City. Scenic bay views from garden areas. Swimming pool available. Restaurant and catering services on-site. Best combined with Paradise Hills and Cascades Nature Park for a comprehensive Compostela experience."
      },
      culturalPractices: [
        'Corporate events and MICE tourism',
        'Garden leisure and relaxation',
        'Coastal nature appreciation',
        'Team building and group activities'
      ],
      nativeFloraFauna: [
        'Tropical garden ornamentals',
        'Coastal vegetation',
        'Bay and coastal bird species',
        'Flowering garden plants',
        'Marine life in Estaca Bay'
      ],
      preservation: 'Maintained by private resort management',
      highlights: ['Bay View Garden Resort', 'Conference & Events Venue', 'Tropical Garden Retreat']
    },
    { 
      id: 54, 
      name: 'Cascades Nature Park', 
      location: 'Compostela, Cebu', 
      category: 'Natural Heritage',
      lat: 10.4667,
      lng: 123.9917,
      image: 'src/image/CascadesNaturePark.webp', 
      rating: 4.8,
      reviews: 1987,
      era: 'Natural formation with developed eco-park',
      heritageStatus: 'Nature Park and Eco-Tourism Site',
      description: "A stunning nature park in Compostela built around natural cascading waterfalls and pools, offering swimming, cliff jumping, and immersive forest experiences in a beautifully developed eco-setting.",
      established: 'Community and private eco-park development',
      builtBy: 'Private developers in partnership with local community',
      detailedInfo: {
        overview: "Cascades Nature Park is one of Compostela's most exciting natural attractions, centered around a series of natural cascading waterfalls and crystal-clear pools carved into the forested hillside. The park has been thoughtfully developed to enhance visitor access while preserving the natural environment, featuring well-maintained pathways, viewing platforms, and swimming areas at various levels of the cascade system. It offers a thrilling combination of natural beauty, swimming, and adventure activities including cliff jumping, making it a favorite among both families and thrill-seekers.",
        culturalSignificance: "Cascades Nature Park represents the successful development of Compostela's natural water resources into a sustainable eco-tourism attraction. The park has significantly boosted tourism in Compostela, drawing visitors from Cebu City and beyond who might not otherwise have reason to visit the municipality. It provides meaningful livelihood for local residents through park employment and related tourism services, and has become a source of community pride.",
        biodiversity: "The natural waterfall and forest ecosystem of Cascades Nature Park supports rich tropical biodiversity. The surrounding forest features native trees, ferns, mosses, and diverse understory vegetation thriving in the moist environment. Freshwater fish, crustaceans, and aquatic insects inhabit the pools and streams. Various bird species and butterflies frequent the forested areas. The park's natural water systems are maintained in good ecological health through conservation management.",
        currentStatus: "Active and well-maintained eco-tourism park open year-round. Popular destination for families, groups, and adventure tourists from Cebu City and surrounding areas. Facilities include pathways, changing rooms, cottages, and a picnic area. Swimming and cliff jumping available in designated safe areas. Life jackets available. Growing in popularity and recognition as one of northern Cebu's top nature attractions.",
        visitorInfo: "Open daily 7:00 AM to 5:00 PM. Entrance fee applies (check park for current rates). Located in Compostela, approximately 45 minutes to 1 hour from Cebu City via the north road. Swimming in natural pools. Cliff jumping at designated spots (varying heights — proceed with caution). Life jackets available for rent. Cottages for day use. Bring own food and drinks. Wear water shoes for rocky pool areas. Best visited on weekdays to avoid weekend crowds. Pairs well with Paradise Hills and Estaca Bay Gardens for a full Compostela day tour."
      },
      culturalPractices: [
        'Eco-tourism and nature park visits',
        'Cliff jumping and adventure culture',
        'Family and group recreational swimming',
        'Environmental conservation awareness'
      ],
      nativeFloraFauna: [
        'Native tropical forest trees',
        'Ferns, mosses, and understory plants',
        'Freshwater fish and crustaceans',
        'Forest birds and butterflies',
        'Natural cascade and pool ecosystem'
      ],
      preservation: 'Managed by private park operators in coordination with Compostela Municipal Government',
      highlights: ['Natural Cascading Waterfalls', 'Cliff Jumping', 'Crystal-Clear Swimming Pools']
    },
    { 
      id: 55, 
      name: 'Valentin Farm Resort', 
      location: 'Consolacion, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3833,
      lng: 123.9583,
      image: 'src/image/Valentin-Farm-Resort.webp', 
      rating: 4.6,
      reviews: 1432,
      era: 'Modern agri-tourism development',
      heritageStatus: 'Agri-Tourism Farm Resort',
      description: "A charming farm resort in Consolacion blending agriculture, nature, and leisure — featuring farm animals, garden landscapes, swimming pools, and a relaxing countryside atmosphere just minutes from Cebu City.",
      established: 'Modern agri-tourism development',
      builtBy: 'Private farm resort developers',
      detailedInfo: {
        overview: "Valentin Farm Resort is a delightful agri-tourism destination located in Consolacion, one of Cebu's rapidly developing northern municipalities. The resort combines the rustic charm of a working farm with comfortable leisure facilities, offering visitors an immersive countryside experience close to Cebu City. Guests can interact with farm animals, explore garden landscapes, enjoy swimming pools, and experience the simple pleasures of farm life in a well-maintained and welcoming environment. It is especially popular with families seeking an educational and fun nature outing for children.",
        culturalSignificance: "Valentin Farm Resort represents the growing agri-tourism movement in Cebu, where agricultural lands are developed into educational and recreational destinations that connect urban residents with rural life and farming traditions. For a fast-urbanizing municipality like Consolacion, the farm resort preserves a connection to agricultural heritage while generating sustainable local livelihood. It serves as an important reminder of Cebu's farming roots amid the pressures of urban expansion.",
        architecture: "The resort is designed around a working farm aesthetic with native materials, open-air structures, and landscaped grounds. Farm animal enclosures are integrated naturally into the property. Swimming pools, picnic cottages, and function areas are arranged throughout the farm grounds. The overall design balances functional farm operations with comfortable visitor amenities, creating a cohesive countryside resort atmosphere.",
        currentStatus: "Fully operational agri-tourism resort open for day tours and events. Popular with families, school groups, and organizations for team building and educational farm visits. Well-maintained farm and facilities. Active venue for birthday celebrations and group outings. Continues to develop new farm attractions and animal exhibits.",
        visitorInfo: "Open daily. Day tour entrance fees apply (check resort for current rates). Located in Consolacion, approximately 30 to 45 minutes from Cebu City via the north road — one of the most accessible nature resorts from the city. Farm animal interactions, swimming pool, and garden areas included. Restaurant or picnic facilities on-site. Bring sunscreen and comfortable clothing. Ideal for children and families. Can be combined with a visit to Snake Road (Kabaskug Road) for a complete Consolacion experience."
      },
      culturalPractices: [
        'Agri-tourism and farm education',
        'Farm animal interaction experiences',
        'Family and children outdoor recreation',
        'Agricultural heritage appreciation'
      ],
      nativeFloraFauna: [
        'Farm animals (cattle, goats, pigs, poultry)',
        'Garden ornamental plants',
        'Fruit trees and vegetables',
        'Native farm birds',
        'Tropical garden flora'
      ],
      preservation: 'Maintained by private farm resort management',
      highlights: ['Farm Animal Interactions', 'Agri-Tourism Experience', 'Family-Friendly Resort']
    },
    { 
      id: 56, 
      name: 'Snake Road (Kabaskug Road)', 
      location: 'Consolacion, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.3917,
      lng: 123.9500,
      image: 'src/image/Snakeroad.jpg', 
      rating: 4.7,
      reviews: 1876,
      era: 'Modern engineering landmark',
      heritageStatus: 'Scenic Road and Engineering Landmark',
      description: "A famous serpentine mountain road in Consolacion known for its dramatic winding curves through lush hillside terrain, offering breathtaking panoramic views of Cebu City and Mactan Island.",
      established: 'Modern road development',
      builtBy: 'Cebu provincial and local government engineering',
      detailedInfo: {
        overview: "Snake Road, locally known as Kabaskug Road, is one of Consolacion's most iconic landmarks — a dramatically winding mountain road that snakes its way through the verdant hills above the municipality. The road earned its evocative nickname from its serpentine curves that resemble the body of a snake when viewed from above. Beyond being a functional thoroughfare connecting communities in the upland barangays, Snake Road has become a destination in itself, celebrated for its thrilling driving experience and the magnificent panoramic views it offers of Cebu City, Mactan Island, and the surrounding sea.",
        culturalSignificance: "Snake Road has become deeply embedded in the local identity and culture of Consolacion, representing the ingenuity of engineering that connected remote upland communities to the main municipality. It has evolved from a purely functional road into a popular recreational and tourism landmark. The road is a favorite among motorcycle enthusiasts, cyclists, joggers, and tourists seeking scenic views and a unique driving experience. Its distinctive character has made it one of the most photographed road landmarks in northern Cebu.",
        architecture: "The road features a series of sharp hairpin turns and sweeping curves engineered through challenging hillside terrain. The winding alignment follows the natural contours of the hills, creating the serpentine appearance that gives the road its name. At various points along the road, natural viewpoints offer unobstructed panoramic vistas of the Cebu metropolitan area, Mactan Island, and the waters of Mactan Channel. Roadside vegetation along much of the route adds to the scenic quality of the drive.",
        currentStatus: "Active public road open 24 hours. A popular recreational destination particularly during early mornings and evenings when the views of city lights or sunrise are most dramatic. Frequented by joggers, cyclists, and motorcycle riders. Occasional food and refreshment vendors at key viewpoints. A must-visit landmark for those exploring Consolacion and the hills north of Cebu City.",
        visitorInfo: "Open 24 hours — free access as a public road. Best visited early morning (5:00–7:00 AM) for sunrise views and cooler temperatures, or in the evening for panoramic city light views. Located in Consolacion, approximately 30 to 45 minutes from Cebu City. Accessible by private vehicle, motorcycle, or habal-habal. Exercise caution when driving due to sharp curves — reduce speed at all turns. Popular jogging and cycling route in the morning. Roadside viewpoints ideal for photography. Combine with a visit to Valentin Farm Resort for a full Consolacion day itinerary."
      },
      culturalPractices: [
        'Scenic driving and motorcycle touring',
        'Morning jogging and cycling culture',
        'Sunrise and city lights viewing',
        'Landscape and travel photography'
      ],
      nativeFloraFauna: [
        'Roadside tropical vegetation',
        'Hillside shrubs and grasses',
        'Native trees along the route',
        'Highland birds',
        'Butterflies and insects'
      ],
      preservation: 'Maintained by Consolacion Municipal Government and Cebu Provincial Engineering Office',
      highlights: ['Serpentine Mountain Road', 'Panoramic City & Sea Views', 'Iconic Photo Landmark']
    },
    { 
      id: 57, 
      name: '10,000 Roses Cafe & More', 
      location: 'Cordova, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.2583,
      lng: 123.9583,
      image: 'src/image/10,000Roses.webp', 
      rating: 4.8,
      reviews: 4567,
      era: 'Modern (2016)',
      heritageStatus: 'Iconic Tourist Landmark and Cafe',
      description: "Cebu's most photographed Instagram landmark — a magical seaside installation of thousands of white LED roses that glow brilliantly at night along the Cordova coastline, paired with a charming cafe and garden.",
      established: '2016',
      builtBy: 'Private developers and Cordova local government',
      detailedInfo: {
        overview: "10,000 Roses Cafe & More is one of the most iconic and widely photographed tourist attractions in Cebu, located along the scenic coastline of Cordova on Mactan Island. The landmark features a breathtaking installation of thousands of white artificial roses arranged in a romantic garden setting by the sea. At night, the roses illuminate brilliantly with LED lights, creating a magical and dreamy atmosphere that has made it one of the most popular photo destinations in the Visayas. The adjoining cafe serves refreshments and light meals, completing the experience.",
        culturalSignificance: "Since its opening in 2016, 10,000 Roses has become a defining cultural and tourism landmark of Cordova and Mactan Island, transforming the municipality into a destination for romantic outings, social media tourism, and leisure visits. It has played a significant role in putting Cordova on the tourism map of Cebu and has inspired similar floral and light installation attractions across the Philippines. The site represents the creative use of public art and landscape design to drive tourism and community pride.",
        architecture: "The installation features thousands of meticulously arranged white artificial roses mounted on wire frames that create sweeping garden formations along the waterfront. The roses are embedded with LED lights that create a soft, glowing effect after sunset. The seaside location provides a natural backdrop of the sea and neighboring islands. The cafe area features open-air and covered seating with views of the rose garden and coastline. Pathways weave through the rose installations, allowing visitors to walk among the flowers.",
        currentStatus: "Active tourist attraction and cafe open daily. One of Cebu's most visited landmarks, particularly popular in the evenings when the LED roses are illuminated. Well-maintained by private management with continuous improvements to the installation and facilities. A top destination for couples, families, and social media content creators. Located near other Mactan Island attractions making it easy to combine with day tours.",
        visitorInfo: "Open daily, typically from late afternoon through the evening (approximately 4:00 PM to 10:00 PM — check for current hours). Entrance fee: approximately ₱50–100. Located in Cordova along the Mactan Island coastline. Best visited after 6:00 PM when the LED roses are fully illuminated for the most dramatic effect. Cafe serves beverages, snacks, and light meals. Popular for romantic dates and group photo sessions. Can get crowded on weekends and holidays — arrive early to secure good photo spots. Easily accessible from Lapu-Lapu City and Mactan Island resorts."
      },
      culturalPractices: [
        'Romantic date and leisure outings',
        'Social media and travel photography',
        'Evening seaside recreation',
        'Community tourism and public art appreciation'
      ],
      nativeFloraFauna: [
        'Artificial LED rose installation',
        'Coastal seaside vegetation',
        'Seabirds along the waterfront',
        'Ornamental garden plants',
        'Coastal marine views'
      ],
      preservation: 'Maintained by private management in coordination with Cordova Municipal Government',
      highlights: ['10,000 LED Roses at Night', 'Iconic Cebu Photo Landmark', 'Romantic Seaside Cafe']
    },
    { 
      id: 58, 
      name: 'Malapascua Island', 
      location: 'Daanbantayan, Cebu', 
      category: 'Natural Heritage',
      lat: 11.3333,
      lng: 124.1167,
      image: 'src/image/MalapascuaIsland.webp', 
      rating: 4.9,
      reviews: 5234,
      era: 'Natural formation',
      heritageStatus: 'World-Class Marine Sanctuary and Island Destination',
      description: "A world-famous tiny island at the northern tip of Cebu, globally renowned as the only place in the world where thresher sharks can be reliably encountered year-round by divers.",
      established: 'Natural island — internationally recognized dive destination',
      builtBy: 'Natural coral and geological formation',
      detailedInfo: {
        overview: "Malapascua Island is a small, stunning island located at the northernmost tip of Cebu, reachable by a short boat ride from Daanbantayan. Despite its modest size of just 2.5 kilometers long and 1 kilometer wide, Malapascua has earned legendary status in the global diving community as the only place in the world where thresher sharks — with their distinctively long, scythe-like tails — can be reliably encountered year-round at the underwater cleaning station of Monad Shoal. Beyond diving, the island boasts powdery white sand beaches, crystal-clear turquoise waters, and a relaxed island atmosphere that makes it one of the most beloved destinations in the Philippines.",
        culturalSignificance: "Malapascua holds extraordinary significance for Philippine and global marine conservation and dive tourism. The island's thresher shark encounters at Monad Shoal are considered among the most remarkable wildlife experiences available to divers anywhere in the world, drawing enthusiasts from every corner of the globe. The island community has built a sustainable tourism economy around responsible dive tourism while working to protect the marine ecosystems that make Malapascua unique. It stands as a powerful example of how marine biodiversity can drive both conservation and community development.",
        biodiversity: "The waters surrounding Malapascua are extraordinarily biodiverse. Monad Shoal — a submerged island plateau — serves as a cleaning station where thresher sharks ascend from the deep at dawn. The reefs also host manta rays, white-tip reef sharks, mantis shrimp, diverse nudibranch species, seahorses, and hundreds of reef fish species. The island beaches and shallow waters support marine turtle habitats. Above the waterline, the island has coastal vegetation with white sand beaches fringed by palms and tropical shrubs.",
        currentStatus: "Established world-class dive and island tourism destination. Multiple dive shops and resorts cater to international visitors. Thresher shark dives at Monad Shoal conducted daily at dawn. Marine conservation efforts actively managed by dive operators and local government. The island has recovered well from Typhoon Yolanda (2013) and continues to develop sustainably. Malapascua is firmly on the international dive tourism circuit.",
        visitorInfo: "Access via boat from Maya Port in Daanbantayan (approximately 30 minutes). Daanbantayan is about 4 hours from Cebu City via the north road. Thresher shark dives at Monad Shoal at dawn daily — book through island dive shops. Accommodation ranges from budget guesthouses to mid-range resorts. Best diving season March to June. Beach activities, snorkeling, and island hopping available for non-divers. Advance accommodation booking strongly recommended during peak season. Island hopping to nearby Carnaza Island also available."
      },
      culturalPractices: [
        'World-class scuba diving and freediving',
        'Thresher shark dive expeditions',
        'Marine conservation and responsible tourism',
        'Island beach culture and leisure'
      ],
      nativeFloraFauna: [
        'Thresher sharks at Monad Shoal',
        'Manta rays and white-tip reef sharks',
        'Diverse coral reef ecosystems',
        'Marine turtles',
        'Tropical reef fish species'
      ],
      preservation: 'Managed by Daanbantayan Municipal Government, local dive operators, and marine conservation organizations',
      highlights: ['Thresher Shark Diving', 'World-Class Dive Site', 'White Sand Beach Island']
    },
    { 
      id: 59, 
      name: 'Carnaza Island', 
      location: 'Daanbantayan, Cebu', 
      category: 'Natural Heritage',
      lat: 11.4333,
      lng: 124.0500,
      image: 'src/image/Carnaza-Island-1-1024x576.webp', 
      rating: 4.8,
      reviews: 2345,
      era: 'Natural formation',
      heritageStatus: 'Natural Island and Marine Sanctuary',
      description: "A pristine and largely undiscovered island north of Cebu featuring dramatic limestone cliffs, white sand beaches, caves, and vibrant coral reefs — a true hidden paradise in northern Cebu.",
      established: 'Natural island formation',
      builtBy: 'Natural coral, limestone, and geological formation',
      detailedInfo: {
        overview: "Carnaza Island is a breathtaking island gem located north of Malapascua, accessible from Daanbantayan in northern Cebu. Far less commercialized than Malapascua, Carnaza remains an authentic and largely unspoiled island destination characterized by dramatic limestone cliffs, hidden coves, white sand beaches, crystal-clear waters, and vibrant coral reefs. The island features remarkable cave systems, natural rock formations, and a serene atmosphere that rewards adventurous travelers willing to make the longer boat journey.",
        culturalSignificance: "Carnaza Island represents the last frontier of undiscovered island tourism in Cebu. Its relative inaccessibility has preserved its pristine natural character, and it is increasingly sought out by discerning eco-travelers and adventure tourists looking for an authentic island experience away from commercialized destinations. The small island community maintains traditional fishing practices and a way of life closely connected to the sea. Growing responsible tourism is beginning to provide supplemental livelihood while community members work to protect their natural environment.",
        biodiversity: "Carnaza's marine and terrestrial ecosystems are exceptionally well-preserved due to its remote location and limited visitor numbers. The surrounding coral reefs are healthy and diverse, supporting a wide array of reef fish, invertebrates, and marine life. The dramatic limestone karst formations provide unique terrestrial habitats. Cave systems within the limestone cliffs house diverse cave fauna. Sea turtles nest on the island's beaches. The island's coastal vegetation includes native trees, shrubs, and coastal plants.",
        currentStatus: "Emerging eco-tourism destination with very limited development, preserving its pristine character. Basic community-run accommodation may be available for overnight stays. Growing in recognition among adventure travelers and divers. Access remains challenging, contributing to its unspoiled nature. No large-scale commercial development, maintaining an authentic island atmosphere.",
        visitorInfo: "Access via boat from Maya Port in Daanbantayan or from Malapascua Island (approximately 1.5 to 2 hours by boat). Daanbantayan is approximately 4 hours from Cebu City via the north road. Day trips and overnight stays possible — coordinate with local boat operators or tourism offices in Daanbantayan. Bring all necessary supplies including food, water, and camping equipment for overnight stays. Snorkeling gear recommended. Best visited during calm weather (March to June). Ideal for adventurous travelers seeking an off-the-beaten-path island experience. Can be combined with a visit to Malapascua Island for a northern Cebu island adventure."
      },
      culturalPractices: [
        'Adventure island exploration',
        'Cave exploration and spelunking',
        'Traditional fishing community culture',
        'Eco-tourism and responsible travel'
      ],
      nativeFloraFauna: [
        'Pristine coral reef ecosystems',
        'Sea turtles and marine life',
        'Limestone cave fauna',
        'Native coastal and island vegetation',
        'Diverse reef fish species'
      ],
      preservation: 'Managed by local island community with Daanbantayan Municipal Government oversight',
      highlights: ['Pristine Limestone Island', 'Hidden Coves & Caves', 'Untouched Coral Reefs']
    },
    { 
      id: 60, 
      name: 'Obong Spring', 
      location: 'Dalaguete, Cebu', 
      category: 'Natural Heritage',
      lat: 9.7583,
      lng: 123.5333,
      image: 'src/image/Obong+Spring+Dalaguete+Cebu.webp', 
      rating: 4.7,
      reviews: 1654,
      era: 'Natural formation',
      heritageStatus: 'Natural Spring and Eco-Tourism Site',
      description: "A stunning natural spring in Dalaguete featuring crystal-clear, emerald-green waters flowing from a natural source, surrounded by lush forest vegetation and offering a refreshing freshwater swimming experience.",
      established: 'Natural formation',
      builtBy: 'Natural geological and hydrological processes',
      detailedInfo: {
        overview: "Obong Spring is one of southern Cebu's most beautiful and refreshing natural attractions, located in the municipality of Dalaguete. The spring is fed by a natural underground source that produces remarkably clear, cool water with a distinctive emerald-green hue. The spring flows into a natural pool large enough for swimming, surrounded by lush tropical vegetation that creates a shaded and serene atmosphere. Obong Spring is a beloved local recreational destination and a growing eco-tourism attraction that showcases the natural wealth of Dalaguete.",
        culturalSignificance: "Obong Spring holds deep importance for the Dalaguete community as a traditional freshwater source and recreational gathering place that has been cherished by local residents for generations. The spring represents the natural heritage of the municipality and complements Dalaguete's growing identity as a nature tourism destination alongside nearby Osmeña Peak. It provides sustainable eco-tourism livelihood for local community members and demonstrates the value of protecting natural water sources.",
        biodiversity: "The spring and its surrounding environment support a rich freshwater and forest ecosystem. The natural pool hosts freshwater fish, aquatic plants, and invertebrates adapted to the cool, clear spring water. The surrounding forest vegetation includes native trees, ferns, mosses, and diverse understory plants that thrive in the moist environment. Various bird species and butterflies frequent the forested area around the spring. The consistent water temperature and clarity indicate a healthy and well-preserved natural watershed.",
        currentStatus: "Community-managed eco-tourism destination open to visitors. Basic facilities in place including pathways and changing areas. Growing in popularity as part of Dalaguete's nature tourism circuit alongside Osmeña Peak. Conservation efforts in place to protect the spring's water quality and surrounding forest. A rewarding stop for visitors combining natural and highland attractions in southern Cebu.",
        visitorInfo: "Open daily during daylight hours. Minimal entrance fee managed by local community. Located in Dalaguete, approximately 3 to 3.5 hours from Cebu City via the south road. Swimming in the natural spring pool. Bring own towel and change of clothes. Water shoes recommended for rocky pool areas. Best visited during the dry season for optimal water conditions. Combine with a trek to nearby Osmeña Peak and a visit to Dalaguete Beach Park for a complete Dalaguete day itinerary."
      },
      culturalPractices: [
        'Community freshwater swimming traditions',
        'Eco-tourism and nature appreciation',
        'Environmental conservation of the spring',
        'Local guiding services'
      ],
      nativeFloraFauna: [
        'Emerald-green spring water ecosystem',
        'Native freshwater fish',
        'Forest ferns, mosses, and trees',
        'Aquatic plants and invertebrates',
        'Forest birds and butterflies'
      ],
      preservation: 'Managed by Dalaguete local community and municipal tourism office',
      highlights: ['Emerald-Green Natural Spring', 'Crystal-Clear Swimming Pool', 'Lush Forest Setting']
    },
    { 
      id: 61, 
      name: 'Dalaguete Beach Park', 
      location: 'Dalaguete, Cebu', 
      category: 'Natural Heritage',
      lat: 9.7617,
      lng: 123.5417,
      image: 'src/image/DalagueteBeachPark.webp', 
      rating: 4.6,
      reviews: 1432,
      era: 'Natural formation with developed park facilities',
      heritageStatus: 'Municipal Beach Park',
      description: "A well-maintained municipal beach park along the southern Cebu coastline, offering a clean and accessible beach experience with calm waters, picnic facilities, and beautiful views of the Tañon Strait.",
      established: 'Municipal park development',
      builtBy: 'Dalaguete Municipal Government',
      detailedInfo: {
        overview: "Dalaguete Beach Park is a well-maintained municipal coastal park located along the western shoreline of Dalaguete, facing the scenic Tañon Strait. The park provides a clean, organized, and accessible beach destination for both residents and visitors, featuring a stretch of beach with calm waters suitable for swimming, shaded picnic areas, rest facilities, and a pleasant seaside atmosphere. It serves as the main public beach facility of Dalaguete and a convenient coastal complement to the municipality's highland attractions.",
        culturalSignificance: "Dalaguete Beach Park is an important community recreational space that reflects the municipality's commitment to providing accessible public leisure facilities for its residents. The beach park has become a gathering place for families, friends, and community events, playing an important role in the social and cultural life of Dalaguete. As tourism in the municipality grows — driven by attractions like Osmeña Peak and Obong Spring — the beach park serves as a welcoming coastal gateway that rounds out the Dalaguete visitor experience.",
        biodiversity: "The coastal waters of Dalaguete Beach Park support marine life including small reef fish, sea grass beds, and invertebrates in the shallower nearshore areas. The Tañon Strait, which the park overlooks, is a designated protected seascape known for its rich marine biodiversity including dolphins, whale sharks, and diverse fish populations. Coastal vegetation including coconut palms and native shoreline plants line the beach park grounds. Seabirds are commonly observed along the coastline.",
        currentStatus: "Active municipal beach park open to the public. Well-maintained by the Dalaguete municipal government with regular upkeep of facilities. Popular with local residents for weekend and holiday outings, and increasingly visited by tourists combining the beach park with Dalaguete's highland attractions. Basic facilities including restrooms, picnic shelters, and changing areas available.",
        visitorInfo: "Open daily. Minimal entrance fee. Located in Dalaguete town proper along the Tañon Strait coastline, approximately 3 to 3.5 hours from Cebu City via the south road. Calm and generally safe swimming waters. Picnic shelters and rest facilities available. Food vendors may be present. Best visited during dry season for optimal beach conditions. Sunset views over the Tañon Strait are particularly scenic. Combine with Obong Spring and Osmeña Peak for a complete Dalaguete nature day tour."
      },
      culturalPractices: [
        'Community beach recreation and swimming',
        'Family and group picnic gatherings',
        'Sunset watching over Tañon Strait',
        'Municipal public park culture'
      ],
      nativeFloraFauna: [
        'Coconut palms and coastal vegetation',
        'Seabirds along the shoreline',
        'Nearshore marine fish and invertebrates',
        'Seagrass beds',
        'Tañon Strait marine biodiversity'
      ],
      preservation: 'Maintained by Dalaguete Municipal Government',
      highlights: ['Tañon Strait Coastal Views', 'Clean Municipal Beach', 'Pair with Osmeña Peak & Obong Spring']
    },
    { 
      id: 62, 
      name: 'Danasan Eco Adventure Park', 
      location: 'Danao City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.5167,
      lng: 124.0333,
      image: 'src/image/DanasanEcoAdventureParkTicketinCebu.webp', 
      rating: 4.8,
      reviews: 3456,
      era: 'Modern eco-adventure park development',
      heritageStatus: 'Eco-Adventure Park and Nature Reserve',
      description: "One of Cebu's premier adventure destinations in the highlands of Danao City, offering an exhilarating range of activities including ziplines, rappelling, ATV rides, river trekking, and camping amid stunning mountain scenery.",
      established: 'Modern development',
      builtBy: 'Private developers in partnership with Danao City Government',
      detailedInfo: {
        overview: "Danasan Eco Adventure Park is one of the most thrilling and comprehensive eco-adventure destinations in Cebu, nestled in the scenic highlands of Danao City. Spanning a vast area of forested mountain terrain, the park offers an impressive roster of adventure activities set against the backdrop of dramatic Cebu highland scenery. From heart-pumping ziplines and rappelling to ATV rides through rugged trails, river trekking through canyon gorges, and overnight camping under the stars, Danasan delivers an unforgettable adventure experience for thrill-seekers of all levels.",
        culturalSignificance: "Danasan Eco Adventure Park has significantly elevated the tourism profile of Danao City, transforming a largely industrial city into a recognized adventure tourism destination in Cebu. The park has created meaningful employment and livelihood opportunities for local residents while showcasing the natural beauty of the Danao highlands. It represents a successful model of sustainable eco-adventure tourism that harnesses natural terrain for recreation while promoting environmental stewardship and conservation awareness.",
        biodiversity: "The park is set within a highland forest ecosystem with rich tropical biodiversity. The river systems used for trekking activities flow through healthy riparian habitats supporting freshwater fish, crustaceans, and aquatic life. The surrounding forests provide habitat for various bird species, mammals, and insects. The park's management includes conservation zones that protect the natural environment while allowing carefully managed adventure activities in designated areas.",
        currentStatus: "Fully operational eco-adventure park open year-round. Wide range of adventure activities available for individuals and groups. Popular with corporate team building groups, school trips, and adventure-seeking tourists. Well-maintained facilities including a campsite, function areas, and support infrastructure. One of northern Cebu's top adventure tourism destinations. Advance booking recommended for group activities and overnight camping.",
        visitorInfo: "Open daily 7:00 AM to 5:00 PM (camping check-in varies). Activity fees vary by package — zipline, rappelling, ATV, river trekking, and camping available individually or in packages (approximately ₱500–₱2,500+ depending on activities). Located in the highlands of Danao City, approximately 1.5 to 2 hours from Cebu City via the north road. Wear comfortable, activity-appropriate clothing and closed shoes. Bring extra clothes for river activities. All safety equipment provided. Advance booking strongly recommended. Can be combined with a trek up Mount Manghilao for a full Danao adventure itinerary."
      },
      culturalPractices: [
        'Eco-adventure and extreme sports tourism',
        'Corporate team building activities',
        'Outdoor camping and nature immersion',
        'Environmental education and conservation'
      ],
      nativeFloraFauna: [
        'Highland tropical forest trees',
        'Freshwater river ecosystem',
        'Forest birds and wildlife',
        'Native ferns and understory plants',
        'Mountain stream flora and fauna'
      ],
      preservation: 'Managed by private park operators in coordination with Danao City Government and environmental agencies',
      highlights: ['Zipline & Rappelling', 'River Trekking Adventure', 'Highland Camping']
    },
    { 
      id: 63, 
      name: 'Mount Manghilao', 
      location: 'Danao City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.5250,
      lng: 124.0167,
      image: 'src/image/Mount-Manghilao.webp', 
      rating: 4.7,
      reviews: 1678,
      era: 'Natural/Geological formation',
      heritageStatus: 'Natural Mountain Landmark and Hiking Destination',
      description: "A rewarding mountain trek in the highlands of Danao City offering panoramic views of the Cebu coastline, the Camotes Sea, and surrounding countryside from its scenic summit.",
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: "Mount Manghilao is a notable mountain summit located in the highlands of Danao City in northern Cebu. The peak is a popular hiking destination that rewards trekkers with sweeping panoramic views from its summit, including vistas of the Camotes Sea, the Danao coastline, surrounding hills, and on clear days, the Camotes Islands. The mountain offers a fulfilling trekking experience through tropical forest and grassland terrain, making it a favorite among hiking enthusiasts from Danao City and the greater Cebu area.",
        culturalSignificance: "Mount Manghilao is an important natural landmark for Danao City, contributing to the municipality's growing identity as an eco-adventure and nature tourism destination alongside Danasan Eco Adventure Park. The mountain has become a focus of local pride and environmental awareness, with community members serving as guides and stewards of the trail. Trekking culture around Mount Manghilao promotes physical wellness, environmental appreciation, and community-based livelihood through guiding services.",
        biodiversity: "The slopes of Mount Manghilao support a diverse highland ecosystem transitioning from tropical forest at lower elevations to open grasslands and shrubland near the summit. The forested sections harbor various bird species, insects, and small mammals. Native trees, shrubs, wildflowers, and ferns grow along the trail. The mountain serves as part of the watershed system for Danao City, with its forests playing a critical role in water retention and supply for downstream communities.",
        currentStatus: "Active hiking destination with maintained trails and available local guides. Growing in popularity among hikers from Cebu City and northern Cebu. Basic trail infrastructure in place. Community-based guiding services available. Conservation efforts ongoing to protect the mountain's natural vegetation and watershed function.",
        visitorInfo: "Best started early morning (4:00–5:00 AM) to reach the summit for sunrise and to complete the trek before midday heat. Minimal entrance and guide fees. Local guides available and recommended — coordinate with Danao City Tourism Office. Trekking time approximately 1.5 to 2.5 hours to summit depending on fitness level and trail conditions. Bring sufficient water (at least 1.5 liters), snacks, and sun protection. Wear proper trekking shoes. Located in Danao City highlands, approximately 1.5 to 2 hours from Cebu City. Pairs perfectly with Danasan Eco Adventure Park for a complete Danao highlands adventure."
      },
      culturalPractices: [
        'Mountain trekking and hiking culture',
        'Sunrise summit viewing',
        'Community guiding and eco-tourism',
        'Environmental conservation awareness'
      ],
      nativeFloraFauna: [
        'Tropical highland forest trees',
        'Summit grasslands and shrubland',
        'Native wildflowers and ferns',
        'Mountain bird species',
        'Forest insects and butterflies'
      ],
      preservation: 'Managed by Danao City Tourism Office and local community guides',
      highlights: ['Panoramic Summit Views', 'Camotes Sea Vistas', 'Pair with Danasan Adventure Park']
    },
    { 
      id: 64, 
      name: 'Malubog Lake', 
      location: 'Toledo City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3833,
      lng: 123.6333,
      image: 'src/image/Malubog-Lake.webp', 
      rating: 4.7,
      reviews: 1876,
      era: 'Natural formation',
      heritageStatus: 'Natural Lake and Watershed Reserve',
      description: "A serene and picturesque freshwater lake nestled in the mountains of Toledo City, surrounded by lush forest and offering kayaking, fishing, and peaceful nature immersion with stunning highland scenery.",
      established: 'Natural formation',
      builtBy: 'Natural geological and hydrological processes',
      detailedInfo: {
        overview: "Malubog Lake is a tranquil freshwater lake located in the mountainous interior of Toledo City in western Cebu. Cradled by verdant forested hills, the lake offers a peaceful and scenic natural retreat far removed from the industrial character of Toledo's lowlands. The calm, reflective waters and surrounding highland landscape create a serene atmosphere ideal for kayaking, fishing, picnicking, and quiet nature appreciation. The lake is one of Toledo City's most prized natural assets and a growing eco-tourism destination.",
        culturalSignificance: "Malubog Lake holds significant importance for Toledo City as both a critical watershed resource and a natural heritage landmark. The lake and its surrounding forest form an essential part of the water supply system for communities in the area. As eco-tourism develops in Toledo City, Malubog Lake serves as a centerpiece natural attraction that showcases the city's remarkable natural landscapes beyond its well-known mining and industrial identity, offering a more complete picture of Toledo's environmental and cultural heritage.",
        biodiversity: "The lake ecosystem supports freshwater fish species, aquatic plants, and invertebrates. The surrounding forested watershed harbors a diverse array of bird species, small mammals, and insects. Native trees, ferns, and undergrowth thrive on the lake's hillside margins. The healthy watershed forest maintains water quality and regulates the lake's water levels. The area's biodiversity benefits from its relative remoteness and the protective buffer of the surrounding forest reserve.",
        currentStatus: "Managed eco-tourism destination with basic facilities. Kayaking and bamboo raft rentals available. Fishing permitted with community guidelines. Picnic areas established along the lakeshore. Growing in recognition as one of western Cebu's most beautiful natural attractions. Conservation efforts ongoing to protect the watershed and lake ecosystem.",
        visitorInfo: "Open daily during daylight hours. Entrance fee applies (check with Toledo City Tourism Office for current rates). Located in the mountains of Toledo City, approximately 2.5 to 3 hours from Cebu City via the trans-central highway or the western coastal road. Kayak and bamboo raft rentals available on-site. Bring own food and water. Cool highland temperature — bring a light jacket. Best visited during the dry season for clear skies and calm waters. Can be combined with visits to Biga Pit, Mount Tagaytay, and other Toledo City attractions for a comprehensive western Cebu itinerary."
      },
      culturalPractices: [
        'Freshwater kayaking and boating',
        'Traditional fishing practices',
        'Nature picnicking and leisure',
        'Watershed conservation advocacy'
      ],
      nativeFloraFauna: [
        'Freshwater fish species',
        'Aquatic plants and invertebrates',
        'Native highland forest trees',
        'Forest birds and wildlife',
        'Riparian and lakeshore vegetation'
      ],
      preservation: 'Managed by Toledo City Government and local community with DENR oversight for watershed protection',
      highlights: ['Scenic Mountain Lake', 'Kayaking & Fishing', 'Highland Forest Setting']
    },
    { 
      id: 65, 
      name: 'Biga Pit (Berong Open Pit Mine)', 
      location: 'Toledo City, Cebu', 
      category: 'Cultural Heritage',
      lat: 10.3667,
      lng: 123.6500,
      image: 'src/image/Biga-Pit.webp', 
      rating: 4.6,
      reviews: 1543,
      era: 'Industrial heritage (operated since 1955)',
      heritageStatus: 'Industrial Heritage and Mining Tourism Site',
      description: "One of the largest open-pit copper mines in Southeast Asia and a remarkable industrial heritage landmark in Toledo City, offering unique mining tourism experiences and insight into Cebu's copper mining legacy.",
      established: '1955 (Carmen Copper Corporation)',
      builtBy: 'Carmen Copper Corporation (formerly Atlas Consolidated Mining)',
      detailedInfo: {
        overview: "Biga Pit, also known as the Berong Open Pit Mine, is one of the largest open-pit copper mines in Southeast Asia, located in Toledo City in western Cebu. Operated by Carmen Copper Corporation (formerly Atlas Consolidated Mining and Development Corporation), the mine has been a cornerstone of Toledo City's identity and economy since operations began in 1955. The sheer scale of the pit — stretching hundreds of meters wide and deep into the earth — is a dramatic and awe-inspiring sight that has become a unique tourism attraction offering visitors an extraordinary window into large-scale copper mining operations.",
        culturalSignificance: "Biga Pit is inseparable from the history and identity of Toledo City. For decades, the Atlas Copper Mine was the economic engine of the city, providing livelihoods for thousands of Toledo residents and their families. The mining operations shaped Toledo's urban development, infrastructure, and community character. The mine represents a significant chapter in Philippine industrial history and copper mining heritage. Mining tourism at Biga Pit offers visitors a rare educational and visually stunning encounter with large-scale industrial operations while acknowledging the complex environmental and social legacy of mining in the region.",
        architecture: "The open pit itself is an extraordinary feat of industrial engineering — a massive terraced excavation carved into the earth over decades of mining operations. Viewing platforms and designated observation areas allow visitors to safely appreciate the dramatic scale of the pit. The surrounding mine complex includes processing facilities, tailings ponds, heavy equipment yards, and mine infrastructure that collectively tell the story of large-scale copper extraction. The visual contrast between the industrial pit and the surrounding natural landscape of western Cebu hills is striking.",
        currentStatus: "Active mining operation with regulated mining tourism program. Organized tours available through Carmen Copper Corporation's community relations and tourism program. Viewing platforms accessible to visitors on scheduled tours. The mine continues to operate while also welcoming educational and tourism visits. An unusual and memorable experience that blends industrial heritage with responsible tourism.",
        visitorInfo: "Tours organized through Carmen Copper Corporation — advance coordination with the company's community affairs office required. Located in Toledo City, approximately 2.5 to 3 hours from Cebu City. Safety briefing and personal protective equipment (hard hat, safety vest) required and provided. Photography policies may apply — confirm with tour coordinators. Best combined with visits to Malubog Lake, Mount Tagaytay, and other Toledo City attractions for a comprehensive western Cebu experience."
      },
      culturalPractices: [
        'Industrial heritage and mining tourism',
        'Educational mine site visits',
        'Community relations and corporate tourism',
        'Mining history documentation and appreciation'
      ],
      nativeFloraFauna: [
        'Surrounding western Cebu hill vegetation',
        'Rehabilitation plantings on mine perimeters',
        'Birds adapting to industrial landscape',
        'Native shrubs on undisturbed areas',
        'Tailings area revegetation efforts'
      ],
      preservation: 'Managed by Carmen Copper Corporation under DENR environmental compliance and mining regulations',
      highlights: ['Largest Open-Pit Copper Mine in SE Asia', 'Industrial Heritage Tourism', 'Dramatic Mining Landscape']
    },
    { 
      id: 66, 
      name: 'Mount Tagaytay (Toledo)', 
      location: 'Toledo City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3500,
      lng: 123.6167,
      image: 'src/image/Mount-Tagaytay-Toledo.webp', 
      rating: 4.8,
      reviews: 1987,
      era: 'Natural/Geological formation',
      heritageStatus: 'Natural Mountain Landmark and Hiking Destination',
      description: "A majestic mountain peak in Toledo City offering breathtaking panoramic views of both the eastern and western coasts of Cebu Island — one of the few peaks where you can see both the Tañon Strait and the Cebu metropolitan skyline.",
      established: 'Natural formation',
      builtBy: 'Natural geological processes',
      detailedInfo: {
        overview: "Mount Tagaytay in Toledo City is one of the most rewarding and spectacular mountain trekking destinations in Cebu. Situated along the central mountain spine of the island, the peak offers the extraordinary experience of seeing both coasts of Cebu simultaneously — the Tañon Strait and the mountains of Negros to the west, and the Cebu metropolitan area and Mactan Island to the east. This unique dual-coast panorama, combined with the mountain's striking highland landscape of ridges, grasslands, and forest, makes Mount Tagaytay one of the most scenically dramatic summits in the province.",
        culturalSignificance: "Mount Tagaytay is a source of deep pride for Toledo City, representing the natural grandeur of western Cebu's mountainous terrain. The peak has become an increasingly popular trekking destination that contributes to eco-tourism development in Toledo City, complementing the city's industrial heritage. The mountain trek connects trekkers with the wild natural landscape of central Cebu and fosters appreciation for the island's ecological importance as a water catchment and biodiversity zone.",
        biodiversity: "The mountain's diverse elevation zones support a range of vegetation types from tropical forest on the lower slopes to montane grasslands and shrubland near the summit ridge. The area harbors various bird species, small mammals, and insects. Native trees, wildflowers, and ferns are abundant along the trail. The mountain forms part of the central Cebu watershed system, with its forested slopes playing a critical role in water supply for both western and eastern Cebu communities.",
        currentStatus: "Active trekking destination with established trails. Local guides available through Toledo City Tourism Office and community guide associations. Growing in recognition among Cebu hiking enthusiasts. Sunrise treks particularly popular. Basic trail facilities in place with conservation measures to manage visitor impact on the mountain ecosystem.",
        visitorInfo: "Best started in the early hours (3:00–4:00 AM) for a sunrise summit experience. Guide fees and minimal trail fees apply — coordinate with Toledo City Tourism Office. Trekking time approximately 2 to 3 hours to summit depending on fitness and trail conditions. Bring sufficient water (2 liters minimum), energy snacks, sun protection, and a light jacket for the cool summit. Wear proper trekking shoes. Located in Toledo City, approximately 2.5 to 3 hours from Cebu City. Combine with Malubog Lake, Biga Pit, and Lapos-Lapos Cave for a full Toledo City exploration."
      },
      culturalPractices: [
        'Mountain trekking and summit hiking',
        'Sunrise and dual-coast panorama viewing',
        'Community eco-tourism and guiding',
        'Environmental conservation of the watershed'
      ],
      nativeFloraFauna: [
        'Montane forest and grassland vegetation',
        'Native highland tree species',
        'Summit wildflowers and shrubs',
        'Mountain bird species',
        'Forest wildlife and insects'
      ],
      preservation: 'Managed by Toledo City Tourism Office and local community guide associations with DENR coordination',
      highlights: ['Dual Coast Panorama', 'East & West Cebu Views', 'Dramatic Highland Trek']
    },
    { 
      id: 67, 
      name: 'Lapos-Lapos Cave', 
      location: 'Toledo City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3750,
      lng: 123.6417,
      image: 'src/image/Lapos-Lapos-Cave.webp', 
      rating: 4.6,
      reviews: 1234,
      era: 'Natural formation',
      heritageStatus: 'Natural Cave System',
      description: "A fascinating cave system in the limestone hills of Toledo City featuring dramatic stalactite and stalagmite formations, underground chambers, and an adventurous spelunking experience in western Cebu.",
      established: 'Natural formation',
      builtBy: 'Natural karst and limestone geological processes',
      detailedInfo: {
        overview: "Lapos-Lapos Cave is a notable natural cave system located in the limestone terrain of Toledo City in western Cebu. The cave features a series of underground chambers adorned with impressive stalactite and stalagmite formations sculpted over thousands of years by water and limestone geology. Exploring Lapos-Lapos Cave offers visitors a fascinating spelunking adventure through the underground landscape of western Cebu, revealing the hidden natural heritage beneath the surface of Toledo's rugged terrain.",
        culturalSignificance: "Lapos-Lapos Cave adds a distinctive dimension to Toledo City's tourism landscape, complementing the city's mountain, lake, and industrial heritage attractions with a unique underground adventure. Cave systems like Lapos-Lapos are scientifically important as geological records of the landscape's formation over millennia and as habitats for specialized cave-dwelling species. The cave contributes to awareness of the geological heritage of western Cebu and provides an alternative eco-tourism experience for visitors to the area.",
        biodiversity: "The cave interior provides habitat for cave-adapted species including bats, cave insects, spiders, and microorganisms. The bat colonies within the cave play important ecological roles as pollinators and pest controllers in the surrounding landscape. The cave's moisture supports moss, algae, and other organisms at the cave entrance. The surrounding limestone hills host surface vegetation adapted to the rocky terrain.",
        currentStatus: "Accessible cave tourism site with local guide services. Basic safety measures in place for visitor exploration. Guided cave tours available through community guides. Growing as part of Toledo City's eco-tourism circuit. Conservation awareness promoted to protect the cave formations and wildlife from damage.",
        visitorInfo: "Access with local guide required — coordinate with Toledo City Tourism Office or barangay officials. Headlamps or flashlights required (may be available for rental). Wear sturdy shoes suitable for uneven cave terrain. Helmet recommended. Entrance fee applies. Located in Toledo City, approximately 2.5 to 3 hours from Cebu City. Duration of cave tour approximately 1 to 1.5 hours. Do not touch cave formations (stalactites/stalagmites). Respect the cave ecosystem. Combine with other Toledo City attractions for a full western Cebu day trip."
      },
      culturalPractices: [
        'Spelunking and cave exploration',
        'Geological and natural heritage education',
        'Community guide services',
        'Environmental conservation of cave ecosystems'
      ],
      nativeFloraFauna: [
        'Cave bat colonies',
        'Cave insects and spiders',
        'Moss and cave entrance vegetation',
        'Stalactite and stalagmite formations',
        'Cave microorganism ecosystems'
      ],
      preservation: 'Managed by local barangay and Toledo City Government with conservation guidelines',
      highlights: ['Stalactite & Stalagmite Formations', 'Spelunking Adventure', 'Western Cebu Cave System']
    },
    { 
      id: 68, 
      name: 'Capilla Santa Ana Museum', 
      location: 'Toledo City, Cebu', 
      category: 'Historical Heritage',
      lat: 10.3783,
      lng: 123.6367,
      image: 'src/image/Capilla-Santa-Ana-Museum.webp', 
      rating: 4.7,
      reviews: 987,
      era: 'Spanish Colonial heritage',
      heritageStatus: 'Heritage Chapel and Museum',
      description: "A beautifully preserved Spanish colonial chapel and heritage museum in Toledo City housing centuries-old religious artifacts, colonial-era relics, and a curated collection documenting Toledo's rich historical past.",
      established: 'Spanish Colonial period — museum established in modern era',
      builtBy: 'Spanish colonial Catholic Church and Toledo community',
      detailedInfo: {
        overview: "The Capilla Santa Ana Museum is a significant heritage site in Toledo City combining a well-preserved Spanish colonial chapel with a curated museum collection. The chapel of Santa Ana, dating to the Spanish colonial era, serves as both an active place of devotion and a heritage museum housing a remarkable collection of religious artifacts, colonial-era relics, antique religious images, vestments, and historical documents that chronicle Toledo City's long Catholic and colonial history. It stands as one of the most important heritage conservation efforts in western Cebu.",
        culturalSignificance: "The Capilla Santa Ana Museum is a vital repository of Toledo City's colonial religious and cultural heritage. It preserves tangible connections to the Spanish colonial past of western Cebu and the Catholic faith traditions that have shaped the community's identity for centuries. The museum plays an important educational role, documenting and displaying artifacts that might otherwise be lost to time or neglect. For Toledo City residents, the chapel and museum represent a living link to their ancestral history and Catholic heritage.",
        architecture: "The chapel features Spanish colonial ecclesiastical architecture characteristic of Cebu's heritage churches, with coral stone or stone masonry construction, thick walls, and traditional religious architectural elements. The museum spaces within and adjacent to the chapel are arranged to showcase the historical collection in a respectful and educational manner. The heritage structure itself — maintained in good condition — is as significant as the artifacts it houses.",
        currentStatus: "Active chapel and functioning heritage museum open to visitors. Maintained by the local parish and heritage conservation volunteers. Visited by history enthusiasts, researchers, and cultural tourists exploring western Cebu's heritage sites. An important stop on Toledo City's heritage tourism circuit alongside Puting Bato and other historical landmarks.",
        visitorInfo: "Open during regular hours — check with Toledo City Tourism Office or the parish for current visiting hours. Modest attire required (no sleeveless tops or shorts) as it is an active place of worship. Free or minimal admission. Located in Toledo City proper, accessible from the city center. Photography may be restricted for certain artifacts — follow guide instructions. Approximately 2.5 to 3 hours from Cebu City. Best combined with visits to Puting Bato, Malubog Lake, and other Toledo City sites for a comprehensive heritage and nature day tour."
      },
      culturalPractices: [
        'Catholic heritage and devotional visits',
        'Heritage museum education',
        'Cultural artifact preservation',
        'Historical documentation of Toledo City'
      ],
      nativeFloraFauna: [
        'Chapel courtyard and garden plants',
        'Heritage structure surrounding vegetation',
        'Ornamental religious garden flora',
        'Urban birds'
      ],
      preservation: 'Maintained by Toledo City parish and heritage conservation volunteers with support from National Historical Commission of the Philippines',
      highlights: ['Spanish Colonial Chapel', 'Religious Heritage Museum', 'Toledo City History Collection']
    },
    { 
      id: 69, 
      name: 'Puting Bato', 
      location: 'Toledo City, Cebu', 
      category: 'Natural Heritage',
      lat: 10.3467,
      lng: 123.5783,
      image: 'src/image/Puting-Bato.webp', 
      rating: 4.7,
      reviews: 1345,
      era: 'Natural/Geological formation',
      heritageStatus: 'Natural Geological Landmark',
      description: "A striking white monolith and natural geological landmark rising dramatically from the landscape of Lutopan (Don Andres Soriano) in Toledo City — a sacred and culturally significant rock formation with deep historical and community roots.",
      established: 'Natural formation — revered since the Spanish colonial era',
      builtBy: 'Natural limestone geological processes',
      detailedInfo: {
        overview: "Puting Bato, meaning 'White Rock' in Cebuano, refers to both a barangay and a remarkable natural monolith located in Lutopan (also known as Don Andres Soriano) in Toledo City, western Cebu. The white limestone rock formation rises dramatically and conspicuously from the surrounding landscape, creating a striking natural landmark that has been a point of reverence and cultural significance for the local community for generations. The monolith's distinctive pale color and dramatic form make it one of Toledo City's most recognizable natural features.",
        culturalSignificance: "Puting Bato holds deep cultural, historical, and spiritual significance for the people of Toledo City and the surrounding Lutopan community. The white rock has long been regarded as a sacred landmark, associated with local legends, folk beliefs, and community identity. During the Spanish colonial period, the monolith served as a navigational reference point for seafarers crossing the Tañon Strait. The rock gives its name to the surrounding barangay, underscoring how deeply the formation is woven into local identity and place-naming traditions. It remains a source of community pride and a symbol of Toledo City's unique natural heritage.",
        biodiversity: "The limestone monolith and its immediate surroundings support vegetation adapted to rocky, calcium-rich terrain. Native shrubs, grasses, and pioneer plants colonize the rock surfaces and base. The surrounding landscape of Lutopan features a mix of vegetation communities. The rocky formation provides microhabitat for lizards, insects, and birds. The broader Tañon Strait coastal environment in the vicinity supports diverse coastal and marine ecosystems.",
        currentStatus: "Natural landmark accessible to visitors and recognized as an important heritage and tourism site of Toledo City. The surrounding barangay of Puting Bato bears the landmark's name. Growing recognition as a Toledo City tourism attraction. The site is of ongoing cultural and spiritual significance to the local community. Best visited as part of a comprehensive Toledo City heritage and nature tour.",
        visitorInfo: "Accessible to visitors — coordinate access with barangay Puting Bato officials or Toledo City Tourism Office. Located in Lutopan (Don Andres Soriano) in Toledo City, approximately 2.5 to 3 hours from Cebu City via the western route. Wear comfortable walking shoes. Respectful behavior required given the site's cultural and spiritual significance to the local community. Best combined with the Capilla Santa Ana Museum, Malubog Lake, Biga Pit, and other Toledo City attractions for a full western Cebu day or weekend tour."
      },
      culturalPractices: [
        'Local heritage and sacred site veneration',
        'Community identity and place-name traditions',
        'Folk legend and oral history traditions',
        'Heritage tourism and geological appreciation'
      ],
      nativeFloraFauna: [
        'Limestone-adapted native plants',
        'Rocky terrain shrubs and grasses',
        'Lizards and rock-dwelling fauna',
        'Native birds',
        'Pioneer vegetation on rock surfaces'
      ],
      preservation: 'Under the stewardship of Barangay Puting Bato and Toledo City Government',
      highlights: ['Iconic White Limestone Monolith', 'Sacred Community Landmark', 'Lutopan Heritage Site']
    },

];

// ── Custom Marker Icon ──────────────────────────────────────────────────────
const createCustomIcon = (category, isAdmin = false) => {
  const colors = {
    'Historical Heritage': '#3b82f6',
    'Cultural Heritage':   '#f59e0b',
    'Natural Heritage':    '#22c55e',
  };
  const color = colors[category] || '#3b82f6';
  const size  = 44;

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          position:absolute;bottom:0;left:50%;
          transform:translateX(-50%) rotate(-45deg);
          width:${size}px;height:${size}px;
          background:${color};
          border-radius:50% 50% 50% 0;
          border:${isAdmin ? '4px solid #fbbf24' : '4px solid white'};
          box-shadow:0 6px 16px rgba(0,0,0,0.5);
          animation:bounce 0.6s ease-out;
        ">
          <div style="
            position:absolute;top:50%;left:50%;
            transform:translate(-50%,-50%) rotate(45deg);
            width:${size * 0.35}px;height:${size * 0.35}px;
            background:${isAdmin ? '#fbbf24' : 'white'};
            border-radius:50%;
            box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        </div>
        <div style="
          position:absolute;bottom:0;left:50%;
          transform:translateX(-50%);
          width:${size + 20}px;height:${size + 20}px;
          border:3px solid ${color};
          border-radius:50%;
          animation:pulse-ring 2s infinite;
          opacity:0.6;
        "></div>
        <div style="
          position:absolute;bottom:-5px;left:50%;
          transform:translateX(-50%);
          width:${size * 0.6}px;height:8px;
          background:rgba(0,0,0,0.3);
          border-radius:50%;
          filter:blur(4px);
        "></div>
        ${isAdmin ? `<div style="
          position:absolute;top:-8px;right:-8px;
          width:20px;height:20px;
          background:#fbbf24;border-radius:50%;
          border:2px solid white;
          display:flex;align-items:center;justify-content:center;
          font-size:10px;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          z-index:10;
        ">★</div>` : ''}
      </div>
    `,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// ── Fly-To helper ───────────────────────────────────────────────────────────
function FlyToLocation({ lat, lng, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [lat, lng, zoom, map]);
  return null;
}

// ── Map click handler ───────────────────────────────────────────────────────
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onMapClick);
    return () => { map.off('click', onMapClick); };
  }, [map, onMapClick]);
  return null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function NewBadge() {
  return (
    <span style={{
      background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
      color: '#78350f', fontSize: '0.6rem', fontWeight: '800',
      padding: '2px 6px', borderRadius: '6px', letterSpacing: '0.5px',
      textTransform: 'uppercase', verticalAlign: 'middle', marginLeft: '4px',
    }}>NEW</span>
  );
}

function TransportationSection({ info }) {
  if (!info) return null;
  const lines = info.split('\n').filter(l => l.trim());
  return (
    <div style={{ marginBottom: '16px' }}>
      <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0c4a6e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Bus size={15} style={{ color: '#d97706' }} /> Transportation &amp; Getting There
      </h5>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
        {lines.map((line, i) => {
          const parts = line.split(':');
          const hasLabel = parts.length >= 2;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: i < lines.length - 1 ? '8px' : 0 }}>
              <span style={{ fontSize: '0.78rem', color: '#d97706', marginTop: '1px', flexShrink: 0 }}>🚌</span>
              <div style={{ fontSize: '0.82rem', color: '#374151', lineHeight: '1.4' }}>
                {hasLabel ? (
                  <><span style={{ fontWeight: '600', color: '#92400e' }}>{parts[0]}:</span><span style={{ color: '#4b5563' }}>{parts.slice(1).join(':')}</span></>
                ) : <span>{line}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Normalize a raw Firestore doc into a full site object ───────────────────
function normalizeFirestoreSite(id, data) {
  return {
    id:             `admin_${id}`,
    firestoreId:    id,
    source:         'admin',
    name:           data.name            || 'Unnamed Site',
    location:       data.location         || '',
    lat:            parseFloat(data.lat)  || 0,
    lng:            parseFloat(data.lng)  || 0,
    image:          data.imageUrl         || data.image || '',
    description:    data.description      || '',
    category:       data.category         || 'Cultural Heritage',
    heritageStatus: data.heritageStatus   || '',
    era:            data.era              || '',
    region:         data.region           || 'Central Visayas',
    established:    data.established      || '',
    builtBy:        data.builtBy          || '',
    detailedInfo: {
      overview:             data.detailedInfo?.overview             || data.description || '',
      culturalSignificance: data.detailedInfo?.culturalSignificance || '',
      architecture:         data.detailedInfo?.architectureOrBio    || '',
      biodiversity:         data.detailedInfo?.architectureOrBio    || '',
      currentStatus:        data.detailedInfo?.currentStatus        || '',
      visitorInfo:          data.detailedInfo?.visitorInfo          || '',
      transportationFee:    data.detailedInfo?.transportationFee    || '',
    },
    culturalPractices: Array.isArray(data.culturalPractices) ? data.culturalPractices : [],
    nativeFloraFauna:  Array.isArray(data.nativeFloraFauna)  ? data.nativeFloraFauna  : [],
    preservation:      data.preservation  || '',
    highlights:        Array.isArray(data.highlights)         ? data.highlights        : [],
    createdAt:         data.createdAt,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
export default function EnhancedExploreMap() {
  const [selected,          setSelected]          = useState(null);
  const [searchQuery,       setSearchQuery]        = useState('');
  const [selectedCategory,  setSelectedCategory]  = useState('all');
  const [autoZoom,          setAutoZoom]           = useState(false);
  const [showDetailedInfo,  setShowDetailedInfo]   = useState(false);
  const [adminSites,        setAdminSites]         = useState([]);
  const [loadingAdmin,      setLoadingAdmin]       = useState(true);

  // ── Real-time Firestore listener for admin-added sites ──────────────────
  useEffect(() => {
    // Try to order by createdAt; fall back to unordered if index missing
    const col = collection(db, 'heritage');
    let q;
    try { q = query(col, orderBy('createdAt', 'desc')); } catch { q = col; }

    const unsub = onSnapshot(q,
      (snap) => {
        const sites = snap.docs
          .map(d => {
            const data = d.data();
            if (data.lat == null || data.lng == null) return null;
            return normalizeFirestoreSite(d.id, data);
          })
          .filter(Boolean);
        setAdminSites(sites);
        setLoadingAdmin(false);
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        setLoadingAdmin(false);
      }
    );
    return () => unsub();
  }, []);

  // ── Fix Leaflet icons + read incoming selectedDestination ───────────────
  // ★ KEY FIX: use the saved destination object DIRECTLY — no lookup in cebuSites.
  //   This makes it work for BOTH hardcoded AND admin-added Firestore sites.
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const raw = localStorage.getItem('selectedDestination');
    if (!raw) return;
    localStorage.removeItem('selectedDestination');

    try {
      const dest = JSON.parse(raw);

      // ── Try to find the full object in cebuSites first (preserves all rich data)
      const hardcoded = cebuSites.find(
        s => s.id === dest.id || s.name.toLowerCase() === dest.name?.toLowerCase()
      );
      if (hardcoded) {
        handleSiteClick(hardcoded);
        return;
      }

      // ── Admin-added site: build a normalized object from the saved data
      const lat = parseFloat(dest.lat);
      const lng = parseFloat(dest.lng);
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const normalized = {
        // preserve everything saved by Destinations page
        ...dest,
        lat,
        lng,
        // normalise image field (Destinations saves 'image', admin saves 'imageUrl')
        image: dest.image || dest.imageUrl || '',
        source: dest.source || 'admin',
        detailedInfo: {
          overview:             dest.detailedInfo?.overview             || dest.description || '',
          culturalSignificance: dest.detailedInfo?.culturalSignificance || '',
          architecture:         dest.detailedInfo?.architecture         || dest.detailedInfo?.architectureOrBio || '',
          biodiversity:         dest.detailedInfo?.biodiversity         || dest.detailedInfo?.architectureOrBio || '',
          currentStatus:        dest.detailedInfo?.currentStatus        || '',
          visitorInfo:          dest.detailedInfo?.visitorInfo          || '',
          transportationFee:    dest.detailedInfo?.transportationFee    || '',
        },
        culturalPractices: dest.culturalPractices || [],
        nativeFloraFauna:  dest.nativeFloraFauna  || [],
        highlights:        dest.highlights        || [],
        preservation:      dest.preservation      || '',
      };

      handleSiteClick(normalized);
    } catch (err) {
      console.error('Error reading selectedDestination from localStorage:', err);
    }
  }, []);

  const allSites     = [...cebuSites, ...adminSites];
  const categories   = ['All', 'Cultural Heritage', 'Historical Heritage', 'Natural Heritage'];

  const filteredSites = allSites.filter(site => {
    const matchSearch   = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (site.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || site.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSiteClick = (site) => {
    setSelected(site);
    setAutoZoom(true);
    setShowDetailedInfo(false);
  };

  const handleMapClick = () => {
    if (selected && !showDetailedInfo) {
      setSelected(null);
      setAutoZoom(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Cultural Heritage':   { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      'Historical Heritage': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      'Natural Heritage':    { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
    };
    return colors[category] || colors['Cultural Heritage'];
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>

      {/* ═══════════ LEFT SIDEBAR ═══════════ */}
      <div style={{ width: '400px', background: 'linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)', overflowY: 'auto', boxShadow: '4px 0 30px rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '25px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)' }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59,130,246,0.4)' }}>
              <Globe size={28} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0, letterSpacing: '2px', background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SUGBOSPHERE</h2>
              <p style={{ fontSize: '0.7rem', letterSpacing: '1.5px', color: '#60a5fa', margin: 0 }}>CEBU HERITAGE EXPLORER</p>
            </div>
          </div>

          {/* Search */}
          <div className="position-relative mb-3">
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#60a5fa', zIndex: 1 }} />
            <input
              type="text" className="form-control" placeholder="Search destinations..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 15px 12px 45px', borderRadius: '12px', fontSize: '0.9rem' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)} style={{
                background: selectedCategory === (cat === 'All' ? 'all' : cat) ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)',
                border:     selectedCategory === (cat === 'All' ? 'all' : cat) ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease'
              }}>{cat}</button>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)' }}>
              <p style={{ fontSize: '0.82rem', color: '#86efac', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={14} /> {filteredSites.length} destination{filteredSites.length !== 1 ? 's' : ''}
              </p>
            </div>
            {adminSites.length > 0 && (
              <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(251,191,36,0.12)', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.3)' }}>
                <p style={{ fontSize: '0.82rem', color: '#fcd34d', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ★ {adminSites.length} new site{adminSites.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sites Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', alignContent: 'start' }}>
          {loadingAdmin && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
              Loading new sites...
            </div>
          )}

          {filteredSites.map(site => {
            const colors     = getCategoryColor(site.category);
            const isSelected = selected?.id === site.id || selected?.name === site.name;            const isAdmin    = site.source === 'admin';

            return (
              <div key={site.id} onClick={() => handleSiteClick(site)} style={{
                cursor: 'pointer', borderRadius: '16px', height: '250px', position: 'relative', overflow: 'hidden',
                background: isSelected ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))' : isAdmin ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.06)',
                border:     isSelected ? '2px solid rgba(59,130,246,0.6)' : isAdmin ? '1.5px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                boxShadow:  isSelected ? '0 12px 28px rgba(59,130,246,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <div style={{ height: '160px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))', zIndex: 1 }} />
                  {site.image ? (
                    <img src={site.image} alt={site.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={32} color="rgba(255,255,255,0.3)" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700', background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, zIndex: 2 }}>
                    {site.category.split(' ')[0]}
                  </div>
                  {isAdmin && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#78350f', fontSize: '0.62rem', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', zIndex: 2, letterSpacing: '0.5px' }}>
                      ★ NEW
                    </div>
                  )}
                  {isSelected && (
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59,130,246,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                      <Navigation size={14} color="white" />
                    </div>
                  )}
                </div>
                <div style={{ height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
                  <h6 style={{ color: 'white', margin: 0, fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {site.name}
                  </h6>
                  <p style={{ color: '#93c5fd', margin: 0, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {site.location.split(',')[0]}
                  </p>
                </div>
              </div>
            );
          })}

          {filteredSites.length === 0 && !loadingAdmin && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
              <Search size={28} style={{ marginBottom: '10px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>No destinations match your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ MAP ═══════════ */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[10.3157, 123.8854]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          maxBounds={[[9.0, 122.8], [11.8, 124.5]]}
          minZoom={8}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* ★ Render marker for selected site using its actual lat/lng ★ */}
          {selected && !isNaN(selected.lat) && !isNaN(selected.lng) && (
            <Marker
              key={selected.id || selected.name}
              position={[selected.lat, selected.lng]}
              icon={createCustomIcon(selected.category, selected.source === 'admin')}
              eventHandlers={{ click: e => e.originalEvent.stopPropagation() }}
            >
              <Popup>
                <div style={{ minWidth: '260px', padding: '8px' }}>
                  <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '2px solid #e5e7eb' }}>
                    <strong style={{ color: '#0c4a6e', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
                      {selected.name}
                      {selected.source === 'admin' && <NewBadge />}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <MapPin size={14} /> {selected.location}
                    </div>
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', ...getCategoryColor(selected.category) }}>
                      {selected.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    {selected.description}
                  </p>
                  <button
                    onClick={() => setShowDetailedInfo(true)}
                    style={{ width: '100%', padding: '8px 12px', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Info size={14} /> View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {selected && autoZoom && !isNaN(selected.lat) && !isNaN(selected.lng) && (
            <FlyToLocation lat={selected.lat} lng={selected.lng} zoom={15} />
          )}
        </MapContainer>

        {/* Location Banner */}
        {selected && autoZoom && (
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000, animation: 'slideDown 0.5s ease', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e5e7eb' }}>
            <Navigation size={18} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '0.95rem', color: '#0c4a6e', fontWeight: '600' }}>
              {selected.name}
              {selected.source === 'admin' && <NewBadge />}
            </span>
            <button onClick={() => { setSelected(null); setAutoZoom(false); }} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer', marginLeft: '8px' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Quick Info Panel */}
        {selected && !showDetailedInfo && (
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', maxWidth: '550px', background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '2px solid #e5e7eb', animation: 'slideUp 0.4s ease', zIndex: 1000 }}>
            <div className="row g-3">
              <div className="col-5">
                {selected.image ? (
                  <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '180px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={40} color="rgba(255,255,255,0.4)" />
                  </div>
                )}
              </div>
              <div className="col-7">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <MapPin size={16} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{selected.location}</span>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: '#0c4a6e' }}>
                      {selected.name}
                      {selected.source === 'admin' && <NewBadge />}
                    </h5>
                    {selected.source === 'admin' && (
                      <span style={{ fontSize: '0.72rem', color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '6px' }}>
                        ★ Recently added by admin
                      </span>
                    )}
                  </div>
                  <button onClick={() => { setSelected(null); setAutoZoom(false); }} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={16} />
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: '1.5', marginBottom: '15px' }}>
                  {selected.description}
                </p>
                <button
                  onClick={() => setShowDetailedInfo(true)}
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}
                >
                  <Info size={16} /> View Full Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Detailed Info Panel ═══ */}
        {selected && showDetailedInfo && (
          <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', border: '2px solid #e5e7eb', animation: 'slideUp 0.4s ease', zIndex: 1001, overflowY: 'auto' }}>

            {/* Title row */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <button
                  onClick={() => setShowDetailedInfo(false)}
                  className="btn btn-sm d-flex align-items-center gap-2 mb-3"
                  style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#4b5563', borderRadius: '8px', padding: '6px 12px' }}
                >
                  ← Back to Summary
                </button>
                <h2 className="fw-bold mb-1" style={{ color: '#0c4a6e' }}>
                  {selected.name}
                  {selected.source === 'admin' && <NewBadge />}
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{selected.location}</span>
                </div>
              </div>
              <button
                onClick={() => { setSelected(null); setShowDetailedInfo(false); setAutoZoom(false); }}
                style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="row g-4">
              {/* Left — Main Content */}
              <div className="col-md-8">
                {[
                  { title: 'Overview',              content: selected.detailedInfo?.overview || selected.description },
                  { title: 'Cultural Significance', content: selected.detailedInfo?.culturalSignificance },
                  {
                    title: selected.category === 'Natural Heritage' ? 'Natural Features & Biodiversity' : 'Architecture',
                    content: selected.detailedInfo?.architecture || selected.detailedInfo?.biodiversity,
                  },
                  { title: 'Current Status', content: selected.detailedInfo?.currentStatus },
                ].filter(s => s.content).map(s => (
                  <div key={s.title} className="mb-4">
                    <h4 className="h5 fw-bold mb-3" style={{ color: '#0c4a6e', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>{s.title}</h4>
                    <p style={{ lineHeight: '1.7', color: '#4b5563' }}>{s.content}</p>
                  </div>
                ))}

                {/* Transportation */}
                {selected.detailedInfo?.transportationFee && (
                  <TransportationSection info={selected.detailedInfo.transportationFee} />
                )}
              </div>

              {/* Right — Quick Info */}
              <div className="col-md-4">
                {selected.image ? (
                  <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '200px', borderRadius: '12px', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                ) : (
                  <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: 'linear-gradient(135deg,#1e3a5f,#2c5282)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <MapPin size={48} color="rgba(255,255,255,0.4)" />
                  </div>
                )}

                {/* Quick Facts */}
                <div className="mb-4">
                  <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                    <Info size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Quick Facts
                  </h5>
                  {[
                    { label: 'Category',        value: selected.category },
                    { label: 'Heritage Status', value: selected.heritageStatus },
                    { label: 'Historical Era',  value: selected.era },
                    { label: 'Region',          value: selected.region },
                    { label: 'Established',     value: selected.established },
                    { label: 'Built By',        value: selected.builtBy },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} className="mb-2">
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>{f.label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{f.value}</div>
                    </div>
                  ))}
                </div>

                {/* Visitor Info */}
                {selected.detailedInfo?.visitorInfo && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Home size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Visitor Information
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>{selected.detailedInfo.visitorInfo}</p>
                  </div>
                )}

                {/* Highlights */}
                {selected.highlights && selected.highlights.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>⭐ Highlights</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.highlights.map((h, i) => (
                        <span key={i} style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: '500' }}>{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cultural Practices */}
                {selected.culturalPractices && selected.culturalPractices.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Cultural Practices
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.culturalPractices.map((p, i) => (
                        <span key={i} style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: '500' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Native Flora & Fauna */}
                {selected.nativeFloraFauna && selected.nativeFloraFauna.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Flag size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Native Species
                    </h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.nativeFloraFauna.map((s, i) => (
                        <span key={i} style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: '500' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preservation */}
                {selected.preservation && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Award size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Preservation
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>{selected.preservation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.7;transform:scale(1.1);} }
        @keyframes pulse-ring { 0%{transform:translateX(-50%) scale(0.8);opacity:0.8;}100%{transform:translateX(-50%) scale(1.3);opacity:0;} }
        @keyframes bounce { 0%{transform:translateX(-50%) rotate(-45deg) translateY(-100px);opacity:0;}60%{transform:translateX(-50%) rotate(-45deg) translateY(10px);opacity:1;}80%{transform:translateX(-50%) rotate(-45deg) translateY(-5px);}100%{transform:translateX(-50%) rotate(-45deg) translateY(0);} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);} }
        @keyframes slideDown { from{opacity:0;transform:translate(-50%,-20px);}to{opacity:1;transform:translate(-50%,0);} }
        div::-webkit-scrollbar{width:8px;}
        div::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:4px;}
        div::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px;}
        .form-control::placeholder{color:rgba(255,255,255,0.5);}
        .form-control:focus{background:rgba(255,255,255,0.15)!important;border-color:rgba(59,130,246,0.5)!important;box-shadow:0 0 0 3px rgba(59,130,246,0.1)!important;outline:none;color:white!important;}
        .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.15);}
        .leaflet-popup-tip{display:none;}
        .custom-marker-icon{background:transparent!important;border:none!important;}
      `}</style>
    </div>
  );
}