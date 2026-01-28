import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, X, Info, Calendar, Users, Flag, Award, Globe, Home } from 'lucide-react';

// Combine ALL Cebu Heritage Sites & Destinations (1-30)
const cebuSites = [
  {
    id: 1,
    name: 'Magellan\'s Cross',
    location: 'Cebu City, Cebu',
    lat: 10.2935,
    lng: 123.9018,
    image: 'src/image/magellans-cross.jpg',
    description: 'Historic cross planted by Ferdinand Magellan upon arriving in Cebu in 1521.',
    category: 'Historical Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (1521)',
    region: 'Central Visayas',
    established: 'March 15, 1521',
    builtBy: 'Ferdinand Magellan and Spanish explorers',
    
    detailedInfo: {
      overview: 'Magellan\'s Cross is a Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan upon arriving in Cebu in the Philippines on March 15, 1521. The cross is housed in a chapel next to the Basilica del Santo Niño on Magallanes Street. The original wooden cross is encased in tindalo wood to protect it from pilgrims who take fragments of it as relics.',
      culturalSignificance: 'Marks the birth of Roman Catholicism in the Philippines and represents the beginning of Spanish colonization. The site is considered sacred and is a major pilgrimage destination for Filipino Catholics.',
      architecture: 'The cross is housed in a small octagonal chapel with a painted ceiling depicting the historic planting of the cross. The wooden encasement was added in 1834 to protect the original cross.',
      currentStatus: 'Active pilgrimage site visited by thousands daily. Well-preserved with ongoing maintenance by the Augustinian Order.',
      visitorInfo: 'Open daily from 6:00 AM to 8:00 PM. Free admission. Located in the heart of downtown Cebu City, walking distance from other historical sites.'
    },
    
    culturalPractices: [
      'Candle lighting rituals',
      'Prayer offerings',
      'Religious pilgrimages',
      'Sinulog Festival connection'
    ],
    
    nativeFloraFauna: [
      'Urban plaza trees',
      'Ornamental plants',
      'City birds',
      'Heritage garden species'
    ],
    
    preservation: 'Managed by the Augustinian Province of Santo Niño de Cebu'
  },
  {
    id: 2,
    name: 'Fort San Pedro',
    location: 'Cebu City, Cebu',
    lat: 10.2929,
    lng: 123.9067,
    image: 'src/image/fort-san-pedro.jpg',
    description: 'The oldest and smallest triangular bastion fort in the Philippines, built in 1565.',
    category: 'Historical Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (1565)',
    region: 'Central Visayas',
    established: '1565 (rebuilt 1738)',
    builtBy: 'Spanish conquistadors under Miguel López de Legazpi',
    
    detailedInfo: {
      overview: 'Fort San Pedro is a military defense structure built by Spanish conquistador Miguel López de Legazpi. It is the oldest triangular bastion fort in the country and served as the nucleus of the first Spanish settlement in the Philippines. The fort has been a witness to the Spanish, American, and Japanese periods.',
      culturalSignificance: 'Represents the military might of Spanish colonial rule and served as a defense against Muslim raiders. During the American period, it was used as a military barracks, and during WWII, the Japanese used it as a prisoner-of-war camp.',
      architecture: 'Triangular bastion fort made of coral stones with three bastions named La Concepcion, Ignacio de Loyola, and San Miguel. The walls are 20 feet high and 8 feet thick. Features include the Corpo de Guardia (Guard House), Vivienda del Teniente (Lieutenant\'s Quarters), and various artillery pieces.',
      currentStatus: 'Now a historical park and museum housing artifacts from Spanish and American colonial periods. Popular venue for cultural events.',
      visitorInfo: 'Open daily 7:00 AM to 7:00 PM. Entrance fee: ₱30 for adults. Guided tours available. Evening cultural shows on weekends.'
    },
    
    culturalPractices: [
      'Historical reenactments',
      'Cultural performances',
      'Educational tours',
      'Heritage photography'
    ],
    
    nativeFloraFauna: [
      'Heritage trees within fortification',
      'Flowering shrubs',
      'Fort garden plants',
      'Urban wildlife'
    ],
    
    preservation: 'Managed by Cebu City Government and National Historical Commission'
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
      overview: 'The Basilica Minore del Santo Niño de Cebu is the oldest Roman Catholic church in the Philippines. It houses the revered image of the Santo Niño (Child Jesus) given by Magellan to Queen Juana of Cebu in 1521. The current structure was built in 1739 after fires destroyed previous wooden churches.',
      culturalSignificance: 'Center of Catholic devotion in Cebu and the entire Philippines. The Santo Niño image is considered miraculous and is the focus of the annual Sinulog Festival, one of the country\'s grandest religious and cultural celebrations.',
      architecture: 'Baroque architecture with thick walls and buttresses to withstand earthquakes. Features include ornate altars, religious paintings, a historical museum, and a beautiful courtyard. The church can accommodate thousands of devotees.',
      currentStatus: 'Active place of worship with daily masses. Major pilgrimage destination attracting millions annually, especially during Sinulog Festival every third Sunday of January.',
      visitorInfo: 'Open daily 5:00 AM to 8:00 PM. Free admission but donations welcome. Dress modestly. Museum open 8:00 AM to 5:00 PM. Best to visit early morning or late afternoon to avoid crowds.'
    },
    
    culturalPractices: [
      'Sinulog Festival (January)',
      'Novena masses',
      'Candle offerings',
      'Traditional Catholic rituals',
      'Religious processions'
    ],
    
    nativeFloraFauna: [
      'Basilica courtyard plants',
      'Heritage trees',
      'Religious garden flora',
      'Urban bird species'
    ],
    
    preservation: 'Managed by the Augustinian Province of Santo Niño de Cebu and National Museum'
  },
  {
    id: 4,
    name: 'Casa Gorordo Museum',
    location: 'Parian, Cebu City',
    lat: 10.2956,
    lng: 123.9008,
    image: 'src/image/casa-gorordo.jpg',
    description: 'A 19th-century house museum showcasing Filipino lifestyle during Spanish era.',
    category: 'Cultural Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (mid-1800s)',
    region: 'Central Visayas',
    established: 'Mid-19th century',
    builtBy: 'Alejandro Reynes y Rosales (original owner)',
    
    detailedInfo: {
      overview: 'Casa Gorordo Museum is a heritage house that showcases the lifestyle of a prominent Filipino family during the Spanish colonial period. The house was the residence of Cebu\'s first Filipino bishop, Juan Gorordo, and four generations of the Gorordo family. It is a classic example of a 19th-century Filipino bahay na bato (stone house).',
      culturalSignificance: 'Represents the affluent Filipino lifestyle during Spanish times. The house reflects the blend of European and local architectural styles and customs. It provides insights into 19th-century Filipino domestic life, social customs, and material culture.',
      architecture: 'Two-story coral stone and hardwood structure featuring azoteas (open galleries), capiz shell windows, wooden shutters, period furniture, religious artifacts, and kitchen utensils. The ground floor is made of coral stones while the upper floor is constructed of wood, a typical bahay na bato design.',
      currentStatus: 'Fully restored museum operated by the Ramon Aboitiz Foundation Inc. Houses extensive collection of period furniture, photographs, and household items.',
      visitorInfo: 'Open Tuesday to Sunday, 9:00 AM to 5:00 PM. Entrance fee: ₱75. Guided tours included. Photography allowed. Air-conditioned. Gift shop available.'
    },
    
    culturalPractices: [
      'Heritage conservation',
      'Historical research',
      'Cultural education programs',
      'Traditional Filipino customs display'
    ],
    
    nativeFloraFauna: [
      'Traditional garden plants',
      'Heritage trees',
      'Indoor ornamental plants',
      'Period garden design'
    ],
    
    preservation: 'Managed and restored by Ramon Aboitiz Foundation Inc. (RAFI)'
  },
  {
    id: 5,
    name: 'Yap-Sandiego Ancestral House',
    location: 'Parian, Cebu City',
    lat: 10.2961,
    lng: 123.9001,
    image: 'src/image/yap-sandiego.jpg',
    description: 'One of the oldest Chinese-Filipino houses in the Philippines, built in the late 1600s.',
    category: 'Cultural Heritage',
    heritageStatus: 'National Historical Landmark',
    era: 'Spanish Colonial (late 1600s)',
    region: 'Central Visayas',
    established: 'Late 17th century',
    builtBy: 'Chinese merchant Don Juan Yap and his wife Doña Maria Florido',
    
    detailedInfo: {
      overview: 'The Yap-Sandiego Ancestral House is one of the oldest residential houses in the Philippines and the oldest documented Chinese house outside of China. Built in the late 1600s, it showcases the integration of Chinese and Filipino architectural styles. The house has been continuously occupied and is still owned by descendants of the original builders.',
      culturalSignificance: 'Represents the historical Chinese-Filipino (Chinoy) community in Cebu and their significant contribution to Philippine culture and commerce. The Parian district where it stands was the designated Chinese enclave during Spanish times.',
      architecture: 'Made entirely of coral stones and molave hardwood, featuring thick walls (about 2 feet), ventanillas (small windows), wooden floorboards, Chinese roof tiles, and antique furniture. The ground floor has thick walls for security and commerce, while upper floors were for living quarters. Features include a kitchen, dining area, bedrooms, and a chapel.',
      currentStatus: 'Private residence and museum operated by the Sandiego-Ramon family. Houses one of the finest private collections of antique furniture and religious artifacts in Cebu.',
      visitorInfo: 'Open daily 9:00 AM to 6:00 PM. Entrance fee: ₱50. Guided tours by family members available. Small but rich in artifacts. Combine visit with Casa Gorordo nearby.'
    },
    
    culturalPractices: [
      'Chinese-Filipino heritage preservation',
      'Traditional family customs',
      'Antique collection curation',
      'Cultural tours and education'
    ],
    
    nativeFloraFauna: [
      'Traditional courtyard plants',
      'Heritage potted plants',
      'Antique garden design',
      'Indoor ornamental species'
    ],
    
    preservation: 'Privately maintained by Sandiego-Ramon family with support from cultural organizations'
  },
  {
    id: 6,
    name: 'Osmeña Peak',
    location: 'Dalaguete, Cebu',
    lat: 9.8667,
    lng: 123.4667,
    image: 'src/image/osmena-peak.jpg',
    description: 'The highest peak in Cebu at 1,015 meters, offering panoramic views of jagged hills.',
    category: 'Natural Heritage',
    heritageStatus: 'Natural Landmark',
    era: 'Geological formation',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural geological processes',
    
    detailedInfo: {
      overview: 'Osmeña Peak is the highest point in Cebu Island at 1,015 meters (3,330 feet) above sea level. Located in the Mantalongon mountain range in Dalaguete, it offers spectacular 360-degree views of jagged, verdant hills reminiscent of the Chocolate Hills in Bohol. On clear days, visitors can see neighboring islands including Negros and Bohol.',
      culturalSignificance: 'Named after Sergio Osmeña Sr., the second President of the Philippines who hailed from Cebu. Popular trekking and camping destination for locals and tourists. Important for environmental awareness and eco-tourism.',
      biodiversity: 'Cool highland climate supporting unique vegetation. Area is rich in pine trees, wildflowers, and grasslands. Bird watching opportunities. Part of the Mantalongon mountain range ecosystem.',
      currentStatus: 'Popular hiking and camping destination. Basic facilities available. Environmental conservation efforts ongoing to prevent degradation from over-tourism.',
      visitorInfo: 'Open 24/7. Entrance fee: ₱30. Easy 20-minute hike from parking area. Best visited early morning for sunrise or late afternoon. Camping allowed (bring own equipment). Dress warmly as temperature can drop at night. 3-4 hours drive from Cebu City.'
    },
    
    culturalPractices: [
      'Eco-tourism',
      'Hiking and camping culture',
      'Photography tourism',
      'Environmental awareness programs'
    ],
    
    nativeFloraFauna: [
      'Pine trees',
      'Highland grasses',
      'Wildflowers',
      'Mountain birds',
      'Native shrubs'
    ],
    
    preservation: 'Managed by Dalaguete Municipal Government with local community involvement'
  },
  {
    id: 7,
    name: 'Kawasan Falls',
    location: 'Badian, Cebu',
    lat: 9.8089,
    lng: 123.3747,
    image: 'src/image/kawasan-falls.webp',
    description: 'A three-tiered waterfall system with turquoise blue waters, popular for canyoneering.',
    category: 'Natural Heritage',
    heritageStatus: 'Protected Natural Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural hydrological processes',
    
    detailedInfo: {
      overview: 'Kawasan Falls is a three-stage cascade of clear turquoise water located in the mountainous interior of Badian. The main waterfall drops about 40 meters into a natural pool perfect for swimming. The falls are fed by the Matutinao River and flow year-round. The area has become famous for canyoneering adventures where participants jump off cliffs, swim through canyons, and rappel down waterfalls.',
      culturalSignificance: 'One of Cebu\'s most iconic natural attractions, drawing thousands of local and international visitors. Has become a symbol of Cebu\'s natural beauty and adventure tourism. Important source of livelihood for Badian residents through tourism.',
      biodiversity: 'Lush tropical forest surrounds the falls with diverse plant and animal life. The river ecosystem supports various freshwater species. Bamboo groves, ferns, and native trees thrive in the area. Wildlife includes birds, butterflies, and small mammals.',
      currentStatus: 'Major tourist destination with developed facilities including bamboo cottages, changing rooms, and food stalls. Ongoing efforts to balance tourism with environmental conservation.',
      visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱40. 15-20 minute walk from entrance to first falls. Life jackets available for rent (₱50). Bamboo rafts available. Canyoneering packages start at ₱1,500. Best visited on weekdays to avoid crowds. 3 hours from Cebu City.'
    },
    
    culturalPractices: [
      'Adventure tourism',
      'Canyoneering culture',
      'Community-based tourism',
      'Environmental conservation efforts'
    ],
    
    nativeFloraFauna: [
      'Tropical forest trees',
      'Bamboo groves',
      'Ferns and mosses',
      'Freshwater fish',
      'Forest birds and butterflies'
    ],
    
    preservation: 'Managed by Badian Municipal Government and local barangay with private operators'
  },
  {
    id: 8,
    name: 'Tumalog Falls',
    location: 'Oslob, Cebu',
    lat: 9.5336,
    lng: 123.3733,
    image: 'src/image/tumalog-falls.jpg',
    description: 'A mystical curtain-like waterfall with mist-shrouded pools, known for its ethereal beauty.',
    category: 'Natural Heritage',
    heritageStatus: 'Natural Landmark',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural formation',
    builtBy: 'Natural geological formation',
    
    detailedInfo: {
      overview: 'Tumalog Falls, also known as Toslob Falls, is a unique curtain-type waterfall located in the mountains of Oslob. Unlike typical plunge waterfalls, the water cascades down like a curtain from the cliff face, creating a misty, ethereal atmosphere. The falls stand approximately 95 feet high and create a shallow wading pool at the base surrounded by lush vegetation.',
      culturalSignificance: 'Considered one of the most photographed waterfalls in Cebu due to its unique appearance and mystical atmosphere. Popular for pre-wedding photo shoots and nature photography. Represents Cebu\'s hidden natural gems.',
      biodiversity: 'Surrounded by dense tropical vegetation including ferns, vines, and native trees. The constant mist creates a microclimate supporting unique plant species. Area is home to various birds and insects adapted to the humid environment.',
      currentStatus: 'Increasingly popular tourist destination, especially combined with Oslob whale shark watching. Facilities are basic to maintain natural ambiance. Local community manages the site.',
      visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱20. Habal-habal (motorcycle) ride from main road: ₱50-100 roundtrip. Easy 10-minute walk from drop-off point. Wading pool available but can be cold. Best photographed in morning light. Often combined with whale shark watching in Oslob. 3.5 hours from Cebu City.'
    },
    
    culturalPractices: [
      'Nature photography',
      'Local tourism entrepreneurship',
      'Environmental appreciation',
      'Community-based tourism'
    ],
    
    nativeFloraFauna: [
      'Moss-covered rocks',
      'Tropical ferns',
      'Hanging vines',
      'Native forest trees',
      'Freshwater insects'
    ],
    
    preservation: 'Managed by local barangay government of Tumalog, Oslob'
  },
  {
    id: 9,
    name: 'Sirao Flower Garden',
    location: 'Sirao, Cebu City',
    lat: 10.3500,
    lng: 123.9667,
    image: 'src/image/sirao-garden.jpg',
    description: 'Colorful flower gardens known as "Little Amsterdam" for its celosia flower fields.',
    category: 'Cultural Heritage',
    heritageStatus: 'Tourism Attraction',
    era: 'Modern (2015)',
    region: 'Central Visayas',
    established: '2015',
    builtBy: 'Local flower farmers',
    
    detailedInfo: {
      overview: 'Sirao Flower Garden, nicknamed "Little Amsterdam," is a flower farm turned tourist attraction located in the mountain barangay of Sirao, Cebu City. Originally a simple celosia flower farm supplying the local market, it gained fame on social media for its vibrant, colorful flower fields resembling Dutch tulip gardens. The gardens now feature various flowers including celosia, sunflowers, zinnias, and other ornamental plants.',
      culturalSignificance: 'Represents the entrepreneurial spirit of Cebuanos turning agriculture into agri-tourism. The site went viral on social media and became a phenomenon, inspiring similar flower gardens across the Philippines. Important for local economy providing jobs to residents.',
      biodiversity: 'While cultivated rather than wild, the gardens support pollinators like bees and butterflies. The cool highland climate allows for various temperate flowers to thrive. Surrounding area still has native vegetation and pine trees.',
      currentStatus: 'Highly popular Instagram-worthy destination. Multiple gardens now operate in Sirao area. Well-maintained with photo spots, swings, and viewing decks. Can get crowded on weekends.',
      visitorInfo: 'Open daily 6:00 AM to 6:00 PM. Entrance fee: ₱50-100 depending on garden. About 45 minutes from downtown Cebu City. Cool temperature, bring light jacket. Best visited during flower bloom season (October to January). Multiple garden options available. Habal-habal transportation from Busay.'
    },
    
    culturalPractices: [
      'Agri-tourism',
      'Instagram/social media culture',
      'Flower farming traditions',
      'Community entrepreneurship'
    ],
    
    nativeFloraFauna: [
      'Celosia flowers (various colors)',
      'Sunflowers',
      'Zinnias',
      'Marigolds',
      'Butterflies and bees'
    ],
    
    preservation: 'Privately owned and maintained by local flower farmers and entrepreneurs'
  },
  {
    id: 10,
    name: 'Moalboal - Pescador Island',
    location: 'Moalboal, Cebu',
    lat: 9.9450,
    lng: 123.3733,
    image: 'src/image/moalboal.jpg',
    description: 'Famous for the sardine run, turtle sanctuary, and world-class diving at Pescador Island.',
    category: 'Natural Heritage',
    heritageStatus: 'Marine Protected Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Marine sanctuary since 1980s',
    builtBy: 'Natural marine ecosystem',
    
    detailedInfo: {
      overview: 'Moalboal is a coastal town famous for its incredible marine biodiversity, particularly the sardine run where millions of sardines form massive underwater schools near the shore. Pescador Island, located just off the coast, is one of the Philippines\' premier dive sites featuring a dramatic underwater cliff drop-off. The area is also known for regular sea turtle sightings and vibrant coral reefs.',
      culturalSignificance: 'Transformed from a quiet fishing village into an international diving destination. The conservation success story of Pescador Island shows community-led marine protection. Important for sustainable tourism and marine conservation awareness.',
      biodiversity: 'Extremely rich marine life including millions of sardines, sea turtles (green and hawksbill), colorful reef fish, octopus, frogfish, nudibranchs, and occasional thresher sharks. Pescador Island features healthy coral reefs, sea fans, and sponges. Over 200 species of fish documented.',
      currentStatus: 'Thriving eco-tourism and diving destination. Strict marine sanctuary rules enforced. Sustainable tourism practices in place. Some areas experiencing pressure from over-tourism.',
      visitorInfo: 'Accessible year-round, best diving March to June. Sardine run viewable right from Panagsama Beach (free). Snorkeling gear rental: ₱150-200. Diving packages from ₱1,500. Pescador Island boat tour: ₱300-500. Accommodation ranges from budget to mid-range. About 3 hours from Cebu City.'
    },
    
    culturalPractices: [
      'Sustainable diving tourism',
      'Marine conservation efforts',
      'Community-based tourism',
      'Environmental education programs'
    ],
    
    nativeFloraFauna: [
      'Sardine schools (millions)',
      'Green and hawksbill sea turtles',
      'Coral reefs (hard and soft)',
      'Tropical reef fish',
      'Octopus and nudibranchs'
    ],
    
    preservation: 'Managed by Moalboal Municipal Government and local dive shops through Marine Protected Area'
  },
  {
    id: 11,
    name: 'Malapascua Island',
    location: 'Daanbantayan, Cebu',
    lat: 11.3333,
    lng: 124.1167,
    image: 'src/image/malapascua.jpg',
    description: 'Small island paradise famous for thresher shark diving and pristine white beaches.',
    category: 'Natural Heritage',
    heritageStatus: 'Marine Protected Area',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural island',
    builtBy: 'Natural coral and sand formation',
    
    detailedInfo: {
      overview: 'Malapascua Island is a small tropical island measuring only 2.5km long and 1km wide, located at the northernmost tip of Cebu. The island is world-renowned as one of the few places where thresher sharks can be seen daily at Monad Shoal, a sunken island plateau. Beyond diving, the island features powdery white-sand beaches, particularly Bounty Beach and Logon Beach.',
      culturalSignificance: 'Rose to international fame in the 1990s when divers discovered the regular thresher shark sightings. The island community successfully balanced tourism development with traditional fishing livelihoods. Recovery from Typhoon Yolanda (2013) showcased resilience of island communities.',
      biodiversity: 'Famous for pelagic thresher sharks, manta rays, and occasional whale sharks. Rich coral reefs with macro life including nudibranchs, pygmy seahorses, and mandarin fish. Over 20 dive sites including caves, walls, and wrecks. Marine sanctuary protects coral reefs and marine life.',
      currentStatus: 'Premier diving destination attracting divers worldwide. Sustainable tourism practices developing. Island infrastructure improving while maintaining laid-back atmosphere. Conservation efforts ongoing.',
      visitorInfo: 'Access via 30-minute boat from Maya Port (2.5 hours north of Cebu City). Thresher shark diving requires early morning dives (5:00 AM). Diving packages from ₱1,800. Accommodation ranges from budget to upscale. Best season November to May. Island electricity limited to evenings. Bring cash as ATMs unreliable.'
    },
    
    culturalPractices: [
      'World-class diving culture',
      'Sustainable island tourism',
      'Traditional fishing practices',
      'Community resilience programs'
    ],
    
    nativeFloraFauna: [
      'Thresher sharks',
      'Manta rays',
      'Coral reefs',
      'Macro marine life',
      'Coconut palms and beach flora'
    ],
    
    preservation: 'Managed by Daanbantayan Municipal Government with dive operator consortium'
  },
  {
    id: 12,
    name: 'Bantayan Island',
    location: 'Bantayan, Cebu',
    lat: 11.1667,
    lng: 123.7167,
    image: 'src/image/bantayan.jpg',
    description: 'Idyllic island known for pristine white sand beaches, crystal clear waters, and laid-back vibe.',
    category: 'Natural Heritage',
    heritageStatus: 'Island Municipality',
    era: 'Natural formation',
    region: 'Central Visayas',
    established: 'Natural island',
    builtBy: 'Natural coral and limestone formation',
    
    detailedInfo: {
      overview: 'Bantayan Island is a first-class island municipality northwest of Cebu mainland, known for its stunning white-sand beaches, particularly Paradise Beach, Sugar Beach, and Kota Beach. The island maintains a peaceful, unhurried atmosphere compared to more developed Philippine beach destinations. Famous for its Holy Week celebrations, fresh seafood, and traditional egg production.',
      culturalSignificance: 'Known for spectacular Semana Santa (Holy Week) processions dating back to Spanish times. The island\'s traditional dried fish and egg industries have sustained the community for generations. Represents authentic island Filipino life before mass tourism.',
      biodiversity: 'Pristine beaches with fine white sand. Healthy seagrass beds and coral reefs support marine life. Mangrove areas provide nurseries for fish. Rich birdlife including migratory species. Traditional fishing grounds still productive.',
      currentStatus: 'Developing tourism destination while maintaining authentic island character. Infrastructure improving but retains laid-back charm. Sustainable tourism efforts ongoing. Recovering and thriving after Typhoon Yolanda.',
      visitorInfo: 'Access via ferry from Hagnaya Port (3 hours from Cebu City) or flight to Bantayan Airport. Multiple beaches and beach resorts available. Known for fresh seafood restaurants. Island-hopping tours to Virgin Island and Hilantagaan Island. Best visited October to May. Holy Week very crowded but culturally significant. Budget to mid-range accommodation.'
    },
    
    culturalPractices: [
      'Semana Santa processions',
      'Traditional fishing',
      'Egg and dried fish production',
      'Island-hopping culture',
      'Beach tourism'
    ],
    
    nativeFloraFauna: [
      'Coconut plantations',
      'Seagrass beds',
      'Coral reefs',
      'Tropical fish species',
      'Migratory birds'
    ],
    
    preservation: 'Managed by Bantayan Municipal Government with community involvement'
  },
  {
    id: 13,
    name: 'Temple of Leah',
    location: 'Busay, Cebu City',
    lat: 10.3670,
    lng: 123.9417,
    image: 'src/image/temple-leah.jpg',
    description: 'Grandiose Greco-Roman temple built as a monument of love, offering panoramic city views.',
    category: 'Cultural Heritage',
    heritageStatus: 'Private Monument',
    era: 'Modern (2012)',
    region: 'Central Visayas',
    established: '2012 (ongoing construction)',
    builtBy: 'Teodorico Soriano Adarna',
    
    detailedInfo: {
      overview: 'The Temple of Leah is a grand Greco-Roman-inspired structure built by businessman Teodorico Soriano Adarna as a symbol of his undying love for his late wife, Leah Villa Albino-Adarna. Often called the "Taj Mahal of Cebu," it features massive columns, lion statues, a central museum, and a large statue of Leah. The temple sits on a hilltop offering 360-degree views of Cebu City, the surrounding mountains, and the sea.',
      culturalSignificance: 'Represents modern expressions of love and devotion. Has become a popular tourist attraction and cultural landmark of Cebu. Reflects Filipino appreciation for grand romantic gestures and family legacy. Popular wedding and event venue.',
      architecture: 'Greco-Roman architecture with 24 chambers housing the family\'s art collection, a gallery of Leah\'s life, an antique library, and a chapel. Features include massive Corinthian columns, ornate balustrades, bronze lion statues, and a central shrine with Leah\'s statue. Still under construction with plans for additional features.',
      currentStatus: 'Open to public as a museum and tourist attraction. Ongoing construction and development. Popular for photo shoots, pre-wedding shoots, and events.',
      visitorInfo: 'Open daily 6:00 AM to 11:00 PM. Entrance fee: ₱50. About 30-45 minutes from downtown Cebu City (take Transcentral Highway). Best visited late afternoon for sunset views. Restaurant on-site. Parking available. Dress code: decent attire required.'
    },
    
    culturalPractices: [
      'Modern monument culture',
      'Wedding photography',
      'Cultural tourism',
      'Art appreciation'
    ],
    
    nativeFloraFauna: [
      'Landscaped gardens',
      'Ornamental plants',
      'Mountain vegetation',
      'City viewpoint flora'
    ],
    
    preservation: 'Privately owned and maintained by the Adarna family'
  },
  {
    id: 14,
    name: 'Tops Lookout',
    location: 'Busay, Cebu City',
    lat: 10.3594,
    lng: 123.9594,
    image: 'src/image/tops.webp',
    description: 'Popular viewing deck offering stunning panoramic views of Cebu City and surrounding islands.',
    category: 'Natural Heritage',
    heritageStatus: 'Tourism Viewpoint',
    era: 'Developed viewing area',
    region: 'Central Visayas',
    established: 'Developed as tourist spot',
    builtBy: 'Cebu City Government',
    
    detailedInfo: {
      overview: 'Tops Lookout, located at approximately 2,000 feet above sea level in the Busay hills, is one of Cebu City\'s most iconic viewpoints. It offers breathtaking 360-degree panoramic views of Metro Cebu, Mactan Island, Bohol (on clear days), and the surrounding mountain ranges. The viewing deck is especially popular for watching sunrises, sunsets, and the glittering city lights at night.',
      culturalSignificance: 'Traditional date spot and family outing destination for Cebuanos. Has been a beloved local landmark for decades. Represents Cebuanos\' love for mountain retreats and scenic views. Popular for celebrations, proposals, and special occasions.',
      biodiversity: 'Cool mountain climate with pine trees and mountain vegetation. The area serves as a transition zone between urban and mountain forest ecosystems. Birdwatching opportunities. Fresh mountain air.',
      currentStatus: 'Well-maintained tourist viewing area with gazebos, benches, food stalls, and parking. Popular throughout the day but especially at night. Can get crowded on weekends and holidays.',
      visitorInfo: 'Open 24/7. Entrance fee: ₱100 per person. About 30-45 minutes from downtown Cebu City via Transcentral Highway. Best visited late afternoon for sunset or evening for city lights. Temperature cooler than lowlands, bring light jacket. Food and drinks available from vendors. Photography popular. Parking available.'
    },
    
    culturalPractices: [
      'Romantic date culture',
      'Family bonding traditions',
      'Night view appreciation',
      'Photography tourism'
    ],
    
    nativeFloraFauna: [
      'Pine trees',
      'Mountain vegetation',
      'Highland grasses',
      'Mountain birds',
      'Cool climate flora'
    ],
    
    preservation: 'Managed by Cebu City Government and private operators'
  },
  {
    id: 15,
    name: 'Carbon Market',
    location: 'Carbon, Cebu City',
    lat: 10.2931,
    lng: 123.9014,
    image: 'src/image/carbon-market.jpg',
    description: 'Historic and largest public market in Cebu, showcasing local trade and culture since 1900s.',
    category: 'Cultural Heritage',
    heritageStatus: 'Heritage Market',
    era: 'Established early 1900s',
    region: 'Central Visayas',
    established: 'Early 20th century',
    builtBy: 'Cebu City Government',
    
    detailedInfo: {
      overview: 'Carbon Market (officially Cebu Carbon Public Market) is Cebu\'s oldest and largest farmers\' market, operating since the early 1900s. Named after the coal (carbon) storage facility that once stood there during Spanish times. The sprawling market covers several blocks and operates day and night, selling everything from fresh produce, seafood, meat, flowers, to dry goods, handicrafts, and street food. It\'s divided into wet market, dry goods section, and night market areas.',
      culturalSignificance: 'Represents the heart of Cebuano commerce and daily life. A cultural institution where generations of Cebuanos have shopped for decades. Showcases authentic Filipino market culture, bargaining traditions, and local food systems. Important for understanding working-class Cebuano life.',
      architecture: 'Mix of old and new structures. Original pre-war buildings exist alongside modern additions. Covered sections with metal roofing. Narrow passageways and stalls create labyrinthine market atmosphere. Currently undergoing modernization while preserving heritage character.',
      currentStatus: 'Fully operational 24/7 with peak activity early morning. Modernization project ongoing to improve sanitation and infrastructure while maintaining market character. Remains vital economic hub for vendors and shoppers.',
      visitorInfo: 'Open 24/7 but best visited 4:00 AM to 9:00 AM for freshest products. Night market operates 6:00 PM onwards. Free entry. Bring cash (no cards). Watch belongings. Bargaining expected. Try local street food. Pungko-pungko (street food stalls) famous. Cultural experience, not tourist attraction. Nearby is Taboan for dried fish (pasalubong).'
    },
    
    culturalPractices: [
      'Traditional market trade',
      'Bargaining culture',
      'Street food culture (pungko-pungko)',
      'Local commerce traditions',
      'Dawn market rituals'
    ],
    
    nativeFloraFauna: [
      'Fresh local produce varieties',
      'Native fruits and vegetables',
      'Local flowers',
      'Fresh seafood species',
      'Traditional herbs'
    ],
    
    preservation: 'Managed by Cebu City Government with ongoing heritage-sensitive modernization'
  },
  // ADD DESTINATIONS FROM DESTINATIONS.JSX (16-30)
  { 
    id: 16, 
    name: 'Sto. Niño de Cebu Parish (Simala Shrine)', 
    location: 'Sibonga, Cebu', 
    category: 'Historical Heritage',
    lat: 10.0167,
    lng: 123.4500,
    image: 'src/image/simala.jpg', 
    description: 'A grand castle-like church known for miraculous answered prayers, attracting thousands of pilgrims.',
    heritageStatus: 'Religious Pilgrimage Site',
    era: 'Modern (1998)',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by the Marian Monks of the Lindogon Community'
  },
  { 
    id: 17, 
    name: 'Alegre Beach & Guitnang Bato Falls', 
    location: 'Alegre, Cebu', 
    category: 'Natural Heritage',
    lat: 10.2500,
    lng: 123.7167,
    image: 'src/image/alegre-beach.jpg', 
    description: 'Hidden gem combining pristine beach coves and refreshing mountain waterfalls in one location.',
    heritageStatus: 'Natural Landmark',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by local barangay government and community organizations'
  },
  { 
    id: 18, 
    name: 'Cebu Taoist Temple', 
    location: 'Beverly Hills, Cebu City', 
    category: 'Cultural Heritage',
    lat: 10.3333,
    lng: 123.8833,
    image: 'src/image/taoist.jpg', 
    description: 'Stunning Chinese temple built by Cebu\'s Chinese community, offering panoramic city views and cultural insights.',
    heritageStatus: 'Religious and Cultural Landmark',
    era: 'Modern (1972)',
    region: 'Central Visayas',
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
    
    preservation: 'Maintained by Cebu Chinese community and temple management'
  },
  { 
    id: 19, 
    name: 'Inambakan Falls', 
    location: 'Ginatilan, Cebu', 
    category: 'Natural Heritage',
    lat: 9.6000,
    lng: 123.3500,
    image: 'src/image/inambakan.jpg', 
    description: 'Multi-tiered waterfalls with natural pools perfect for swimming, surrounded by lush forest.',
    heritageStatus: 'Natural Landmark',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by Ginatilan Municipal Tourism Office and local barangay'
  },
  { 
    id: 20, 
    name: 'Cebu Provincial Capitol', 
    location: 'Cebu City, Cebu', 
    category: 'Historical Heritage',
    lat: 10.3156,
    lng: 123.8901,
    image: 'src/image/cebucapitol.jpg', 
    description: 'Iconic government building with neoclassical architecture, symbolizing Cebu\'s political heritage.',
    heritageStatus: 'National Historical Landmark',
    era: 'American Colonial (1937)',
    region: 'Central Visayas',
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
    
    preservation: 'Maintained by Cebu Provincial Government'
  },
  { 
    id: 21, 
    name: 'Cambuyo Falls', 
    location: 'Alegria, Cebu', 
    category: 'Natural Heritage',
    lat: 9.7500,
    lng: 123.3833,
    image: 'src/image/cambais.jpg', 
    description: 'Hidden cascade with emerald pools and canyon-like rock formations, perfect for adventure seekers.',
    heritageStatus: 'Natural Landmark',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by Alegria Municipal Tourism Office and local barangay'
  },
  { 
    id: 22, 
    name: 'University of San Carlos Museum', 
    location: 'Talamban, Cebu City', 
    category: 'Cultural Heritage',
    lat: 10.3500,
    lng: 123.9167,
    image: 'src/image/usc-museum.jpg', 
    description: 'Premier anthropological museum housing extensive collections of Cebuano and Visayan cultural artifacts.',
    heritageStatus: 'University Museum',
    era: 'Established 1967',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by University of San Carlos'
  },
  { 
    id: 23, 
    name: 'Sumilon Island', 
    location: 'Oslob, Cebu', 
    category: 'Natural Heritage',
    lat: 9.4333,
    lng: 123.3833,
    image: 'src/image/sumilon.jpg', 
    description: 'Pristine island with shifting sandbars, marine sanctuary, and crystal-clear lagoons.',
    heritageStatus: 'Marine Sanctuary',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by Oslob Municipal Government and resort operator under DENR supervision'
  },
  { 
    id: 24, 
    name: 'Colawin Protected Landscape', 
    location: 'Argao, Cebu', 
    category: 'Natural Heritage',
    lat: 9.8833,
    lng: 123.5000,
    image: 'src/image/colawin.jpg', 
    description: 'Mountain forest reserve with diverse wildlife, bird watching opportunities, and eco-trails.',
    heritageStatus: 'Protected Landscape',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Managed by DENR with community participation'
  },
  { 
    id: 25, 
    name: 'Heritage of Cebu Monument', 
    location: 'Parian, Cebu City', 
    category: 'Cultural Heritage',
    lat: 10.2958,
    lng: 123.9006,
    image: 'src/image/heritagecebu.jpg', 
    description: 'Massive sculpture depicting key events in Cebu\'s history from pre-colonial to modern times.',
    heritageStatus: 'Public Monument',
    era: 'Modern (2000)',
    region: 'Central Visayas',
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
    
    preservation: 'Maintained by Cebu City Government'
  },
  { 
    id: 26, 
    name: 'Cuartel (Spanish Barracks)', 
    location: 'Carcar City, Cebu', 
    category: 'Historical Heritage',
    lat: 10.1000,
    lng: 123.6333,
    image: 'src/image/cuartel.jpg', 
    description: 'Ruins of Spanish military barracks, one of the few remaining colonial military structures in Cebu.',
    heritageStatus: 'Heritage Structure',
    era: 'Spanish Colonial (1870s)',
    region: 'Central Visayas',
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
    
    preservation: 'Under Carcar City Government with heritage conservation groups'
  },
  { 
    id: 27, 
    name: 'Nug-as Forest', 
    location: 'Alcoy-Dalaguete, Cebu', 
    category: 'Natural Heritage',
    lat: 9.7167,
    lng: 123.4333,
    image: 'src/image/nugas.jpg', 
    description: 'Cool mountain forest with giant ancient trees, hanging bridges, and nature trails.',
    heritageStatus: 'Natural Forest Reserve',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Community-managed with support from Alcoy and Dalaguete LGUs'
  },
  { 
    id: 28, 
    name: 'Lantawan (Tres Reyes Islands)', 
    location: 'Bantayan Island, Cebu', 
    category: 'Natural Heritage',
    lat: 11.1833,
    lng: 123.7000,
    image: 'src/image/lantawan.jpg', 
    description: 'Three pristine islands with powdery white sand beaches, clear waters, and vibrant marine life.',
    heritageStatus: 'Island Group',
    era: 'Natural formation',
    region: 'Central Visayas',
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
    
    preservation: 'Community-managed with Bantayan Municipal Government oversight'
  },
  { 
    id: 29, 
    name: 'Cebu Metropolitan Cathedral', 
    location: 'Cebu City, Cebu', 
    category: 'Historical Heritage',
    lat: 10.2952,
    lng: 123.9022,
    image: 'src/image/cathedral.webp', 
    description: 'The ecclesiastical seat of the Archdiocese of Cebu, featuring colonial architecture and religious heritage.',
    heritageStatus: 'Metropolitan Cathedral',
    era: 'Spanish Colonial (1689, rebuilt 1835)',
    region: 'Central Visayas',
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
    
    preservation: 'Maintained by Archdiocese of Cebu'
  },
  { 
    id: 30, 
    name: 'Buwakan ni Alejandra', 
    location: 'Balamban, Cebu', 
    category: 'Cultural Heritage',
    lat: 10.4833,
    lng: 123.7167,
    image: 'src/image/buwakan.jpg', 
    description: 'Sprawling flower and vegetable farm featuring themed gardens, mountain views, and local produce.',
    heritageStatus: 'Agri-Tourism Site',
    era: 'Modern (2016)',
    region: 'Central Visayas',
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
    
    preservation: 'Privately owned and maintained'
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
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoZoom, setAutoZoom] = useState(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);

  useEffect(() => {
    // Fix Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Check if there's a destination saved from Destinations page
    const savedDest = localStorage.getItem('selectedDestination');
    if (savedDest) {
      try {
        const destination = JSON.parse(savedDest);
        
        // Check if this destination exists in our cebuSites array
        const existingDest = cebuSites.find(site => site.id === destination.id);
        
        if (existingDest) {
          // Use the destination from our local data
          setSelected(existingDest);
        } else {
          // If it's a new destination from Destinations page, add it to the map
          // Ensure it has all required properties
          const newDest = {
            ...destination,
            id: destination.id || Math.max(...cebuSites.map(s => s.id)) + 1,
            zoom: 13,
            category: destination.category || 'Cultural Heritage'
          };
          setSelected(newDest);
        }
        
        setAutoZoom(true);
        localStorage.removeItem('selectedDestination');
      } catch (error) {
        console.error('Error parsing saved destination:', error);
        localStorage.removeItem('selectedDestination');
      }
    }
  }, []);

  const categories = ['All', 'Cultural Heritage', 'Historical Heritage', 'Natural Heritage'];

  // Combine sites from local array with any dynamically added sites
  const allSites = [...cebuSites];
  
  const filteredSites = allSites.filter(site => {
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

  return (
    <div style={{ 
      height: 'calc(100vh - 100px)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* LEFT SIDEBAR - Updated to match Home theme */}
      <div 
        style={{ 
          width: '400px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
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
                SugboSphere
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.85rem',
                margin: 0
              }}>
                Explore Cebu's Heritage & Natural Wonders
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="position-relative mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Cebu destinations..."
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
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sites List - Just Images and Names */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '15px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '15px'
        }}>
          {filteredSites.map((site) => (
            <div
              key={site.id}
              onClick={() => handleSiteClick(site)}
              style={{
                cursor: 'pointer',
                borderRadius: '12px',
                background: selected?.id === site.id 
                  ? 'rgba(59, 130, 246, 0.3)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: selected?.id === site.id 
                  ? '2px solid rgba(59, 130, 246, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s',
                height: '200px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selected?.id !== site.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selected?.id !== site.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Site Image */}
              <div style={{
                height: '140px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={site.image}
                  alt={site.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.6rem',
                  fontWeight: '600',
                  background: site.category === 'Cultural Heritage' 
                    ? 'rgba(245, 158, 11, 0.9)' 
                    : site.category === 'Historical Heritage'
                    ? 'rgba(148, 163, 184, 0.9)'
                    : 'rgba(34, 197, 94, 0.9)',
                  color: 'white'
                }}>
                  {site.category.split(' ')[0]}
                </div>
                
                {/* UNESCO/Special Badge */}
                {(site.heritageStatus && (site.heritageStatus.includes('UNESCO') || site.heritageStatus.includes('National'))) && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.6rem',
                    fontWeight: '600',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white'
                  }}>
                    {site.heritageStatus.includes('UNESCO') ? 'UNESCO' : 'Heritage'}
                  </div>
                )}
              </div>

              {/* Site Name */}
              <div style={{ 
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px'
              }}>
                <h6 style={{ 
                  color: 'white', 
                  margin: 0, 
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {site.name}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAP CONTAINER - FOCUSED ON CEBU */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[10.3157, 123.8854]}  // Center of Cebu
          zoom={9}  // Closer zoom for Cebu island
          style={{ height: '100%', width: '100%' }}
          maxBounds={[
            [9.4, 123.1],   // Southwest corner of Cebu
            [11.3, 124.1]   // Northeast corner of Cebu
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
                  <strong style={{ color: '#3b82f6', fontSize: '1rem' }}>
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
                <h5 className="fw-bold mb-2" style={{ color: '#0c4a6e' }}>
                  {selected.name}
                </h5>
                <div className="mb-3">
                  {selected.heritageStatus && (
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
                  )}
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
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0c4a6e' }}>
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
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#0c4a6e' }}>
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
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
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
                <h2 className="fw-bold mb-1" style={{ color: '#0c4a6e' }}>
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
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#0c4a6e', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                    Overview
                  </h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                    {selected.detailedInfo?.overview || selected.description}
                  </p>
                </div>

                {/* Cultural Significance */}
                {selected.detailedInfo?.culturalSignificance && (
                  <div className="mb-4">
                    <h4 className="h5 fw-bold mb-3" style={{ color: '#0c4a6e', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                      Cultural Significance
                    </h4>
                    <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                      {selected.detailedInfo.culturalSignificance}
                    </p>
                  </div>
                )}

                {/* Architecture/Natural Features */}
                {(selected.detailedInfo?.architecture || selected.detailedInfo?.biodiversity) && (
                  <div className="mb-4">
                    <h4 className="h5 fw-bold mb-3" style={{ color: '#0c4a6e', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                      {selected.category === 'Natural Heritage' ? 'Natural Features' : 'Architecture'}
                    </h4>
                    <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                      {selected.detailedInfo.architecture || selected.detailedInfo.biodiversity}
                    </p>
                  </div>
                )}

                {/* Current Status */}
                {selected.detailedInfo?.currentStatus && (
                  <div className="mb-4">
                    <h4 className="h5 fw-bold mb-3" style={{ color: '#0c4a6e', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                      Current Status
                    </h4>
                    <p style={{ lineHeight: '1.7', color: '#4b5563' }}>
                      {selected.detailedInfo.currentStatus}
                    </p>
                  </div>
                )}
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
                  <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                    <Info size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Quick Facts
                  </h5>
                  <div className="mb-2">
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Category</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{selected.category}</div>
                  </div>
                  {selected.heritageStatus && (
                    <div className="mb-2">
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Heritage Status</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{selected.heritageStatus}</div>
                    </div>
                  )}
                  {selected.era && (
                    <div className="mb-2">
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Historical Period</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{selected.era}</div>
                    </div>
                  )}
                  {selected.region && (
                    <div className="mb-2">
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Region</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{selected.region}</div>
                    </div>
                  )}
                  {selected.established && (
                    <div className="mb-2">
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>Established</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0c4a6e' }}>{selected.established}</div>
                    </div>
                  )}
                </div>

                {/* Cultural Practices */}
                {selected.culturalPractices && selected.culturalPractices.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
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
                {selected.nativeFloraFauna && selected.nativeFloraFauna.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
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
                {selected.preservation && (
                  <div className="mb-4">
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Award size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Preservation
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                      {selected.preservation}
                    </p>
                  </div>
                )}

                {/* Visitor Information */}
                {selected.detailedInfo?.visitorInfo && (
                  <div>
                    <h5 className="h6 fw-bold mb-3" style={{ color: '#0c4a6e' }}>
                      <Home size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Visitor Information
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                      {selected.detailedInfo.visitorInfo}
                    </p>
                  </div>
                )}
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
            <span style={{ fontSize: '0.9rem', color: '#0c4a6e', fontWeight: '600' }}>
              Zoomed to: {selected?.name}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

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
          borderRadius: 3px;
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
          boxShadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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