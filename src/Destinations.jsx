import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Globe, BookOpen, ArrowRight, Landmark, X, Navigation, Info, Calendar, Users, Flag, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function Destinations() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showMapButton, setShowMapButton] = useState(null);

  // ── Star rating state ──
  const [hoverRating, setHoverRating]         = useState(0);
  const [submittedRatings, setSubmittedRatings] = useState({}); // siteName → star given
  const [submitting, setSubmitting]           = useState(false);
  const [ratingSuccess, setRatingSuccess]     = useState(null); // siteName with success msg
  const [siteAvgRatings, setSiteAvgRatings]   = useState({}); // siteName → {avg, count}
  const [editingRating, setEditingRating]     = useState(null); // siteName being edited
  const [ratingDocIds, setRatingDocIds]       = useState({}); // siteName → {siteRatingId, feedbackId}

  // ── NEW: Admin-added sites from Firestore ──
  const [firestoreSites, setFirestoreSites] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'heritage'), (snap) => {
      const sites = snap.docs.map(d => {
        const data = d.data();
        return {
          id:              d.id,
          name:            data.name            || '',
          location:        data.location         || '',
          category:        data.category         || 'Cultural Heritage',
          lat:             data.lat              ?? 10.3157,
          lng:             data.lng              ?? 123.8854,
          image:           data.imageUrl         || '',
          rating:          data.rating           ?? 0,
          reviews:         data.reviews          ?? 0,
          era:             data.era              || '',
          heritageStatus:  data.heritageStatus   || '',
          description:     data.description      || '',
          established:     data.established      || '',
          builtBy:         data.builtBy          || '',
          detailedInfo: {
            overview:              data.detailedInfo?.overview              || data.description || '',
            culturalSignificance:  data.detailedInfo?.culturalSignificance  || '',
            architectureOrBio:     data.detailedInfo?.architectureOrBio     || '',
            currentStatus:         data.detailedInfo?.currentStatus         || '',
            visitorInfo:           data.detailedInfo?.visitorInfo           || '',
            transportationFee:     data.detailedInfo?.transportationFee     || '',
          },
          culturalPractices: Array.isArray(data.culturalPractices) ? data.culturalPractices : [],
          nativeFloraFauna:  Array.isArray(data.nativeFloraFauna)  ? data.nativeFloraFauna  : [],
          preservation:      data.preservation   || '',
          highlights:        Array.isArray(data.highlights)         ? data.highlights        : [],
          source:            'firestore',
        };
      });
      setFirestoreSites(sites);
    });
    return () => unsub();
  }, []);

  // ── Restore ratings when user logs in / clear when they log out ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Logged out — clear session ratings
        setSubmittedRatings({});
        setRatingDocIds({});
        return;
      }

      // Logged in — fetch all ratings this user has previously submitted
      try {
        const q = query(
          collection(db, 'siteRatings'),
          where('userId', '==', user.uid)
        );
        const snap = await getDocs(q);

        const ratings = {};
        const docIds  = {};

        snap.docs.forEach(d => {
          const { siteName, rating } = d.data();
          if (!siteName) return;
          ratings[siteName] = rating;

          // Also find the matching feedback doc ID for this site
          if (!docIds[siteName]) docIds[siteName] = {};
          docIds[siteName].siteRatingId = d.id;
        });

        // Also fetch matching feedback doc IDs
        if (snap.docs.length > 0) {
          const fbQ = query(
            collection(db, 'feedbacks'),
            where('userId', '==', user.uid),
            where('category', '==', 'Site Rating')
          );
          const fbSnap = await getDocs(fbQ);
          fbSnap.docs.forEach(d => {
            const { siteName } = d.data();
            if (!siteName) return;
            if (!docIds[siteName]) docIds[siteName] = {};
            docIds[siteName].feedbackId = d.id;
          });
        }

        setSubmittedRatings(ratings);
        setRatingDocIds(docIds);
      } catch (e) {
        console.error('Error loading user ratings:', e);
      }
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'siteRatings'), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        const { siteName, rating } = d.data();
        if (!siteName || !rating) return;
        if (!map[siteName]) map[siteName] = { total: 0, count: 0 };
        map[siteName].total += rating;
        map[siteName].count += 1;
      });
      const avgs = {};
      Object.entries(map).forEach(([name, { total, count }]) => {
        avgs[name] = { avg: (total / count).toFixed(1), count };
      });
      setSiteAvgRatings(avgs);
    });
    return () => unsub();
  }, []);

  // ── Submit or update a star rating ──
  const submitRating = async (site, star) => {
    if (submitting) return;
    setSubmitting(true);

    const isEdit = !!submittedRatings[site.name] && editingRating === site.name;

    // Optimistic update
    setSubmittedRatings(p => ({ ...p, [site.name]: star }));
    setEditingRating(null);
    setRatingSuccess(site.name);
    setTimeout(() => setRatingSuccess(null), 2500);

    const user      = auth.currentUser;
    const userName  = user?.displayName || 'Guest';
    const userEmail = user?.email       || '';
    const userId    = user?.uid         || null;
    const label     = ['','Terrible','Poor','Okay','Good','Excellent'][star];

    try {
      if (isEdit && ratingDocIds[site.name]) {
        // ── UPDATE existing docs ──
        const { siteRatingId, feedbackId } = ratingDocIds[site.name];
        if (siteRatingId) {
          await updateDoc(doc(db, 'siteRatings', siteRatingId), { rating: star, updatedAt: serverTimestamp() });
        }
        if (feedbackId) {
          await updateDoc(doc(db, 'feedbacks', feedbackId), {
            rating: star,
            message: `Rated "${site.name}" ${star} star${star !== 1 ? 's' : ''} (${label}).`,
            updatedAt: serverTimestamp(),
          });
        }
      } else {
        // ── CREATE new docs ──
        const srRef = await addDoc(collection(db, 'siteRatings'), {
          siteName: site.name, siteId: site.id, category: site.category,
          rating: star, userName, userEmail, userId, createdAt: serverTimestamp(),
        });
        const fbRef = await addDoc(collection(db, 'feedbacks'), {
          name: userName, email: userEmail, userId,
          category: 'Site Rating', rating: star,
          message: `Rated "${site.name}" ${star} star${star !== 1 ? 's' : ''} (${label}).`,
          siteName: site.name, siteId: site.id, status: 'pending', createdAt: serverTimestamp(),
        });
        // Store doc IDs so we can update them later if user edits
        setRatingDocIds(p => ({ ...p, [site.name]: { siteRatingId: srRef.id, feedbackId: fbRef.id } }));
      }
    } catch (e) {
      console.error('Rating save error:', e.code, e.message);
    }
    setSubmitting(false);
  };

  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Historical Heritage', label: 'Historical Heritage' },
    { id: 'Cultural Heritage', label: 'Cultural Heritage' },
    { id: 'Natural Heritage', label: 'Natural Heritage' }
  ];

  // ── Your original hardcoded sites (unchanged) ──
  const cebuSites = [
    { id: 16, name: 'Sto. Niño de Cebu Parish (Simala Shrine)', location: 'Sibonga, Cebu', category: 'Historical Heritage', lat: 10.0167, lng: 123.4500, image: 'src/image/simala.jpg', rating: 0, reviews: 0, era: 'Modern (1998)', heritageStatus: 'Religious Pilgrimage Site', description: 'A grand castle-like church known for miraculous answered prayers, attracting thousands of pilgrims.', established: '1998', builtBy: 'Marian Monks of the Lindogon Community', detailedInfo: { overview: 'The Monastery of the Holy Eucharist, popularly known as Simala Shrine or Simala Church, is a castle-like structure that has become one of the most visited pilgrimage sites in Cebu.', culturalSignificance: 'Has become a symbol of faith for many Filipino Catholics.', architectureOrBio: 'European castle-inspired architecture with towering spires, ornate details, and grand staircases.', currentStatus: 'Active pilgrimage site with daily masses.', visitorInfo: 'Open daily 4:00 AM to 7:00 PM. Free admission. About 2 hours from Cebu City.' }, culturalPractices: ['Pilgrimage traditions','Prayer and thanksgiving rituals','Candle lighting ceremonies','Devotion to Mama Mary'], nativeFloraFauna: ['Garden ornamental plants','Palm trees','Flowering shrubs','Mountain birds'], preservation: 'Managed by the Marian Monks of the Lindogon Community', highlights: ['Miracle Church', 'Castle Architecture', 'Pilgrimage Site'] },
    { id: 17, name: 'Alegre Beach & Guitnang Bato Falls', location: 'Alegre, Cebu', category: 'Natural Heritage', lat: 10.2500, lng: 123.7167, image: 'src/image/alegre.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'Hidden gem combining pristine beach coves and refreshing mountain waterfalls in one location.', established: 'Natural formation', builtBy: 'Natural geological and coastal processes', detailedInfo: { overview: 'Alegre in northern Cebu offers a unique combination of coastal and mountain attractions.', culturalSignificance: 'Represents the unspoiled beauty of rural Cebu.', architectureOrBio: 'Rich marine life in coastal areas including coral gardens and diverse fish species.', currentStatus: 'Emerging eco-tourism destination.', visitorInfo: 'Open daily, best visited during dry season. About 2.5 hours from Cebu City.' }, culturalPractices: ['Community-based tourism','Traditional fishing methods','Environmental stewardship','Local guide services'], nativeFloraFauna: ['Coastal mangroves','Coral reefs','Tropical fish species','Limestone forest vegetation','Freshwater species'], preservation: 'Managed by local barangay government and community organizations', highlights: ['Beach & Falls Combo', 'Hidden Gem', 'Eco-Tourism'] },
    { id: 18, name: 'Cebu Taoist Temple', location: 'Cebu City, Cebu', category: 'Cultural Heritage', lat: 10.3333, lng: 123.8833, image: 'src/image/taoist.jpg', rating: 0, reviews: 0, era: 'Modern (1972)', heritageStatus: 'Religious and Cultural Landmark', description: "Stunning Chinese temple built by Cebu's Chinese community, offering panoramic city views and cultural insights.", established: '1972', builtBy: 'Cebu Chinese community', detailedInfo: { overview: "The Cebu Taoist Temple is located 300 meters above sea level in the Beverly Hills subdivision of Cebu City.", culturalSignificance: 'Represents the rich Chinese-Filipino heritage in Cebu.', architectureOrBio: 'Multi-tiered temple featuring traditional Chinese architecture with ornate dragons and colorful pagoda roofs.', currentStatus: 'Active place of worship and major tourist attraction.', visitorInfo: 'Open Wednesday to Sunday, 6:00 AM to 6:00 PM. Free admission.' }, culturalPractices: ['Taoist worship rituals','Fortune telling traditions','Chinese festivals','Meditation practices'], nativeFloraFauna: ['Temple garden plants','Ornamental Chinese plants','Bonsai trees','Decorative flora'], preservation: 'Maintained by Cebu Chinese community and temple management', highlights: ['Chinese Architecture', 'City Views', 'Cultural Bridge'] },
    { id: 19, name: 'Inambakan Falls', location: 'Ginatilan, Cebu', category: 'Natural Heritage', lat: 9.6000, lng: 123.3500, image: 'src/image/inambakan.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'Multi-tiered waterfalls with natural pools perfect for swimming, surrounded by lush forest.', established: 'Natural formation', builtBy: 'Natural hydrological processes', detailedInfo: { overview: 'Inambakan Falls is a stunning multi-tiered waterfall system located in the southern town of Ginatilan.', culturalSignificance: "Popular destination for locals, especially during summer months.", architectureOrBio: 'Rich tropical forest ecosystem surrounds the falls.', currentStatus: 'Managed by local barangay as eco-tourism site.', visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱30. 4 hours from Cebu City.' }, culturalPractices: ['Community-based tourism','Local guide services','Environmental conservation','Summer recreation traditions'], nativeFloraFauna: ['Tropical forest trees','Freshwater fish','Native ferns and mosses','Forest birds and butterflies','River crustaceans'], preservation: 'Managed by Ginatilan Municipal Tourism Office and local barangay', highlights: ['Multi-Tiered Falls', 'Natural Pools', 'Forest Trek'] },
    { id: 20, name: 'Cebu Provincial Capitol', location: 'Cebu City, Cebu', category: 'Historical Heritage', lat: 10.3156, lng: 123.8901, image: 'src/image/cebucapitol.jpg', rating: 0, reviews: 0, era: 'American Colonial (1937)', heritageStatus: 'National Historical Landmark', description: "Iconic government building with neoclassical architecture, symbolizing Cebu's political heritage.", established: '1937', builtBy: 'Designed by Juan Arellano', detailedInfo: { overview: 'The Cebu Provincial Capitol is the seat of the provincial government of Cebu.', culturalSignificance: "Symbol of Cebu's governance and political heritage.", architectureOrBio: 'Neoclassical design with prominent columns, symmetrical façade, and grand central dome.', currentStatus: 'Active government building.', visitorInfo: 'Building exterior and grounds open daily. Interior access during office hours Monday-Friday.' }, culturalPractices: ['Government ceremonies','Political rallies and protests','Cultural celebrations','Public gatherings and events'], nativeFloraFauna: ['Capitol garden ornamentals','Century-old trees','Manicured lawns','Urban park birds'], preservation: 'Maintained by Cebu Provincial Government', highlights: ['Neoclassical Architecture', 'Government Seat', 'Historical Landmark'] },
    { id: 21, name: 'Cambuyo Falls', location: 'Alegria, Cebu', category: 'Natural Heritage', lat: 9.7500, lng: 123.3833, image: 'src/image/cambais.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'Hidden cascade with emerald pools and canyon-like rock formations, perfect for adventure seekers.', established: 'Natural formation', builtBy: 'Natural geological erosion', detailedInfo: { overview: 'Cambuyo Falls, also known as Cambais Falls, is a hidden gem in Alegria.', culturalSignificance: 'Local swimming and recreation spot that has gained popularity among adventure tourists.', architectureOrBio: 'Surrounded by dense tropical forest with rich biodiversity.', currentStatus: 'Emerging eco-tourism destination managed by local community.', visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱50. About 3.5 hours from Cebu City.' }, culturalPractices: ['Adventure tourism','Cliff jumping culture','Community guiding','Environmental awareness'], nativeFloraFauna: ['Canyon vegetation','Moss and lichen','Freshwater fish','Forest birds','Native tree species'], preservation: 'Managed by Alegria Municipal Tourism Office and local barangay', highlights: ['Emerald Pools', 'Canyon Rocks', 'Adventure Spot'] },
    { id: 22, name: 'University of San Carlos Museum', location: 'Cebu City, Cebu', category: 'Cultural Heritage', lat: 10.3500, lng: 123.9167, image: 'src/image/usc-museum.jpg', rating: 0, reviews: 0, era: 'Established 1967', heritageStatus: 'University Museum', description: 'Premier anthropological museum housing extensive collections of Cebuano and Visayan cultural artifacts.', established: '1967', builtBy: 'University of San Carlos', detailedInfo: { overview: 'The University of San Carlos Museum is one of the oldest and most comprehensive museums in Cebu.', culturalSignificance: 'Serves as an important repository of Cebuano and Visayan cultural heritage.', architectureOrBio: 'Purpose-built museum building with climate-controlled galleries.', currentStatus: 'Active university museum open to the public.', visitorInfo: 'Open Tuesday to Saturday, 9:00 AM to 12:00 PM and 2:00 PM to 5:00 PM. Entrance fee: ₱50.' }, culturalPractices: ['Cultural education','Research and documentation','Heritage preservation','Academic exhibitions'], nativeFloraFauna: ['Museum botanical specimens','Preserved native species','Natural history collections','Ethnobotanical samples'], preservation: 'Managed by University of San Carlos', highlights: ['Anthropological Collection', 'Cultural Artifacts', 'Educational Resource'] },
    { id: 23, name: 'Sumilon Island', location: 'Oslob, Cebu', category: 'Natural Heritage', lat: 9.4333, lng: 123.3833, image: 'src/image/sumilon.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Marine Sanctuary', description: 'Pristine island with shifting sandbars, marine sanctuary, and crystal-clear lagoons.', established: 'First marine sanctuary in the Philippines (1974)', builtBy: 'Natural coral and sand formation', detailedInfo: { overview: 'Sumilon Island is a small, pristine island located off the coast of Oslob.', culturalSignificance: 'Pioneer in marine conservation in the Philippines.', architectureOrBio: 'Extremely rich marine biodiversity with healthy coral reefs.', currentStatus: 'Protected marine sanctuary with regulated tourism.', visitorInfo: 'Day tour packages available (₱800-1,500). 3.5 hours from Cebu City, boat transfer from Oslob.' }, culturalPractices: ['Marine conservation','Sustainable diving and snorkeling','Environmental education','Eco-resort tourism'], nativeFloraFauna: ['Coral reefs (hard and soft)','Tropical reef fish','Sea turtles','Coastal vegetation','Migratory birds'], preservation: 'Managed by Oslob Municipal Government and resort operator under DENR supervision', highlights: ['First Marine Sanctuary', 'Shifting Sandbar', 'Pristine Waters'] },
    { id: 24, name: 'Colawin Protected Landscape', location: 'Argao, Cebu', category: 'Natural Heritage', lat: 9.8833, lng: 123.5000, image: 'src/image/colawin.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Protected Landscape', description: 'Mountain forest reserve with diverse wildlife, bird watching opportunities, and eco-trails.', established: 'Declared protected area 1968', builtBy: 'Natural forest ecosystem', detailedInfo: { overview: 'Colawin Protected Landscape is a 3,000-hectare protected area in Argao, southern Cebu.', culturalSignificance: 'Important for biodiversity conservation in Cebu.', architectureOrBio: 'High biodiversity including endemic and endangered species.', currentStatus: 'Active protected area with ongoing conservation programs.', visitorInfo: 'Access requires permit from DENR and Argao Municipal Government. About 3 hours from Cebu City.' }, culturalPractices: ['Forest conservation','Community forestry','Bird watching culture','Environmental education'], nativeFloraFauna: ['Native hardwood trees','Endemic bird species','Orchids and ferns','Wild mammals','Forest biodiversity'], preservation: 'Managed by DENR with community participation', highlights: ['Protected Forest', 'Bird Watching', 'Biodiversity Hotspot'] },
    { id: 25, name: 'Heritage of Cebu Monument', location: 'Cebu City, Cebu', category: 'Cultural Heritage', lat: 10.2958, lng: 123.9006, image: 'src/image/heritagecebu.jpg', rating: 0, reviews: 0, era: 'Modern (2000)', heritageStatus: 'Public Monument', description: "Massive sculpture depicting key events in Cebu's history from pre-colonial to modern times.", established: '2000', builtBy: 'Sculptor Eduardo Castrillo', detailedInfo: { overview: "The Heritage of Cebu Monument is a massive outdoor sculpture located in the Parian district.", culturalSignificance: "Synthesizes over 400 years of Cebu's history in one artistic work.", architectureOrBio: 'Multi-level concrete sculpture featuring life-sized figures depicting historical scenes.', currentStatus: 'Well-maintained public monument open 24/7.', visitorInfo: 'Open 24 hours. Free admission. Located in Parian district.' }, culturalPractices: ['Historical education','Heritage walks','Cultural celebrations','Photographic tourism'], nativeFloraFauna: ['Urban plaza plants','Ornamental species','Heritage district trees','City birds'], preservation: 'Maintained by Cebu City Government', highlights: ['Historical Sculpture', 'Artistic Landmark', 'Heritage Site'] },
    { id: 26, name: 'Cuartel (Spanish Barracks)', location: 'Carcar City, Cebu', category: 'Historical Heritage', lat: 10.1000, lng: 123.6333, image: 'src/image/cuartel.jpg', rating: 0, reviews: 0, era: 'Spanish Colonial (1870s)', heritageStatus: 'Heritage Structure', description: 'Ruins of Spanish military barracks, one of the few remaining colonial military structures in Cebu.', established: '1870s', builtBy: 'Spanish colonial government', detailedInfo: { overview: 'The Cuartel, or Spanish Barracks, is a historical military structure in Carcar City.', culturalSignificance: 'Represents Spanish colonial military presence in southern Cebu.', architectureOrBio: 'Coral stone construction typical of Spanish colonial military buildings.', currentStatus: 'Heritage ruins partially preserved.', visitorInfo: 'Accessible daily. Free admission. Located in Carcar City proper. About 1.5 hours from Cebu City.' }, culturalPractices: ['Heritage conservation efforts','Historical education','Cultural tours','Local history preservation'], nativeFloraFauna: ['Heritage site vegetation','Native shrubs','Urban adaptable plants','Local birds'], preservation: 'Under Carcar City Government with heritage conservation groups', highlights: ['Colonial Ruins', 'Military Heritage', 'Spanish Architecture'] },
    { id: 27, name: 'Nug-as Forest', location: 'Alcoy, Cebu', category: 'Natural Heritage', lat: 9.7167, lng: 123.4333, image: 'src/image/nugas.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Forest Reserve', description: 'Cool mountain forest with giant ancient trees, hanging bridges, and nature trails.', established: 'Protected forest', builtBy: 'Natural forest ecosystem', detailedInfo: { overview: 'Nug-as Forest is a mountain forest straddling the municipalities of Alcoy and Dalaguete.', culturalSignificance: 'Represents community-led forest conservation.', architectureOrBio: 'Diverse montane forest ecosystem with native tree species including giant dipterocarps.', currentStatus: 'Active eco-tourism site managed by local community.', visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱50. About 3 hours from Cebu City.' }, culturalPractices: ['Community forest management','Eco-tourism','Environmental education','Traditional forest practices'], nativeFloraFauna: ['Ancient native trees','Native orchids','Forest birds','Native ferns','Endemic plant species'], preservation: 'Community-managed with support from Alcoy and Dalaguete LGUs', highlights: ['Ancient Trees', 'Hanging Bridges', 'Eco-Tourism'] },
    { id: 28, name: 'Lantawan (Tres Reyes Islands)', location: 'Bantayan Island, Cebu', category: 'Natural Heritage', lat: 11.1833, lng: 123.7000, image: 'src/image/lantawan.jpg', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Island Group', description: 'Three pristine islands with powdery white sand beaches, clear waters, and vibrant marine life.', established: 'Natural islands', builtBy: 'Natural coral and sand formation', detailedInfo: { overview: 'Lantawan, also known as Tres Reyes Islands, consists of three small islands off the coast of Bantayan.', culturalSignificance: 'Traditional fishing grounds for Bantayan islanders.', architectureOrBio: 'Rich marine ecosystems with healthy coral reefs.', currentStatus: 'Active island-hopping destinations.', visitorInfo: 'Access via island-hopping tours from Bantayan (₱1,500-2,500 for group).' }, culturalPractices: ['Traditional fishing','Island-hopping culture','Community-based tourism','Marine conservation'], nativeFloraFauna: ['Coral reefs','Tropical fish species','Coconut palms','Seagrass beds','Coastal birds'], preservation: 'Community-managed with Bantayan Municipal Government oversight', highlights: ['Three Islands', 'Pristine Beaches', 'Island Hopping'] },
    { id: 29, name: 'Cebu Metropolitan Cathedral', location: 'Cebu City, Cebu', category: 'Historical Heritage', lat: 10.2952, lng: 123.9022, image: 'src/image/cathedral.webp', rating: 0, reviews: 0, era: 'Spanish Colonial (1689, rebuilt 1835)', heritageStatus: 'Metropolitan Cathedral', description: 'The ecclesiastical seat of the Archdiocese of Cebu, featuring colonial architecture and religious heritage.', established: 'Original 1689, current structure 1835', builtBy: 'Catholic Church/Archdiocese of Cebu', detailedInfo: { overview: 'The Metropolitan Cathedral of Cebu is the ecclesiastical seat of the Metropolitan Archdiocese of Cebu.', culturalSignificance: 'Serves as the mother church of the Archdiocese of Cebu.', architectureOrBio: 'Spanish colonial architecture with baroque influences.', currentStatus: 'Active cathedral with regular masses and religious ceremonies.', visitorInfo: 'Open daily for mass and prayer. Free admission. Modest dress required.' }, culturalPractices: ['Catholic masses and ceremonies','Religious pilgrimages','Sinulog religious activities','Weddings and baptisms'], nativeFloraFauna: ['Cathedral garden plants','Heritage trees','Ornamental flora','Urban birds'], preservation: 'Maintained by Archdiocese of Cebu', highlights: ['Mother Church', 'Colonial Architecture', 'Religious Heritage'] },
    { id: 30, name: 'Buwakan ni Alejandra', location: 'Balamban, Cebu', category: 'Cultural Heritage', lat: 10.4833, lng: 123.7167, image: 'src/image/buwakan.jpg', rating: 0, reviews: 0, era: 'Modern (2016)', heritageStatus: 'Agri-Tourism Site', description: 'Sprawling flower and vegetable farm featuring themed gardens, mountain views, and local produce.', established: '2016', builtBy: 'Local agricultural entrepreneurs', detailedInfo: { overview: 'Buwakan ni Alejandra is a vast flower and vegetable farm located in the mountains of Balamban.', culturalSignificance: 'Represents the growing agri-tourism trend in Cebu.', architectureOrBio: 'Cultivated flower varieties including sunflowers, zinnias, and ornamental species.', currentStatus: 'Active agri-tourism destination.', visitorInfo: 'Open daily 7:00 AM to 6:00 PM. Entrance fee: ₱100-150. About 1.5-2 hours from Cebu City.' }, culturalPractices: ['Agri-tourism','Organic farming practices','Environmental education','Farm-to-table dining'], nativeFloraFauna: ['Sunflowers','Ornamental flowers','Organic vegetables','Pollinators','Mountain vegetation'], preservation: 'Privately owned and maintained', highlights: ['Flower Gardens', 'Mountain Views', 'Organic Farm'] },
    { id: 31, name: 'Kugtong Spring', location: 'Alcantara, Cebu', category: 'Natural Heritage', lat: 10.3667, lng: 123.4000, image: 'src/image/kugtong.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Spring', description: 'Natural spring with crystal-clear freshwater pools, perfect for swimming and relaxation.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: 'Kugtong Spring is a natural freshwater spring located in Alcantara, western Cebu.', culturalSignificance: 'Important natural resource for the local community of Alcantara.', architectureOrBio: 'Freshwater ecosystem supporting aquatic plants and fish.', currentStatus: 'Managed by local community as a natural swimming spot.', visitorInfo: 'Open daily. About 1.5 hours from Cebu City.' }, culturalPractices: ['Community swimming traditions','Local recreation','Environmental conservation','Family gatherings'], nativeFloraFauna: ['Freshwater fish','Native trees','Aquatic plants','Forest birds','Stream vegetation'], preservation: 'Managed by Alcantara local community', highlights: ['Natural Spring', 'Swimming Spot', 'Cool Waters'] },
    { id: 32, name: 'Sea Paradise Boardwalk', location: 'Alcantara, Cebu', category: 'Cultural Heritage', lat: 10.3583, lng: 123.4083, image: 'src/image/Alcantara-Cebu-Sea-Paradise.webp', rating: 0, reviews: 0, era: 'Modern (Recent)', heritageStatus: 'Coastal Tourism Attraction', description: 'Scenic boardwalk along the coast offering stunning sea views, sunset watching, and a relaxing walk.', established: 'Recent development', builtBy: 'Alcantara Municipal Government', detailedInfo: { overview: 'Sea Paradise Boardwalk is a modern coastal attraction in Alcantara.', culturalSignificance: "Represents Alcantara's development of coastal tourism infrastructure.", architectureOrBio: 'Modern boardwalk construction with sturdy materials designed to withstand coastal conditions.', currentStatus: 'Active tourism destination managed by local government.', visitorInfo: 'Open daily. About 1.5 hours from Cebu City. Best visited during late afternoon for sunset views.' }, culturalPractices: ['Sunset watching','Community gatherings','Photography','Coastal recreation'], nativeFloraFauna: ['Coastal vegetation','Seabirds','Marine life views','Mangrove species','Coastal plants'], preservation: 'Maintained by Alcantara Municipal Government', highlights: ['Coastal Views', 'Sunset Spot', 'Boardwalk'] },
    { id: 33, name: "Hermit's Cove", location: 'Aloguinsan, Cebu', category: 'Natural Heritage', lat: 10.2167, lng: 123.5500, image: 'src/image/hermits-cove.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Beach Cove', description: 'Hidden beach cove with pristine white sand, crystal-clear waters, and dramatic limestone cliffs.', established: 'Natural formation', builtBy: 'Natural coastal and geological processes', detailedInfo: { overview: "Hermit's Cove is a secluded beach destination in Aloguinsan, western Cebu.", culturalSignificance: "Represents the natural coastal beauty of western Cebu.", architectureOrBio: 'Healthy marine ecosystem with coral formations and diverse fish species.', currentStatus: 'Growing eco-tourism destination managed by local community.', visitorInfo: 'Open daily. Entrance fee: ₱50-100. About 2 hours from Cebu City.' }, culturalPractices: ['Cliff diving culture','Community-based tourism','Beach recreation','Environmental conservation'], nativeFloraFauna: ['Limestone cliff vegetation','Coastal fish species','Coral formations','Seabirds','Native coastal plants'], preservation: 'Managed by Aloguinsan local community and municipal tourism office', highlights: ['Hidden Cove', 'Cliff Diving', 'White Sand Beach'] },
    { id: 34, name: 'Buswang Lake', location: 'Asturias, Cebu', category: 'Natural Heritage', lat: 10.5500, lng: 123.7167, image: 'src/image/BuswangLake.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Lake', description: 'Serene mountain lake surrounded by lush forest, perfect for kayaking, fishing, and nature immersion.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: 'Buswang Lake is a tranquil freshwater lake nestled in the mountains of Asturias.', culturalSignificance: 'Important natural resource for the local communities of Asturias.', architectureOrBio: 'Freshwater ecosystem supporting various fish species.', currentStatus: 'Managed as a community eco-tourism destination.', visitorInfo: 'Open daily. Entrance fee: ₱50-100. About 2-2.5 hours from Cebu City.' }, culturalPractices: ['Traditional fishing','Community-based tourism','Lake conservation','Nature appreciation'], nativeFloraFauna: ['Freshwater fish species','Aquatic plants','Forest trees','Mountain birds','Native vegetation'], preservation: 'Managed by Asturias local community and municipal tourism office', highlights: ['Mountain Lake', 'Kayaking', 'Peaceful Retreat'] },
    { id: 35, name: 'Osmeña Peak', location: 'Badian, Cebu', category: 'Natural Heritage', lat: 9.8201, lng: 123.4424, image: 'src/image/osmena-peak.jpg', rating: 0, reviews: 0, era: 'Geological formation', heritageStatus: 'Natural Landmark', description: 'The highest peak in Cebu at 1,015 meters, offering panoramic views of jagged hills.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: 'Osmeña Peak is the highest point in Cebu Island at 1,015 meters above sea level.', culturalSignificance: 'Named after Sergio Osmeña Sr., the second President of the Philippines.', architectureOrBio: 'Cool highland climate supporting unique vegetation.', currentStatus: 'Popular hiking and camping destination.', visitorInfo: 'Open 24/7. Entrance fee: ₱30. Easy 20-minute hike from parking area. 3-4 hours from Cebu City.' }, culturalPractices: ['Eco-tourism','Hiking and camping culture','Photography tourism','Environmental awareness programs'], nativeFloraFauna: ['Pine trees','Highland grasses','Wildflowers','Mountain birds','Native shrubs'], preservation: 'Managed by Dalaguete Municipal Government with local community involvement', highlights: ['Highest Peak in Cebu', 'Jagged Hills', 'Sunrise/Sunset Views'] },
    { id: 36, name: 'Kawasan Falls', location: 'Badian, Cebu', category: 'Natural Heritage', lat: 9.8000, lng: 123.3670, image: 'src/image/kawasan-falls.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Protected Natural Area', description: 'A three-tiered waterfall system with turquoise blue waters, popular for canyoneering.', established: 'Natural formation', builtBy: 'Natural hydrological processes', detailedInfo: { overview: 'Kawasan Falls is a three-stage cascade of clear turquoise water located in Badian.', culturalSignificance: "One of Cebu's most iconic natural attractions.", architectureOrBio: 'Lush tropical forest surrounds the falls with diverse plant and animal life.', currentStatus: 'Major tourist destination with developed facilities.', visitorInfo: 'Open daily 6:00 AM to 5:00 PM. Entrance fee: ₱40. 3 hours from Cebu City.' }, culturalPractices: ['Adventure tourism','Canyoneering culture','Community-based tourism','Environmental conservation efforts'], nativeFloraFauna: ['Tropical forest trees','Bamboo groves','Ferns and mosses','Freshwater fish','Forest birds and butterflies'], preservation: 'Managed by Badian Municipal Government and local barangay with private operators', highlights: ['Three-Tiered Falls', 'Turquoise Waters', 'Canyoneering'] },
    { id: 37, name: 'St. Peter and Paul Apostle Parish', location: 'Bantayan, Cebu', category: 'Historical Heritage', lat: 11.1667, lng: 123.7167, image: 'src/image/St.PeterandPaulApostleParish.webp', rating: 0, reviews: 0, era: 'Spanish Colonial (1580s)', heritageStatus: 'National Cultural Treasure', description: 'One of the oldest coral stone churches in the Philippines, a stunning example of Spanish colonial religious architecture.', established: '1580s (completed 1878)', builtBy: 'Augustinian Friars and local community', detailedInfo: { overview: 'The Parish of Saints Peter and Paul in Bantayan is one of the oldest churches in Cebu.', culturalSignificance: 'A cornerstone of faith and identity for the Bantayanon people.', architectureOrBio: 'Constructed from coral stone blocks with thick fortress-like walls.', currentStatus: 'Active parish church serving the community of Bantayan.', visitorInfo: 'Open daily for masses and visitors. Free admission.' }, culturalPractices: ['Catholic masses and novenas','Holy Week processions','Bantayan Island Festival','Patron saint feast days','Baptisms and weddings'], nativeFloraFauna: ['Heritage coral stone walls','Church courtyard shade trees','Ornamental garden plants','Urban birds','Coastal island vegetation'], preservation: 'Maintained by the Diocese of San Carlos and the Parish of Saints Peter and Paul', highlights: ['16th Century Coral Stone Church', 'National Cultural Treasure', 'Spanish Colonial Architecture'] },
    { id: 38, name: 'Omagieca Mangrove Garden', location: 'Bantayan, Cebu', category: 'Natural Heritage', lat: 11.1700, lng: 123.7250, image: 'src/image/OmagiecaMangroveGarden.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Community-Managed Eco-Tourism Site', description: 'A thriving mangrove garden and eco-park along the Bantayan coastline, offering guided tours through lush mangrove forests.', established: 'Community-developed eco-tourism site', builtBy: 'Local Bantayan community and environmental advocates', detailedInfo: { overview: 'Omagieca Mangrove Garden is a community-managed coastal eco-park located in Bantayan, Cebu.', culturalSignificance: "Represents the Bantayanon community's deep commitment to coastal environmental stewardship.", architectureOrBio: 'The mangrove forest hosts a rich variety of coastal wildlife.', currentStatus: 'Actively managed by the local community.', visitorInfo: 'Open daily during daylight hours. Minimal entrance fee.' }, culturalPractices: ['Community-based eco-tourism','Coastal conservation and reforestation','Environmental education tours','Traditional coastal resource management'], nativeFloraFauna: ['Native mangrove species','Mudskippers and fiddler crabs','Wading and coastal birds','Juvenile marine fish','Coastal shellfish'], preservation: 'Managed by the local Bantayan community with support from Bantayan Municipal Government', highlights: ['Mangrove Boardwalk', 'Coastal Eco-Tourism', 'Community Conservation'] },
    { id: 39, name: 'Bantayan Island Nature Park & Resort', location: 'Bantayan Island, Cebu', category: 'Natural Heritage', lat: 11.1750, lng: 123.7350, image: 'src/image/resortbantayan.webp', rating: 0, reviews: 0, era: 'Modern (established resort and nature park)', heritageStatus: 'Nature Park and Eco-Resort', description: 'A sprawling nature park and resort on Bantayan Island featuring lush tropical gardens, pristine beachfront, and wildlife.', established: 'Modern development', builtBy: 'Private developers in partnership with local community', detailedInfo: { overview: 'Bantayan Island Nature Park & Resort is a premier eco-tourism destination on Bantayan Island.', culturalSignificance: "Has become one of Bantayan Island's signature attractions.", architectureOrBio: 'The nature park supports a diverse range of tropical flora.', currentStatus: 'Active nature park and resort open year-round.', visitorInfo: 'Open daily. Day tour and overnight accommodation packages available.' }, culturalPractices: ['Eco-tourism and nature walks','Environmental education programs','Sustainable resort practices','Community-integrated tourism'], nativeFloraFauna: ['Native tropical trees','Island bird species','Butterflies and pollinators','Coastal and marine life','Ornamental and native garden plants'], preservation: 'Maintained by private resort management in coordination with Bantayan Island local government', highlights: ['Nature Trails', 'Beachfront Park', 'Eco-Resort Experience'] },
    { id: 40, name: 'Mantayupan Falls', location: 'Barili, Cebu', category: 'Natural Heritage', lat: 10.1167, lng: 123.5333, image: 'src/image/mantayupanfalls-12-1024x767.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'One of the tallest waterfalls in Cebu, cascading dramatically down lush forest cliffs into a wide natural pool.', established: 'Natural formation', builtBy: 'Natural hydrological processes', detailedInfo: { overview: 'Mantayupan Falls is widely regarded as one of the tallest and most impressive waterfalls in Cebu.', culturalSignificance: 'A source of immense local pride for the people of Barili.', architectureOrBio: 'Native trees, ferns, mosses, and climbing plants thrive near the cascades.', currentStatus: 'Well-developed eco-tourism site managed by the Barili municipal government.', visitorInfo: 'Open daily 7:00 AM to 5:00 PM. Entrance fee: ₱30. About 2 hours from Cebu City.' }, culturalPractices: ['Community-based eco-tourism','Local guiding services','Environmental conservation','Summer recreation traditions'], nativeFloraFauna: ['Tropical forest trees','Native ferns and mosses','Freshwater fish and crustaceans','Forest birds and butterflies','Riparian vegetation'], preservation: 'Managed by Barili Municipal Tourism Office and local barangay government', highlights: ["One of Cebu's Tallest Falls", 'Natural Swimming Pool', 'Forest Setting'] },
    { id: 41, name: 'Sayaw Beach', location: 'Barili, Cebu', category: 'Natural Heritage', lat: 10.1083, lng: 123.5167, image: 'src/image/SayawBeach.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Coastal Attraction', description: 'A serene and relatively undiscovered beach in Barili featuring calm clear waters and peaceful atmosphere.', established: 'Natural formation', builtBy: 'Natural coastal and geological processes', detailedInfo: { overview: 'Sayaw Beach is a quiet and charming coastal destination in Barili.', culturalSignificance: 'An important recreational and livelihood area for the Barili coastal community.', architectureOrBio: 'The coastal waters support marine life including small reef fish and sea grass beds.', currentStatus: 'Emerging local beach destination managed by the Barili community.', visitorInfo: 'Open daily. About 2 hours from Cebu City. Best combined with Mantayupan Falls.' }, culturalPractices: ['Traditional coastal fishing','Community beach recreation','Local eco-tourism development','Sunset watching along Tañon Strait'], nativeFloraFauna: ['Coconut palms','Coastal shrubs and vegetation','Seabirds','Shallow marine fish','Seagrass beds'], preservation: 'Managed by Barili local community and municipal government', highlights: ['Quiet Beach Escape', 'Tañon Strait Views', 'Combine with Mantayupan Falls'] },
    { id: 42, name: 'Capitancillo Island', location: 'Bogo City, Cebu', category: 'Natural Heritage', lat: 11.0667, lng: 124.0167, image: 'src/image/CapitancilloIsland.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Marine Sanctuary and Bird Sanctuary', description: 'A tiny uninhabited island off the coast of Bogo City renowned as a world-class diving destination.', established: 'Natural formation — declared sanctuary', builtBy: 'Natural coral and geological formation', detailedInfo: { overview: 'Capitancillo Island is a small, uninhabited islet located off the northeastern coast of Bogo City.', culturalSignificance: 'A point of immense pride for Bogo City and northern Cebu.', architectureOrBio: 'The marine environment surrounding Capitancillo is exceptionally rich.', currentStatus: 'Protected marine and bird sanctuary with regulated access.', visitorInfo: 'Access via boat from Bogo City (approximately 30–45 minutes). Bogo City is approximately 3 hours from Cebu City.' }, culturalPractices: ['Scuba diving and snorkeling tourism','Marine conservation advocacy','Bird watching','Environmental research and monitoring'], nativeFloraFauna: ['Hard and soft coral formations','Thresher sharks and manta rays','Sea turtles','Diverse reef and pelagic fish','Nesting seabirds'], preservation: 'Managed by Bogo City Government and DENR as a protected marine and bird sanctuary', highlights: ['World-Class Dive Site', 'Marine Sanctuary', 'Thresher Sharks & Mantas'] },
    { id: 43, name: 'Shrine of Our Lady of Miraculous Medal', location: 'Bogo City, Cebu', category: 'Historical Heritage', lat: 11.0511, lng: 124.0103, image: 'src/image/ShrineofOurLadyofMiraculousMedal.webp', rating: 0, reviews: 0, era: 'Spanish Colonial heritage', heritageStatus: 'Religious Shrine and Pilgrimage Site', description: 'A beloved Catholic shrine in Bogo City dedicated to Our Lady of the Miraculous Medal.', established: 'Spanish Colonial period', builtBy: 'Catholic Church and Bogo City faithful community', detailedInfo: { overview: 'The Shrine of Our Lady of the Miraculous Medal in Bogo City is one of the most revered Catholic pilgrimage sites in northern Cebu.', culturalSignificance: 'The shrine is a cornerstone of Catholic faith and identity for the people of Bogo City.', architectureOrBio: 'The shrine features religious architecture consistent with Cebuano Catholic tradition.', currentStatus: 'Active pilgrimage site and place of worship with regular masses and novenas.', visitorInfo: 'Open daily for prayer and visitation. Free admission. Modest attire required.' }, culturalPractices: ['Marian devotion and novenas','Pilgrimage traditions','Candle lighting and prayer offerings','Feast day processions'], nativeFloraFauna: ['Shrine garden ornamentals','Shade trees in prayer grounds','Flowering devotional plants','Urban birds'], preservation: 'Maintained by the Catholic Parish of Bogo City and the Diocese of San Carlos', highlights: ['Marian Pilgrimage Site', 'Northern Cebu Devotion', 'Religious Heritage'] },
    { id: 44, name: 'Boljoon Heritage Museum', location: 'Boljoon, Cebu', category: 'Cultural Heritage', lat: 9.6333, lng: 123.4167, image: 'src/image/BoljoonHeritageMuseum.webp', rating: 0, reviews: 0, era: 'Spanish Colonial heritage', heritageStatus: 'Heritage Museum and Cultural Site', description: "A dedicated heritage museum in one of Cebu's oldest towns, preserving centuries of Boljoon's rich Spanish colonial history.", established: 'Modern museum established to preserve colonial-era heritage', builtBy: 'Boljoon Municipal Government and heritage conservation community', detailedInfo: { overview: "The Boljoon Heritage Museum is located in the municipality of Boljoon, one of the oldest and most historically significant towns in Cebu.", culturalSignificance: 'Boljoon is considered one of the best-preserved colonial towns in the Philippines.', architectureOrBio: 'The museum is housed in a heritage structure with exhibits arranged chronologically.', currentStatus: 'Active heritage museum open to the public.', visitorInfo: 'Open Monday to Friday, 8:00 AM to 5:00 PM. About 3.5-4 hours from Cebu City.' }, culturalPractices: ['Heritage education and cultural tours','Documentation of colonial-era traditions','Community heritage preservation','School and academic visits'], nativeFloraFauna: ['Heritage district shade trees','Ornamental garden plants','Colonial townscape flora','Urban birds'], preservation: 'Managed by Boljoon Municipal Government', highlights: ["Colonial Heritage Collection", "One of Cebu's Oldest Towns", 'Heritage Tourism Hub'] },
    { id: 45, name: 'Dayhag Falls', location: 'Boljoon, Cebu', category: 'Natural Heritage', lat: 9.6417, lng: 123.4250, image: 'src/image/DayhagFalls.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'A picturesque waterfall tucked in the forest hills of Boljoon, offering a cool and refreshing retreat.', established: 'Natural formation', builtBy: 'Natural hydrological processes', detailedInfo: { overview: 'Dayhag Falls is a scenic waterfall nestled in the forested interior of Boljoon.', culturalSignificance: "Dayhag Falls complements Boljoon's identity as a destination of both cultural and natural richness.", architectureOrBio: 'The watershed forest surrounding Dayhag Falls supports a healthy tropical ecosystem.', currentStatus: 'Emerging eco-tourism destination managed by the local community.', visitorInfo: 'Open daily. About 3.5-4 hours from Cebu City. Can be paired with the Boljoon Heritage Museum.' }, culturalPractices: ['Community eco-tourism','Local guiding services','Environmental conservation','Nature trekking culture'], nativeFloraFauna: ['Native tropical forest trees','Ferns and mosses','Freshwater fish and invertebrates','Forest birds and butterflies','Riparian vegetation'], preservation: 'Managed by Boljoon local community and municipal tourism office', highlights: ['Hidden Waterfall', 'Forest Trek', 'Pair with Boljoon Heritage Tour'] },
    { id: 46, name: 'Silmugi River Park', location: 'Borbon, Cebu', category: 'Natural Heritage', lat: 10.8333, lng: 124.0167, image: 'src/image/SilmugiRiverPark.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Community Nature Park', description: 'A scenic riverside nature park along the Silmugi River in Borbon, offering freshwater swimming and picnic areas.', established: 'Community-developed nature park', builtBy: 'Borbon local community and municipal government', detailedInfo: { overview: 'Silmugi River Park is a community-developed nature park situated along the banks of the Silmugi River.', culturalSignificance: 'The Silmugi River has long been an integral part of daily life for the Borbon community.', architectureOrBio: 'The Silmugi River and its surrounding riparian forest support a variety of freshwater species.', currentStatus: 'Active community-managed nature park open to the public.', visitorInfo: 'Open daily. About 2.5-3 hours from Cebu City via the north road.' }, culturalPractices: ['Community riverside recreation','Family picnic traditions','Environmental stewardship','Community-based eco-tourism'], nativeFloraFauna: ['Native riverbank trees','Freshwater fish and crustaceans','Aquatic insects','Riparian shrubs and grasses','River and forest birds'], preservation: 'Managed by Borbon local community and municipal government', highlights: ['Freshwater River Swimming', 'Riverside Picnic Park', 'Community Eco-Tourism'] },
    { id: 47, name: 'Torre de Borbon', location: 'Borbon, Cebu', category: 'Historical Heritage', lat: 10.8292, lng: 124.0089, image: 'src/image/TorredeBorbon.webp', rating: 0, reviews: 0, era: 'Spanish Colonial (17th-18th century)', heritageStatus: 'Heritage Watchtower - Historical Landmark', description: 'A remarkably preserved Spanish colonial watchtower standing as a sentinel over Borbon.', established: '17th-18th century Spanish colonial period', builtBy: 'Spanish colonial government with local labor', detailedInfo: { overview: "Torre de Borbon is a well-preserved Spanish colonial watchtower located in Borbon.", culturalSignificance: "The watchtower is a defining historical landmark of Borbon.", architectureOrBio: 'Constructed from coral stone and lime mortar in the traditional Spanish colonial military style.', currentStatus: 'Heritage structure accessible to the public.', visitorInfo: 'Accessible daily. Free admission. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Heritage tourism and historical education','Cultural landmark appreciation','Local history storytelling','Heritage conservation advocacy'], nativeFloraFauna: ['Coral stone heritage structure','Heritage site surrounding vegetation','Native shrubs and grasses','Urban and coastal birds'], preservation: 'Under Borbon Municipal Government with support from the National Historical Commission of the Philippines', highlights: ['Spanish Watchtower', 'Colonial Defense Architecture', 'Northern Cebu Heritage'] },
    { id: 48, name: 'Cebu Safari and Adventure Park', location: 'Carmen, Cebu', category: 'Cultural Heritage', lat: 10.5833, lng: 124.0167, image: 'src/image/CebuSafariandAdventurePark.webp', rating: 0, reviews: 0, era: 'Modern (opened 2018)', heritageStatus: 'Wildlife Park and Eco-Tourism Destination', description: 'The largest zoological park in the Philippines, home to hundreds of animal species from across the world.', established: '2018', builtBy: 'Cebu Safari and Adventure Park developers', detailedInfo: { overview: "Cebu Safari and Adventure Park is the largest zoological and wildlife park in the Philippines.", culturalSignificance: "A landmark achievement for Cebu and the Philippines.", architectureOrBio: "The park is designed as a sprawling open-air wildlife reserve with themed zones.", currentStatus: "One of the premier tourist attractions in Cebu and the Philippines.", visitorInfo: "Open daily 8:00 AM to 5:00 PM. Entrance fee approximately ₱800–₱1,500. About 1.5-2 hours from Cebu City." }, culturalPractices: ['Wildlife conservation education','Safari and nature tourism','Environmental awareness programs','Family and school visits'], nativeFloraFauna: ['African savanna animals','Asian wildlife','Native Philippine species','Tropical park vegetation','Free-roaming bird species'], preservation: 'Managed by Cebu Safari and Adventure Park with international wildlife conservation partnerships', highlights: ["Largest Zoo in the Philippines", 'Open Safari Drive', 'Hundreds of Animal Species'] },
    { id: 49, name: 'Middle Earth Mountain Resort', location: 'Carmen, Cebu', category: 'Natural Heritage', lat: 10.5750, lng: 124.0083, image: 'src/image/MiddleEarthMountainResort.webp', rating: 0, reviews: 0, era: 'Modern resort development', heritageStatus: 'Mountain Eco-Resort', description: 'A fantasy-themed mountain resort perched in the scenic hills of Carmen, offering breathtaking panoramic views.', established: 'Modern development', builtBy: 'Private resort developers', detailedInfo: { overview: "Middle Earth Mountain Resort is a uniquely themed highland retreat nestled in the hills of Carmen.", culturalSignificance: "Represents the creative evolution of Cebu's tourism landscape.", architectureOrBio: 'The resort features fantasy-inspired architecture including hobbit-hole accommodations.', currentStatus: 'Active mountain resort open for day tours and overnight stays.', visitorInfo: 'Open daily. Located in the hills of Carmen, approximately 1.5-2 hours from Cebu City.' }, culturalPractices: ['Mountain eco-tourism','Themed resort and nature experience','Romantic and leisure getaways','Highland photography'], nativeFloraFauna: ['Highland tropical vegetation','Ornamental garden plants','Mountain birds','Native highland flora','Butterfly species'], preservation: 'Maintained by private resort management', highlights: ['Hobbit-Themed Accommodations', 'Panoramic Mountain Views', 'Highland Nature Retreat'] },
    { id: 50, name: 'Mt. Kapayas (Lantawan Peak)', location: 'Catmon, Cebu', category: 'Natural Heritage', lat: 10.7167, lng: 123.9833, image: 'src/image/MtKapayas.webp', rating: 0, reviews: 0, era: 'Natural/Geological formation', heritageStatus: 'Natural Landmark and Hiking Destination', description: 'A scenic mountain peak in Catmon offering sweeping panoramic views of northern Cebu and neighboring islands.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: "Mt. Kapayas, also known as Lantawan Peak, is a prominent mountain summit in Catmon.", culturalSignificance: "Mt. Kapayas holds a special place in the hearts of Catmon residents.", architectureOrBio: 'The slopes of Mt. Kapayas are blanketed in tropical forest and grassland vegetation.', currentStatus: 'Active hiking and eco-tourism destination.', visitorInfo: 'Best started early morning (4:00–5:00 AM) for sunrise. About 2-2.5 hours from Cebu City.' }, culturalPractices: ['Eco-trekking and hiking culture','Sunrise viewing traditions','Community guiding','Environmental conservation'], nativeFloraFauna: ['Highland tropical forest trees','Summit grassland vegetation','Native shrubs and wildflowers','Mountain bird species','Forest insects'], preservation: 'Managed by Catmon Municipal Government and local community guides', highlights: ['Panoramic 360° Views', 'Northern Cebu Sunrise Trek', 'Island and Sea Vistas'] },
    { id: 51, name: 'Tinubdan Falls', location: 'Catmon, Cebu', category: 'Natural Heritage', lat: 10.7083, lng: 123.9750, image: 'src/image/TinubdanFalls.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Landmark', description: 'A beautiful multi-layered waterfall cascading through the lush forest of Catmon with cool natural pools.', established: 'Natural formation', builtBy: 'Natural hydrological processes', detailedInfo: { overview: "Tinubdan Falls is a scenic waterfall destination in Catmon municipality.", culturalSignificance: "Tinubdan Falls is an important natural asset for the Catmon community.", architectureOrBio: 'The watershed forest surrounding Tinubdan Falls supports a healthy tropical ecosystem.', currentStatus: 'Community-managed eco-tourism destination open to visitors.', visitorInfo: 'Open daily. About 2-2.5 hours from Cebu City. Pairs with Mt. Kapayas trek.' }, culturalPractices: ['Community eco-tourism','Freshwater swimming traditions','Environmental conservation','Nature trekking'], nativeFloraFauna: ['Native tropical forest trees','Ferns, mosses, and climbing plants','Freshwater fish and crustaceans','Forest birds','Riparian vegetation'], preservation: 'Managed by Catmon local community and municipal tourism office', highlights: ['Multi-Layered Waterfall', 'Natural Swimming Pools', 'Pair with Mt. Kapayas Trek'] },
    { id: 52, name: 'Paradise Hills Mountain Resort', location: 'Compostela, Cebu', category: 'Natural Heritage', lat: 10.4583, lng: 124.0083, image: 'src/image/ParadiseHillsMountainResort.webp', rating: 0, reviews: 0, era: 'Modern resort development', heritageStatus: 'Mountain Eco-Resort', description: 'A lush mountain resort in Compostela featuring verdant hillside gardens, refreshing pools, ziplines, and sweeping views.', established: 'Modern development', builtBy: 'Private resort developers', detailedInfo: { overview: 'Paradise Hills Mountain Resort is a sprawling highland retreat in Compostela.', culturalSignificance: 'Paradise Hills has played a significant role in establishing Compostela as a highland tourism destination.', architectureOrBio: 'The resort is designed around the natural contours of the hillside.', currentStatus: 'Fully operational highland resort popular for day tours and overnight stays.', visitorInfo: 'Open daily. About 45 minutes to 1 hour from Cebu City.' }, culturalPractices: ['Highland leisure and recreation','Family and group eco-tourism','Team building and events','Nature appreciation'], nativeFloraFauna: ['Tropical garden plants','Highland native trees','Mountain bird species','Flowering species','Butterfly visitors'], preservation: 'Maintained by private resort management', highlights: ['Hillside Gardens & Pools', 'Zipline Adventure', 'Panoramic Countryside Views'] },
    { id: 53, name: 'Estaca Bay Gardens Conference Resort', location: 'Compostela, Cebu', category: 'Natural Heritage', lat: 10.4500, lng: 124.0167, image: 'src/image/EstacaBayGardensConferenceResort.webp', rating: 0, reviews: 0, era: 'Modern resort development', heritageStatus: 'Bay Garden Resort and Conference Center', description: 'A tranquil garden resort and conference center in Compostela overlooking the scenic Estaca Bay.', established: 'Modern development', builtBy: 'Private resort and conference center developers', detailedInfo: { overview: 'Estaca Bay Gardens Conference Resort is a peaceful and beautifully landscaped resort in Compostela.', culturalSignificance: 'Represents the development of Compostela as a versatile tourism and MICE destination.', architectureOrBio: 'The resort features well-maintained tropical garden landscapes with coastal-facing structures.', currentStatus: 'Fully operational resort and conference center.', visitorInfo: 'Open daily. About 45 minutes to 1 hour from Cebu City.' }, culturalPractices: ['Corporate events and MICE tourism','Garden leisure and relaxation','Coastal nature appreciation','Team building'], nativeFloraFauna: ['Tropical garden ornamentals','Coastal vegetation','Bay and coastal bird species','Flowering plants','Marine life in Estaca Bay'], preservation: 'Maintained by private resort management', highlights: ['Bay View Garden Resort', 'Conference & Events Venue', 'Tropical Garden Retreat'] },
    { id: 54, name: 'Cascades Nature Park', location: 'Compostela, Cebu', category: 'Natural Heritage', lat: 10.4667, lng: 123.9917, image: 'src/image/CascadesNaturePark.webp', rating: 0, reviews: 0, era: 'Natural formation with developed eco-park', heritageStatus: 'Nature Park and Eco-Tourism Site', description: 'A stunning nature park in Compostela built around natural cascading waterfalls and pools, offering swimming and cliff jumping.', established: 'Community and private eco-park development', builtBy: 'Private developers in partnership with local community', detailedInfo: { overview: "Cascades Nature Park is one of Compostela's most exciting natural attractions.", culturalSignificance: 'Cascades Nature Park represents the successful development of natural water resources.', architectureOrBio: 'The natural waterfall and forest ecosystem supports rich tropical biodiversity.', currentStatus: 'Active and well-maintained eco-tourism park open year-round.', visitorInfo: 'Open daily 7:00 AM to 5:00 PM. About 45 minutes to 1 hour from Cebu City.' }, culturalPractices: ['Eco-tourism and nature park visits','Cliff jumping and adventure culture','Family and group recreational swimming','Environmental conservation awareness'], nativeFloraFauna: ['Native tropical forest trees','Ferns, mosses, and understory plants','Freshwater fish and crustaceans','Forest birds and butterflies','Natural cascade ecosystem'], preservation: 'Managed by private park operators in coordination with Compostela Municipal Government', highlights: ['Natural Cascading Waterfalls', 'Cliff Jumping', 'Crystal-Clear Swimming Pools'] },
    { id: 55, name: 'Valentin Farm Resort', location: 'Consolacion, Cebu', category: 'Natural Heritage', lat: 10.3833, lng: 123.9583, image: 'src/image/Valentin-Farm-Resort.webp', rating: 0, reviews: 0, era: 'Modern agri-tourism development', heritageStatus: 'Agri-Tourism Farm Resort', description: 'A charming farm resort in Consolacion blending agriculture, nature, and leisure.', established: 'Modern agri-tourism development', builtBy: 'Private farm resort developers', detailedInfo: { overview: 'Valentin Farm Resort is a delightful agri-tourism destination in Consolacion.', culturalSignificance: "Represents the growing agri-tourism movement in Cebu.", architectureOrBio: 'The resort is designed around a working farm aesthetic.', currentStatus: 'Fully operational agri-tourism resort.', visitorInfo: 'Open daily. About 30-45 minutes from Cebu City.' }, culturalPractices: ['Agri-tourism and farm education','Farm animal interaction','Family outdoor recreation','Agricultural heritage appreciation'], nativeFloraFauna: ['Farm animals','Garden ornamental plants','Fruit trees and vegetables','Native farm birds','Tropical garden flora'], preservation: 'Maintained by private farm resort management', highlights: ['Farm Animal Interactions', 'Agri-Tourism Experience', 'Family-Friendly Resort'] },
    { id: 56, name: 'Snake Road (Kabaskug Road)', location: 'Consolacion, Cebu', category: 'Cultural Heritage', lat: 10.3917, lng: 123.9500, image: 'src/image/Snakeroad.jpg', rating: 0, reviews: 0, era: 'Modern engineering landmark', heritageStatus: 'Scenic Road and Engineering Landmark', description: 'A famous serpentine mountain road in Consolacion known for its dramatic winding curves and panoramic views.', established: 'Modern road development', builtBy: 'Cebu provincial and local government engineering', detailedInfo: { overview: "Snake Road, locally known as Kabaskug Road, is one of Consolacion's most iconic landmarks.", culturalSignificance: "Snake Road has become deeply embedded in the local identity of Consolacion.", architectureOrBio: 'The road features a series of sharp hairpin turns engineered through challenging hillside terrain.', currentStatus: 'Active public road open 24 hours.', visitorInfo: 'Open 24 hours — free access. About 30-45 minutes from Cebu City.' }, culturalPractices: ['Scenic driving and motorcycle touring','Morning jogging and cycling','Sunrise and city lights viewing','Landscape photography'], nativeFloraFauna: ['Roadside tropical vegetation','Hillside shrubs and grasses','Native trees along the route','Highland birds','Butterflies and insects'], preservation: 'Maintained by Consolacion Municipal Government and Cebu Provincial Engineering Office', highlights: ['Serpentine Mountain Road', 'Panoramic City & Sea Views', 'Iconic Photo Landmark'] },
    { id: 57, name: '10,000 Roses Cafe & More', location: 'Cordova, Cebu', category: 'Cultural Heritage', lat: 10.2583, lng: 123.9583, image: 'src/image/10,000Roses.webp', rating: 0, reviews: 0, era: 'Modern (2016)', heritageStatus: 'Iconic Tourist Landmark and Cafe', description: "Cebu's most photographed Instagram landmark — thousands of white LED roses that glow brilliantly at night.", established: '2016', builtBy: 'Private developers and Cordova local government', detailedInfo: { overview: '10,000 Roses Cafe & More is one of the most iconic tourist attractions in Cebu.', culturalSignificance: 'Since its opening in 2016, it has become a defining cultural and tourism landmark of Cordova.', architectureOrBio: 'The installation features thousands of white artificial roses with LED lights.', currentStatus: "Active tourist attraction and cafe open daily.", visitorInfo: 'Open daily approximately 4:00 PM to 10:00 PM. Entrance fee approximately ₱50–100.' }, culturalPractices: ['Romantic date and leisure outings','Social media and travel photography','Evening seaside recreation','Community tourism'], nativeFloraFauna: ['Artificial LED rose installation','Coastal seaside vegetation','Seabirds','Ornamental garden plants','Coastal marine views'], preservation: 'Maintained by private management in coordination with Cordova Municipal Government', highlights: ['10,000 LED Roses at Night', 'Iconic Cebu Photo Landmark', 'Romantic Seaside Cafe'] },
    { id: 58, name: 'Malapascua Island', location: 'Daanbantayan, Cebu', category: 'Natural Heritage', lat: 11.3333, lng: 124.1167, image: 'src/image/MalapascuaIsland.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'World-Class Marine Sanctuary and Island Destination', description: 'A world-famous tiny island at the northern tip of Cebu, globally renowned for thresher shark encounters.', established: 'Natural island — internationally recognized dive destination', builtBy: 'Natural coral and geological formation', detailedInfo: { overview: 'Malapascua Island is a small, stunning island at the northernmost tip of Cebu.', culturalSignificance: 'Malapascua holds extraordinary significance for Philippine and global marine conservation.', architectureOrBio: 'The waters surrounding Malapascua are extraordinarily biodiverse.', currentStatus: 'Established world-class dive and island tourism destination.', visitorInfo: 'Access via boat from Maya Port in Daanbantayan (approximately 30 minutes). About 4 hours from Cebu City.' }, culturalPractices: ['World-class scuba diving','Thresher shark dive expeditions','Marine conservation','Island beach culture'], nativeFloraFauna: ['Thresher sharks at Monad Shoal','Manta rays and reef sharks','Diverse coral reef ecosystems','Marine turtles','Tropical reef fish'], preservation: 'Managed by Daanbantayan Municipal Government and marine conservation organizations', highlights: ['Thresher Shark Diving', 'World-Class Dive Site', 'White Sand Beach Island'] },
    { id: 59, name: 'Carnaza Island', location: 'Daanbantayan, Cebu', category: 'Natural Heritage', lat: 11.4333, lng: 124.0500, image: 'src/image/Carnaza-Island-1-1024x576.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Island and Marine Sanctuary', description: 'A pristine and largely undiscovered island north of Cebu featuring dramatic limestone cliffs, white sand beaches, and caves.', established: 'Natural island formation', builtBy: 'Natural coral, limestone, and geological formation', detailedInfo: { overview: 'Carnaza Island is a breathtaking island gem north of Malapascua.', culturalSignificance: 'Carnaza Island represents the last frontier of undiscovered island tourism in Cebu.', architectureOrBio: "Carnaza's marine and terrestrial ecosystems are exceptionally well-preserved.", currentStatus: 'Emerging eco-tourism destination with very limited development.', visitorInfo: 'Access via boat from Maya Port (approximately 1.5-2 hours). About 4 hours from Cebu City.' }, culturalPractices: ['Adventure island exploration','Cave exploration and spelunking','Traditional fishing community culture','Eco-tourism and responsible travel'], nativeFloraFauna: ['Pristine coral reef ecosystems','Sea turtles and marine life','Limestone cave fauna','Native coastal vegetation','Diverse reef fish'], preservation: 'Managed by local island community with Daanbantayan Municipal Government oversight', highlights: ['Pristine Limestone Island', 'Hidden Coves & Caves', 'Untouched Coral Reefs'] },
    { id: 60, name: 'Obong Spring', location: 'Dalaguete, Cebu', category: 'Natural Heritage', lat: 9.7583, lng: 123.5333, image: 'src/image/Obong+Spring+Dalaguete+Cebu.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Spring and Eco-Tourism Site', description: 'A stunning natural spring in Dalaguete featuring crystal-clear, emerald-green waters surrounded by lush forest.', established: 'Natural formation', builtBy: 'Natural geological and hydrological processes', detailedInfo: { overview: "Obong Spring is one of southern Cebu's most beautiful natural attractions.", culturalSignificance: 'Obong Spring holds deep importance for the Dalaguete community.', architectureOrBio: 'The spring and its surrounding environment support a rich freshwater and forest ecosystem.', currentStatus: 'Community-managed eco-tourism destination open to visitors.', visitorInfo: 'Open daily. About 3-3.5 hours from Cebu City. Combine with Osmeña Peak.' }, culturalPractices: ['Community freshwater swimming','Eco-tourism and nature appreciation','Environmental conservation','Local guiding services'], nativeFloraFauna: ['Emerald-green spring ecosystem','Native freshwater fish','Forest ferns, mosses, and trees','Aquatic plants','Forest birds and butterflies'], preservation: 'Managed by Dalaguete local community and municipal tourism office', highlights: ['Emerald-Green Natural Spring', 'Crystal-Clear Swimming Pool', 'Lush Forest Setting'] },
    { id: 61, name: 'Dalaguete Beach Park', location: 'Dalaguete, Cebu', category: 'Natural Heritage', lat: 9.7617, lng: 123.5417, image: 'src/image/DalagueteBeachPark.webp', rating: 0, reviews: 0, era: 'Natural formation with developed park facilities', heritageStatus: 'Municipal Beach Park', description: 'A well-maintained municipal beach park along the southern Cebu coastline with beautiful Tañon Strait views.', established: 'Municipal park development', builtBy: 'Dalaguete Municipal Government', detailedInfo: { overview: 'Dalaguete Beach Park is a well-maintained municipal coastal park along the Tañon Strait.', culturalSignificance: "Dalaguete Beach Park is an important community recreational space.", architectureOrBio: 'The coastal waters support marine life and the Tañon Strait is a protected seascape.', currentStatus: 'Active municipal beach park open to the public.', visitorInfo: 'Open daily. About 3-3.5 hours from Cebu City. Combine with Obong Spring and Osmeña Peak.' }, culturalPractices: ['Community beach recreation','Family picnic gatherings','Sunset watching over Tañon Strait','Municipal public park culture'], nativeFloraFauna: ['Coconut palms and coastal vegetation','Seabirds','Nearshore marine fish','Seagrass beds','Tañon Strait marine biodiversity'], preservation: 'Maintained by Dalaguete Municipal Government', highlights: ['Tañon Strait Coastal Views', 'Clean Municipal Beach', 'Pair with Osmeña Peak & Obong Spring'] },
    { id: 62, name: 'Danasan Eco Adventure Park', location: 'Danao City, Cebu', category: 'Natural Heritage', lat: 10.5167, lng: 124.0333, image: 'src/image/DanasanEcoAdventureParkTicketinCebu.webp', rating: 0, reviews: 0, era: 'Modern eco-adventure park development', heritageStatus: 'Eco-Adventure Park and Nature Reserve', description: "One of Cebu's premier adventure destinations in the highlands of Danao City, offering ziplines, rappelling, ATV rides, and river trekking.", established: 'Modern development', builtBy: 'Private developers in partnership with Danao City Government', detailedInfo: { overview: 'Danasan Eco Adventure Park is one of the most thrilling eco-adventure destinations in Cebu.', culturalSignificance: 'Danasan has significantly elevated the tourism profile of Danao City.', architectureOrBio: 'The park is set within a highland forest ecosystem with rich tropical biodiversity.', currentStatus: 'Fully operational eco-adventure park open year-round.', visitorInfo: 'Open daily 7:00 AM to 5:00 PM. About 1.5-2 hours from Cebu City.' }, culturalPractices: ['Eco-adventure and extreme sports tourism','Corporate team building','Outdoor camping','Environmental education'], nativeFloraFauna: ['Highland tropical forest trees','Freshwater river ecosystem','Forest birds and wildlife','Native ferns','Mountain stream fauna'], preservation: 'Managed by private park operators in coordination with Danao City Government', highlights: ['Zipline & Rappelling', 'River Trekking Adventure', 'Highland Camping'] },
    { id: 63, name: 'Mount Manghilao', location: 'Danao City, Cebu', category: 'Natural Heritage', lat: 10.5250, lng: 124.0167, image: 'src/image/Mount-Manghilao.webp', rating: 0, reviews: 0, era: 'Natural/Geological formation', heritageStatus: 'Natural Mountain Landmark and Hiking Destination', description: 'A rewarding mountain trek in the highlands of Danao City offering panoramic views of the Cebu coastline.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: 'Mount Manghilao is a notable mountain summit in the highlands of Danao City.', culturalSignificance: 'Mount Manghilao is an important natural landmark for Danao City.', architectureOrBio: 'The slopes support a diverse highland ecosystem.', currentStatus: 'Active hiking destination with maintained trails.', visitorInfo: 'Best started early morning. About 1.5-2 hours from Cebu City. Pairs with Danasan Eco Adventure Park.' }, culturalPractices: ['Mountain trekking and hiking','Sunrise summit viewing','Community guiding','Environmental conservation'], nativeFloraFauna: ['Tropical highland forest trees','Summit grasslands','Native wildflowers','Mountain birds','Forest insects'], preservation: 'Managed by Danao City Tourism Office and local community guides', highlights: ['Panoramic Summit Views', 'Camotes Sea Vistas', 'Pair with Danasan Adventure Park'] },
    { id: 64, name: 'Malubog Lake', location: 'Toledo City, Cebu', category: 'Natural Heritage', lat: 10.3833, lng: 123.6333, image: 'src/image/Malubog-Lake.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Lake and Watershed Reserve', description: 'A serene and picturesque freshwater lake nestled in the mountains of Toledo City, surrounded by lush forest.', established: 'Natural formation', builtBy: 'Natural geological and hydrological processes', detailedInfo: { overview: 'Malubog Lake is a tranquil freshwater lake in the mountainous interior of Toledo City.', culturalSignificance: 'Malubog Lake holds significant importance for Toledo City as a critical watershed resource.', architectureOrBio: 'The lake ecosystem supports freshwater fish species and aquatic plants.', currentStatus: 'Managed eco-tourism destination with basic facilities.', visitorInfo: 'Open daily. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Freshwater kayaking and boating','Traditional fishing','Nature picnicking','Watershed conservation'], nativeFloraFauna: ['Freshwater fish','Aquatic plants','Native highland forest trees','Forest birds','Lakeshore vegetation'], preservation: 'Managed by Toledo City Government with DENR oversight for watershed protection', highlights: ['Scenic Mountain Lake', 'Kayaking & Fishing', 'Highland Forest Setting'] },
    { id: 65, name: 'Biga Pit (Berong Open Pit Mine)', location: 'Toledo City, Cebu', category: 'Cultural Heritage', lat: 10.3667, lng: 123.6500, image: 'src/image/Biga-Pit.webp', rating: 0, reviews: 0, era: 'Industrial heritage (operated since 1955)', heritageStatus: 'Industrial Heritage and Mining Tourism Site', description: 'One of the largest open-pit copper mines in Southeast Asia and a remarkable industrial heritage landmark.', established: '1955 (Carmen Copper Corporation)', builtBy: 'Carmen Copper Corporation (formerly Atlas Consolidated Mining)', detailedInfo: { overview: 'Biga Pit is one of the largest open-pit copper mines in Southeast Asia, in Toledo City.', culturalSignificance: "Biga Pit is inseparable from the history and identity of Toledo City.", architectureOrBio: 'The open pit is a massive terraced excavation carved into the earth over decades.', currentStatus: 'Active mining operation with regulated mining tourism program.', visitorInfo: 'Tours organized through Carmen Copper Corporation. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Industrial heritage and mining tourism','Educational mine site visits','Community relations','Mining history documentation'], nativeFloraFauna: ['Surrounding western Cebu hill vegetation','Rehabilitation plantings','Birds adapting to industrial landscape','Native shrubs','Tailings area revegetation'], preservation: 'Managed by Carmen Copper Corporation under DENR environmental compliance', highlights: ['Largest Open-Pit Copper Mine in SE Asia', 'Industrial Heritage Tourism', 'Dramatic Mining Landscape'] },
    { id: 66, name: 'Mount Tagaytay (Toledo)', location: 'Toledo City, Cebu', category: 'Natural Heritage', lat: 10.3500, lng: 123.6167, image: 'src/image/Mount-Tagaytay-Toledo.webp', rating: 0, reviews: 0, era: 'Natural/Geological formation', heritageStatus: 'Natural Mountain Landmark and Hiking Destination', description: 'A majestic mountain peak in Toledo City offering breathtaking views of both coasts of Cebu Island.', established: 'Natural formation', builtBy: 'Natural geological processes', detailedInfo: { overview: 'Mount Tagaytay in Toledo City is one of the most rewarding mountain trekking destinations in Cebu.', culturalSignificance: 'Mount Tagaytay is a source of deep pride for Toledo City.', architectureOrBio: "The mountain's diverse elevation zones support a range of vegetation types.", currentStatus: 'Active trekking destination with established trails.', visitorInfo: 'Best started early (3:00–4:00 AM) for sunrise. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Mountain trekking and summit hiking','Sunrise and dual-coast panorama viewing','Community eco-tourism','Environmental conservation'], nativeFloraFauna: ['Montane forest and grassland','Native highland trees','Summit wildflowers','Mountain birds','Forest wildlife'], preservation: 'Managed by Toledo City Tourism Office with DENR coordination', highlights: ['Dual Coast Panorama', 'East & West Cebu Views', 'Dramatic Highland Trek'] },
    { id: 67, name: 'Lapos-Lapos Cave', location: 'Toledo City, Cebu', category: 'Natural Heritage', lat: 10.3750, lng: 123.6417, image: 'src/image/Lapos-Lapos-Cave.webp', rating: 0, reviews: 0, era: 'Natural formation', heritageStatus: 'Natural Cave System', description: 'A fascinating cave system in the limestone hills of Toledo City featuring dramatic stalactite and stalagmite formations.', established: 'Natural formation', builtBy: 'Natural karst and limestone geological processes', detailedInfo: { overview: 'Lapos-Lapos Cave is a notable natural cave system in the limestone terrain of Toledo City.', culturalSignificance: "Lapos-Lapos Cave adds a distinctive dimension to Toledo City's tourism landscape.", architectureOrBio: 'The cave interior provides habitat for cave-adapted species including bats.', currentStatus: 'Accessible cave tourism site with local guide services.', visitorInfo: 'Access with local guide required. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Spelunking and cave exploration','Geological heritage education','Community guide services','Cave ecosystem conservation'], nativeFloraFauna: ['Cave bat colonies','Cave insects and spiders','Moss and cave entrance vegetation','Stalactite formations','Cave microorganism ecosystems'], preservation: 'Managed by local barangay and Toledo City Government', highlights: ['Stalactite & Stalagmite Formations', 'Spelunking Adventure', 'Western Cebu Cave System'] },
    { id: 68, name: 'Capilla Santa Ana Museum', location: 'Toledo City, Cebu', category: 'Historical Heritage', lat: 10.3783, lng: 123.6367, image: 'src/image/Capilla-Santa-Ana-Museum.webp', rating: 0, reviews: 0, era: 'Spanish Colonial heritage', heritageStatus: 'Heritage Chapel and Museum', description: 'A beautifully preserved Spanish colonial chapel and heritage museum in Toledo City housing centuries-old religious artifacts.', established: 'Spanish Colonial period', builtBy: 'Spanish colonial Catholic Church and Toledo community', detailedInfo: { overview: 'The Capilla Santa Ana Museum is a significant heritage site in Toledo City.', culturalSignificance: "The Capilla Santa Ana Museum is a vital repository of Toledo City's colonial religious heritage.", architectureOrBio: 'The chapel features Spanish colonial ecclesiastical architecture.', currentStatus: 'Active chapel and functioning heritage museum open to visitors.', visitorInfo: 'Open during regular hours. About 2.5-3 hours from Cebu City.' }, culturalPractices: ['Catholic heritage and devotional visits','Heritage museum education','Cultural artifact preservation','Historical documentation'], nativeFloraFauna: ['Chapel courtyard plants','Heritage structure vegetation','Ornamental religious garden flora','Urban birds'], preservation: 'Maintained by Toledo City parish and heritage conservation volunteers', highlights: ['Spanish Colonial Chapel', 'Religious Heritage Museum', 'Toledo City History Collection'] },
    { id: 69, name: 'Puting Bato', location: 'Toledo City, Cebu', category: 'Natural Heritage', lat: 10.3467, lng: 123.5783, image: 'src/image/Puting-Bato.webp', rating: 0, reviews: 0, era: 'Natural/Geological formation', heritageStatus: 'Natural Geological Landmark', description: "A striking white monolith and natural geological landmark rising dramatically from Toledo City's landscape.", established: 'Natural formation — revered since the Spanish colonial era', builtBy: 'Natural limestone geological processes', detailedInfo: { overview: "Puting Bato, meaning 'White Rock' in Cebuano, is a remarkable natural monolith in Toledo City.", culturalSignificance: 'Puting Bato holds deep cultural, historical, and spiritual significance for Toledo City.', architectureOrBio: 'The limestone monolith supports vegetation adapted to rocky, calcium-rich terrain.', currentStatus: 'Natural landmark accessible to visitors.', visitorInfo: 'About 2.5-3 hours from Cebu City. Best combined with other Toledo City attractions.' }, culturalPractices: ['Local heritage and sacred site veneration','Community identity traditions','Folk legend and oral history','Heritage tourism'], nativeFloraFauna: ['Limestone-adapted native plants','Rocky terrain shrubs','Lizards and rock-dwelling fauna','Native birds','Pioneer vegetation'], preservation: 'Under the stewardship of Barangay Puting Bato and Toledo City Government', highlights: ['Iconic White Limestone Monolith', 'Sacred Community Landmark', 'Lutopan Heritage Site'] },
  ];


  // ── Merge: hardcoded + Firestore (deduplicate by name) ──
  const allSites = [
    ...cebuSites,
    ...firestoreSites.filter(fs =>
      !cebuSites.some(cs => cs.name.toLowerCase() === fs.name.toLowerCase())
    ),
  ];

  const officialCities = [
    'Bogo City','Carcar City','Cebu City','Danao City','Lapu-Lapu City','Mandaue City','Naga City','Talisay City','Toledo City',
    'Alcantara','Alcoy','Alegria','Aloguinsan','Argao','Asturias','Badian','Balamban','Bantayan','Barili','Boljoon','Borbon',
    'Carmen','Catmon','Compostela','Consolacion','Cordova','Daanbantayan','Dalaguete','Dumanjug','Ginatilan','Liloan',
    'Madridejos','Malabuyoc','Medellin','Minglanilla','Moalboal','Oslob','Pilar','Pinamungajan','Poro','Ronda','Samboan',
    'San Fernando','San Francisco','San Remigio','Santa Fe','Santander','Sibonga','Sogod','Tabogon','Tabuelan','Tuburan','Tudela'
  ];

  const destinationCities = allSites.map(d => d.location.split(',')[0].trim());
  const allCities = Array.from(new Set([...officialCities, ...destinationCities])).sort();
  
  const cities = [
    { id: 'all', label: 'All Cities and Municipalities' },
    ...allCities.map(city => ({ id: city, label: city }))
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

  // ── Use allSites instead of cebuSites for filtering ──
  const filteredDestinations = allSites
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      const siteCity = d.location.split(',')[0].trim();
      const matchesCity = selectedCity === 'all' || siteCity === selectedCity;
      return matchesSearch && matchesCategory && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        const countA = siteAvgRatings[a.name]?.count ?? 0;
        const countB = siteAvgRatings[b.name]?.count ?? 0;
        return countB - countA;
      }
      if (sortBy === 'rating') {
        const avgA = parseFloat(siteAvgRatings[a.name]?.avg ?? 0);
        const avgB = parseFloat(siteAvgRatings[b.name]?.avg ?? 0);
        if (avgB === avgA) {
          const countA = siteAvgRatings[a.name]?.count ?? 0;
          const countB = siteAvgRatings[b.name]?.count ?? 0;
          return countB - countA;
        }
        return avgB - avgA;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const goToMapLocation = (dest) => {
    const destinationForExplore = {
      id: dest.id, name: dest.name, location: dest.location, lat: dest.lat, lng: dest.lng,
      image: dest.image || dest.imageUrl, description: dest.description, category: dest.category,
      heritageStatus: dest.heritageStatus, era: dest.era, region: dest.region,
      established: dest.established, builtBy: dest.builtBy, detailedInfo: dest.detailedInfo,
      culturalPractices: dest.culturalPractices, nativeFloraFauna: dest.nativeFloraFauna,
      preservation: dest.preservation, highlights: dest.highlights || [], source: dest.source || undefined,
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
      {/* Hero Section */}
      <div 
        className="position-relative overflow-hidden"
        style={{ height: '400px', backgroundImage: 'url(src/image/cebu-skyline.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.92) 0%, rgba(44, 82, 130, 0.88) 50%, rgba(26, 54, 93, 0.90) 100%)' }}
        />
        <div className="position-relative h-100 d-flex align-items-center justify-content-center text-center text-white px-4" style={{ zIndex: 1 }}>
          <div style={{ maxWidth: '800px', animation: 'fadeInUp 0.8s ease' }}>
            <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.7)' }}>
              More Cebu{' '}
              <span style={{ background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Destinations
              </span>
            </h1>
            <p className="fs-5 mb-4" style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.7)' }}>
              Discover {allSites.length} cultural, historical, and natural treasures across Cebu Province
            </p>
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <div className="position-relative">
                <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 py-3"
                  placeholder="Search Cebu destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', borderRadius: '50px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container-fluid px-4 py-5">
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
            <div className="d-flex flex-wrap gap-2">
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: 'auto', minWidth: '200px', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 15px', fontWeight: '500', color: '#1e3a5f' }}
              >
                {categories.map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}
              </select>

              <div className="position-relative" style={{ width: 'auto', minWidth: '280px' }}>
                <button
                  type="button"
                  className="form-select text-start d-flex align-items-center justify-content-between"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 15px', fontWeight: '500', color: '#1e3a5f', backgroundColor: 'white', cursor: 'pointer' }}
                >
                  <span>{cities.find(c => c.id === selectedCity)?.label || 'All Cities and Municipalities'}</span>
                </button>
                {showCityDropdown && (
                  <>
                    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 999 }} onClick={() => setShowCityDropdown(false)} />
                    <div
                      className="position-absolute bg-white shadow-lg dropdown-menu-custom"
                      style={{ top: '100%', left: 0, marginTop: '4px', borderRadius: '12px', border: '2px solid #e5e7eb', zIndex: 1000, minWidth: '1600px', padding: '10px', columnCount: 6, columnGap: '10px' }}
                    >
                      {cities.map(city => (
                        <div
                          key={city.id}
                          onClick={() => { setSelectedCity(city.id); setShowCityDropdown(false); }}
                          className="px-3 py-2"
                          style={{ cursor: 'pointer', backgroundColor: selectedCity === city.id ? '#e0f2fe' : 'white', color: selectedCity === city.id ? '#0369a1' : '#1e3a5f', fontWeight: selectedCity === city.id ? '600' : '500', transition: 'all 0.2s', borderRadius: '6px', fontSize: '0.95rem', whiteSpace: 'nowrap', breakInside: 'avoid', marginBottom: '2px' }}
                          onMouseEnter={(e) => { if (selectedCity !== city.id) e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                          onMouseLeave={(e) => { if (selectedCity !== city.id) e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                          {city.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', minWidth: '180px', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 15px', fontWeight: '500', color: '#1e3a5f' }}
            >
              <option value="popular">Most Rated (by count)</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <div className="mt-3 d-flex align-items-center gap-3">
            <p className="text-muted mb-0">
              Showing <span className="fw-bold text-dark">{filteredDestinations.length}</span> destination{filteredDestinations.length !== 1 ? 's' : ''}
              {selectedCity !== 'all' && (<span className="ms-2" style={{ color: '#3b82f6', fontWeight: '600' }}>in {selectedCity}</span>)}
            </p>
            {/* Badge showing how many are admin-added */}
            {firestoreSites.length > 0 && (
              <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
                ✅ {firestoreSites.length} admin-added site{firestoreSites.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="row g-4">
            {filteredDestinations.map((dest, index) => (
              <div key={dest.id} className="col-12 col-md-6 col-lg-4" style={{ animation: `fadeInUp 0.6s ease ${index * 0.05}s backwards` }}>
                <div 
                  className="card h-100 border-0 shadow-sm overflow-hidden"
                  style={{ borderRadius: '20px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)'; setShowMapButton(dest.id); }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; setShowMapButton(null); }}
                >
                  <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                    {dest.image ? (
                      <div
                        style={{ backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100%', transition: 'transform 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ height: '100%', background: 'linear-gradient(135deg, #1e3a5f, #2c5282)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={48} color="rgba(255,255,255,0.4)" />
                      </div>
                    )}
                    <div 
                      className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill small fw-semibold d-flex align-items-center gap-1"
                      style={dest.category === 'Cultural Heritage' ? { background: 'rgba(245, 158, 11, 0.9)', backdropFilter: 'blur(10px)', color: 'white' } : dest.category === 'Historical Heritage' ? { background: 'rgba(148, 163, 184, 0.9)', backdropFilter: 'blur(10px)', color: 'white' } : { background: 'rgba(34, 197, 94, 0.9)', backdropFilter: 'blur(10px)', color: 'white' }}
                    >
                      <Landmark size={12} />
                      <span>{dest.category.replace(' Heritage', '')}</span>
                    </div>
                    {dest.era && (
                      <div 
                        className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                        style={{ background: 'rgba(30, 58, 95, 0.9)', backdropFilter: 'blur(10px)', color: 'white' }}
                      >
                        <Clock size={16} />
                        <span className="small fw-semibold">{dest.era.split('(')[0].trim()}</span>
                      </div>
                    )}
                    {/* Admin-added badge */}
                    {dest.source === 'firestore' && (
                      <div className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill" style={{ background: 'rgba(16,185,129,0.9)', color: 'white', fontSize: '0.65rem', fontWeight: '700' }}>
                        NEW
                      </div>
                    )}
                    {showMapButton === dest.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); goToMapLocation(dest); }}
                        className="position-absolute bottom-0 end-0 m-3 px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', color: 'white', fontWeight: '600', fontSize: '0.8rem', animation: 'fadeIn 0.2s ease', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Navigation size={14} />
                        View on Map
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <MapPin size={16} style={{ color: '#3b82f6' }} />
                      <span className="small text-muted fw-semibold">{dest.location.split(',')[0]}</span>
                    </div>
                    <h3 className="h5 fw-bold mb-2" style={{ color: '#1e3a5f' }}>{dest.name}</h3>
                    <p className="text-muted small mb-3" style={{ lineHeight: '1.6' }}>{dest.description}</p>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {(dest.highlights || []).map((highlight, i) => (
                        <span key={i} className="badge rounded-pill px-2 py-1" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', fontWeight: '500' }}>{highlight}</span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {/* Avg score */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {(siteAvgRatings[dest.name]?.count ?? dest.reviews) > 0 ? (
                            <>
                              <Star size={14} fill="#fbbf24" color="#fbbf24" />
                              <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#1e3a5f' }}>
                                {siteAvgRatings[dest.name]?.avg ?? dest.rating}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                                ({siteAvgRatings[dest.name]?.count ?? dest.reviews})
                              </span>
                            </>
                          ) : (
                            <>
                              <Star size={14} color="#d1d5db" />
                              <span style={{ fontSize: '0.78rem', color: '#b0b7c3', fontStyle: 'italic' }}>No ratings yet</span>
                            </>
                          )}
                        </div>
                        {/* ONE unified clickable star row */}
                        {submittedRatings[dest.name] && editingRating !== dest.name ? (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                            border: '1.5px solid #6ee7b7', borderRadius: '10px',
                            padding: '6px 10px', animation: 'thankYouPop 0.4s ease',
                          }}>
                            <span style={{ fontSize: '1rem' }}>🙏</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#065f46' }}>Thank you for rating!</div>
                              <div style={{ display: 'flex', gap: '1px', marginTop: '1px' }}>
                                {[1,2,3,4,5].map(s => (
                                  <span key={s} style={{ fontSize: '0.85rem', color: s <= submittedRatings[dest.name] ? '#f59e0b' : '#d1d5db', lineHeight: 1 }}>★</span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingRating(dest.name); }}
                              title="Edit your rating"
                              style={{ background: 'none', border: '1px solid #6ee7b7', borderRadius: '7px', padding: '3px 7px', cursor: 'pointer', fontSize: '0.68rem', color: '#047857', fontWeight: '600', flexShrink: 0 }}
                            >✏️ Edit</button>
                          </div>
                        ) : editingRating === dest.name ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: '600' }}>Choose your new rating:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              {[1,2,3,4,5].map(s => {
                                const key = `edit_${dest.id}_${s}`;
                                const active = typeof hoverRating === 'string' && hoverRating.startsWith(`edit_${dest.id}_`) && s <= parseInt(hoverRating.split('_')[2]);
                                return (
                                  <span
                                    key={s}
                                    onClick={(e) => { e.stopPropagation(); submitRating(dest, s); }}
                                    onMouseEnter={() => setHoverRating(key)}
                                    onMouseLeave={() => setHoverRating(null)}
                                    title={['','Terrible','Poor','Okay','Good','Excellent'][s]}
                                    style={{ cursor: 'pointer', fontSize: '1.25rem', color: active ? '#f59e0b' : '#d1d5db', transform: active ? 'scale(1.2)' : 'scale(1)', transition: 'color 0.12s, transform 0.12s', lineHeight: 1, display: 'inline-block' }}
                                  >★</span>
                                );
                              })}
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingRating(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.68rem', color: '#9ca3af', marginLeft: '4px' }}
                              >✕ Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[1,2,3,4,5].map(s => {
                              const key = `${dest.id}_${s}`;
                              const active = typeof hoverRating === 'string' && hoverRating.startsWith(`${dest.id}_`) && s <= parseInt(hoverRating.split('_')[1]);
                              return (
                                <span
                                  key={s}
                                  onClick={(e) => { e.stopPropagation(); submitRating(dest, s); }}
                                  onMouseEnter={() => setHoverRating(key)}
                                  onMouseLeave={() => setHoverRating(null)}
                                  title={['','Terrible','Poor','Okay','Good','Excellent'][s]}
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    color: active ? '#f59e0b' : '#d1d5db',
                                    transform: active ? 'scale(1.2)' : 'scale(1)',
                                    transition: 'color 0.12s, transform 0.12s',
                                    lineHeight: 1,
                                    display: 'inline-block',
                                  }}
                                >★</span>
                              );
                            })}
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '2px' }}>Tap to rate</span>
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm px-3 py-2 d-flex align-items-center gap-1"
                          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: '600', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedDestination(dest); }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'; }}
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

      {/* ── Rating Thank You Toast ── */}
      {ratingSuccess && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #1e3a5f, #2c5282)',
          color: 'white', borderRadius: '20px', padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 32px rgba(30,58,95,0.35)', zIndex: 99999,
          animation: 'toastSlideUp 0.35s ease',
          minWidth: '280px', maxWidth: '90vw',
        }}>
          <span style={{ fontSize: '1.6rem' }}>🙏</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Thank you for rating!</div>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: '1px' }}>
              Your rating for <strong>{ratingSuccess}</strong> has been submitted
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '1rem', color: s <= (submittedRatings[ratingSuccess] || 0) ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>★</span>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDestination && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999, padding: '20px', animation: 'fadeIn 0.3s ease' }}
          onClick={() => setSelectedDestination(null)}
        >
          <div 
            className="bg-white rounded-4 overflow-hidden position-relative"
            style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              onClick={() => setSelectedDestination(null)}
            >
              <X size={20} />
            </button>

            {selectedDestination.image ? (
              <div style={{ height: '300px', backgroundImage: `url(${selectedDestination.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            ) : (
              <div style={{ height: '200px', background: 'linear-gradient(135deg, #1e3a5f, #2c5282)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={64} color="rgba(255,255,255,0.4)" />
              </div>
            )}

            <div className="p-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={18} style={{ color: '#3b82f6' }} />
                <span className="text-muted fw-semibold">{selectedDestination.location}</span>
                {selectedDestination.lat && selectedDestination.lng && (
                  <>
                    <span className="text-muted">•</span>
                    <span className="text-muted">Coordinates: {Number(selectedDestination.lat).toFixed(4)}°, {Number(selectedDestination.lng).toFixed(4)}°</span>
                  </>
                )}
              </div>
              <h2 className="h3 fw-bold mb-3" style={{ color: '#1e3a5f' }}>{selectedDestination.name}</h2>
              <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  {(siteAvgRatings[selectedDestination.name]?.count ?? selectedDestination.reviews) > 0 ? (
                    <>
                      <Star size={18} fill="#fbbf24" color="#fbbf24" />
                      <span className="fw-bold">
                        {siteAvgRatings[selectedDestination.name]?.avg ?? selectedDestination.rating}
                      </span>
                      <span className="text-muted">
                        ({siteAvgRatings[selectedDestination.name]?.count ?? selectedDestination.reviews} ratings)
                      </span>
                    </>
                  ) : (
                    <>
                      <Star size={18} color="#d1d5db" />
                      <span className="text-muted fst-italic">No ratings yet — be the first!</span>
                    </>
                  )}
                </div>
                {selectedDestination.era && (
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={18} style={{ color: '#64748b' }} />
                    <span className="text-muted">{selectedDestination.era}</span>
                  </div>
                )}
              </div>

              {/* ── Interactive Star Rating ── */}
              <div style={{ background: 'linear-gradient(135deg,#f8fafc,#f0f9ff)', border: '2px solid #e0f2fe', borderRadius: '16px', padding: '18px 22px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', color: '#1e3a5f', fontSize: '0.95rem' }}>Rate this heritage site</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Your feedback helps others discover great places</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {submittedRatings[selectedDestination.name] && editingRating !== selectedDestination.name ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', padding: '12px 20px', borderRadius: '16px', border: '1.5px solid #6ee7b7', animation: 'thankYouPop 0.4s ease' }}>
                        <span style={{ fontSize: '1.8rem' }}>🙏</span>
                        <div>
                          <div style={{ fontWeight: '700', color: '#065f46', fontSize: '0.95rem' }}>Thank you for your rating!</div>
                          <div style={{ color: '#047857', fontSize: '0.8rem', marginTop: '2px' }}>Your feedback helps improve this site</div>
                          <div style={{ display: 'flex', gap: '2px', marginTop: '5px' }}>
                            {[1,2,3,4,5].map(s => (
                              <span key={s} style={{ fontSize: '1.3rem', color: s <= submittedRatings[selectedDestination.name] ? '#f59e0b' : '#d1d5db' }}>★</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingRating(selectedDestination.name)}
                          style={{ background: 'white', border: '1.5px solid #6ee7b7', borderRadius: '10px', padding: '7px 13px', cursor: 'pointer', fontSize: '0.8rem', color: '#047857', fontWeight: '700', alignSelf: 'flex-start' }}
                        >✏️ Edit</button>
                      </div>
                    ) : editingRating === selectedDestination.name ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: '600' }}>Choose your new rating:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {[1,2,3,4,5].map(s => (
                            <span
                              key={s}
                              onClick={() => submitRating(selectedDestination, s)}
                              onMouseEnter={() => setHoverRating(`modal_edit_${s}`)}
                              onMouseLeave={() => setHoverRating(null)}
                              title={['','Terrible','Poor','Okay','Good','Excellent'][s]}
                              style={{
                                cursor: 'pointer', fontSize: '2rem',
                                color: (typeof hoverRating === 'string' && hoverRating.startsWith('modal_edit_') && s <= parseInt(hoverRating.split('_')[2])) ? '#f59e0b' : '#d1d5db',
                                transform: (typeof hoverRating === 'string' && hoverRating.startsWith('modal_edit_') && s <= parseInt(hoverRating.split('_')[2])) ? 'scale(1.25)' : 'scale(1)',
                                transition: 'color 0.15s, transform 0.15s', display: 'inline-block', lineHeight: 1,
                              }}
                            >★</span>
                          ))}
                        </div>
                        <button onClick={() => setEditingRating(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#9ca3af' }}>✕ Cancel</button>
                      </div>
                    ) : (
                      <>
                        {[1,2,3,4,5].map(s => (
                          <span
                            key={s}
                            onClick={() => submitRating(selectedDestination, s)}
                            onMouseEnter={() => setHoverRating(`modal_${s}`)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{
                              cursor: submitting ? 'wait' : 'pointer',
                              fontSize: '2rem',
                              color: (typeof hoverRating === 'string' && hoverRating.startsWith('modal_') && !hoverRating.startsWith('modal_edit_') && s <= parseInt(hoverRating.split('_')[1]))
                                ? '#f59e0b' : '#d1d5db',
                              transition: 'color 0.15s, transform 0.15s',
                              transform: (typeof hoverRating === 'string' && hoverRating.startsWith('modal_') && !hoverRating.startsWith('modal_edit_') && s <= parseInt(hoverRating.split('_')[1]))
                                ? 'scale(1.25)' : 'scale(1)',
                              display: 'inline-block',
                              lineHeight: 1,
                            }}
                          >★</span>
                        ))}
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '4px' }}>
                          {typeof hoverRating === 'string' && hoverRating.startsWith('modal_') && !hoverRating.startsWith('modal_edit_')
                            ? ['','Terrible','Poor','Okay','Good','Excellent'][parseInt(hoverRating.split('_')[1])]
                            : 'Tap a star'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="mb-4" style={{ lineHeight: '1.7', color: '#475569' }}>{selectedDestination.description}</p>

              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn px-4 py-2 d-flex align-items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', color: 'white', borderRadius: '10px', fontWeight: '600', transition: 'all 0.3s ease', flex: 1, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
                  onClick={() => { setSelectedDestination(null); goToMapLocation(selectedDestination); }}
                >
                  <Navigation size={18} /> View on Map
                </button>
              </div>

              {selectedDestination.heritageStatus && (
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fef3c7', border: '2px solid #fbbf24' }}>
                  <div className="d-flex align-items-start gap-2">
                    <Award size={20} style={{ color: '#92400e', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <h4 className="h6 fw-bold mb-1" style={{ color: '#92400e' }}>Heritage Status</h4>
                      <p className="mb-0 small" style={{ color: '#78350f', lineHeight: '1.6' }}>{selectedDestination.heritageStatus}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="row g-3 mb-4">
                {selectedDestination.established && (
                  <div className="col-md-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Calendar size={16} style={{ color: '#3b82f6' }} />
                        <h6 className="h6 fw-bold mb-0" style={{ color: '#1e3a5f' }}>Established</h6>
                      </div>
                      <p className="mb-0" style={{ color: '#4b5563' }}>{selectedDestination.established}</p>
                    </div>
                  </div>
                )}
                {selectedDestination.builtBy && (
                  <div className="col-md-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Users size={16} style={{ color: '#3b82f6' }} />
                        <h6 className="h6 fw-bold mb-0" style={{ color: '#1e3a5f' }}>Built By</h6>
                      </div>
                      <p className="mb-0" style={{ color: '#4b5563' }}>{selectedDestination.builtBy}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedDestination.detailedInfo?.overview && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Overview</h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>{selectedDestination.detailedInfo.overview}</p>
                </div>
              )}

              {selectedDestination.detailedInfo?.culturalSignificance && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Cultural Significance</h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>{selectedDestination.detailedInfo.culturalSignificance}</p>
                </div>
              )}

              {selectedDestination.detailedInfo?.visitorInfo && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Visitor Information</h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>{selectedDestination.detailedInfo.visitorInfo}</p>
                </div>
              )}

              {selectedDestination.detailedInfo?.transportationFee && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>🚌 Transportation & Getting There</h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563', whiteSpace: 'pre-line' }}>{selectedDestination.detailedInfo.transportationFee}</p>
                </div>
              )}

              {selectedDestination.culturalPractices?.length > 0 && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Cultural Practices</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDestination.culturalPractices.map((practice, index) => (
                      <span key={index} style={{ background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '500' }}>{practice}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDestination.nativeFloraFauna?.length > 0 && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Native Species</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDestination.nativeFloraFauna.map((species, index) => (
                      <span key={index} style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '500' }}>{species}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDestination.preservation && (
                <div className="mb-4">
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>Preservation Status</h4>
                  <p style={{ lineHeight: '1.7', color: '#4b5563' }}>{selectedDestination.preservation}</p>
                </div>
              )}

              {selectedDestination.highlights?.length > 0 && (
                <div>
                  <h4 className="h5 fw-bold mb-2" style={{ color: '#1e3a5f' }}>Key Highlights</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDestination.highlights.map((highlight, i) => (
                      <span key={i} className="badge px-3 py-2" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem', fontWeight: '600', border: '2px solid #7dd3fc' }}>{highlight}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes thankYouPop { 0% { opacity:0; transform:scale(0.85); } 60% { transform:scale(1.04); } 100% { opacity:1; transform:scale(1); } }
        @keyframes toastSlideUp { from { opacity:0; transform:translateX(-50%) translateY(24px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); outline: none; }
        .form-control:focus { outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
      `}</style>
    </div>
  );
}

export default Destinations;