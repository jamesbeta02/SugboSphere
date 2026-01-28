import { useState, useEffect } from 'react';
import { Search, ArrowRight, MapPin, Globe, Landmark, Award, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBackground from './image/coron.jpg';

function Home() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const featuredCebuSites = [
    {
      image: 'src/image/magellans-cross.jpg',
      title: 'Magellan\'s Cross',
      location: 'Cebu City, Cebu',
      category: 'Historical Heritage',
      description: 'Historic cross planted by Ferdinand Magellan in 1521, marking the birth of Christianity in the Philippines'
    },
    {
      image: 'src/image/santo-nino.jpg',
      title: 'Basilica del Santo Niño',
      location: 'Cebu City, Cebu',
      category: 'Historical Heritage',
      description: 'The oldest Roman Catholic church in the Philippines, founded in 1565'
    },
    {
      image: 'src/image/kawasan-falls.webp',
      title: 'Kawasan Falls',
      location: 'Badian, Cebu',
      category: 'Natural Heritage',
      description: 'Three-tiered waterfall system with stunning turquoise waters and canyoneering adventures'
    },
    {
      image: 'src/image/moalboal.jpg',
      title: 'Moalboal Sardine Run',
      location: 'Moalboal, Cebu',
      category: 'Natural Heritage',
      description: 'Millions of sardines forming massive underwater schools, a world-class diving spectacle'
    },
    {
      image: 'src/image/osmena-peak.jpg',
      title: 'Osmeña Peak',
      location: 'Dalaguete, Cebu',
      category: 'Natural Heritage',
      description: 'Cebu\'s highest peak at 1,015 meters with breathtaking panoramic views of jagged hills'
    }
  ];

  const cebuStats = [
    { icon: <Landmark />, value: '15+', label: 'Heritage Sites', color: '#93c5fd' },
    { icon: <Globe />, value: '3', label: 'Categories', color: '#60a5fa' },
    { icon: <Award />, value: '50+', label: 'Cultural Practices', color: '#34d399' },
    { icon: <Users />, value: '100+', label: 'Native Species', color: '#a78bfa' }
  ];

  useEffect(() => {
    // Get navbar height once on component mount
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    // Initial measurement
    updateNavbarHeight();
    
    // Update on resize
    window.addEventListener('resize', updateNavbarHeight);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredCebuSites.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 300);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/destinations');
    }
  };

  const handleExploreClick = () => {
    navigate('/explore');
  };

  const handleViewDestinations = () => {
    navigate('/destinations');
  };

  return (
    <div className="bg-light">
      {/* Full Screen Hero */}
      <div 
        className="position-relative overflow-hidden"
        style={{
          height: '100vh',
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          paddingTop: `${navbarHeight}px` // Add padding to account for navbar
        }}
      > 
        {/* Gradient Overlay - Matching Navbar theme */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.92) 0%, rgba(44, 82, 130, 0.88) 50%, rgba(26, 54, 93, 0.90) 100%)'
          }}
        />
        
        {/* Animated particles */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ overflow: 'hidden' }}>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="position-absolute"
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: 'rgba(147, 197, 253, 0.2)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div 
          className="position-absolute top-50 start-50 translate-middle text-center text-white px-4"
          style={{
            opacity: opacity,
            transition: 'opacity 0.1s ease',
            width: '90%',
            maxWidth: '900px',
            animation: 'fadeInUp 1s ease',
            marginTop: '-20px' // Adjust this value to move content up/down
          }}
        >
          <div className="mb-4" style={{ animation: 'fadeInUp 1s ease 0.1s backwards' }}>
            <span className="badge px-4 py-2 mb-3" style={{
              background: 'rgba(147, 197, 253, 0.2)',
              fontSize: '0.9rem',
              fontWeight: '600',
              letterSpacing: '1px',
              border: '1px solid rgba(147, 197, 253, 0.3)',
              color: '#93c5fd'
            }}>
              🏝️ EXPLORE THE QUEEN CITY OF THE SOUTH
            </span>
          </div>

          <h1 className="display-2 fw-bold mb-4" style={{ 
            textShadow: '3px 3px 15px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 1s ease 0.2s backwards',
            lineHeight: '1.2'
          }}>
            Discover {' '}
            <span style={{
              background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}>
              Cebu's Heritage
            </span>
          </h1>
          <p className="fs-4 mb-5 mx-auto" style={{ 
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            animation: 'fadeInUp 1s ease 0.4s backwards',
            maxWidth: '700px',
            lineHeight: '1.6'
          }}>
            Journey through Cebu's rich cultural heritage, historical landmarks, and breathtaking natural wonders on an interactive digital platform
          </p>
          
          {/* Search Bar */}
          <div className="mb-4" style={{ animation: 'fadeInUp 1s ease 0.6s backwards' }}>
            <div className="input-group input-group-lg mx-auto shadow-lg" style={{ maxWidth: '650px' }}>
              <span className="input-group-text" style={{
                background: 'rgba(255, 255, 255, 0.98)',
                border: 'none',
                borderRight: '1px solid #e5e7eb'
              }}>
                <Search size={20} style={{ color: '#6b7280' }} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search Cebu heritage sites, beaches, waterfalls, cultural landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none',
                  padding: '18px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  fontSize: '1rem'
                }}
              />
              <button 
                className="btn px-5 fw-semibold" 
                type="button"
                onClick={handleSearch}
                style={{
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center flex-wrap" style={{ animation: 'fadeInUp 1s ease 0.8s backwards' }}>
            <button 
              className="btn btn-lg px-5 py-3 fw-semibold d-flex align-items-center gap-2" 
              type="button"
              onClick={handleExploreClick}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                fontSize: '1.1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
            >
              <Globe size={22} />
              Explore Interactive Map <ArrowRight size={22} />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="position-absolute bottom-0 start-50 translate-middle-x mb-5 text-white text-center"
          style={{ opacity: opacity, transition: 'opacity 0.1s ease', animation: 'bounce 2s ease-in-out infinite' }}
        >
          <p className="mb-2 fw-semibold" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
            Scroll to discover more ↓
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-5" style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(30, 58, 95, 0.3)'
      }}>
        <div className="container">
          <div className="row g-4">
            {cebuStats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="text-center" style={{ animation: `fadeInUp 0.6s ease ${index * 0.1}s backwards` }}>
                  <div className="mb-3 d-flex justify-content-center">
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.8rem',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="display-5 fw-bold mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>{stat.value}</h3>
                  <p className="mb-0 fw-semibold" style={{ fontSize: '1.05rem', opacity: 0.9 }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heritage Sites Section */}
      <div style={{ 
        background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
        padding: '100px 0'
      }}>
        <div className="container-fluid py-5 px-4">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center" style={{ animation: 'fadeInUp 1s ease' }}>
              <span className="badge px-4 py-2 mb-3" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '1px',
                color: 'white'
              }}>
                FEATURED DESTINATIONS
              </span>
              <h2 className="display-4 fw-bold mb-4" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Cebu's Heritage Treasures
              </h2>
              <p className="fs-5 text-muted mb-5 mx-auto" style={{ maxWidth: '650px', lineHeight: '1.8' }}>
                From Spanish colonial landmarks to pristine beaches and waterfalls, discover what makes Cebu the Queen City of the South
              </p>
            </div>
          </div>

          {/* Image Slider */}
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div 
                className="position-relative overflow-hidden rounded-4" 
                style={{ 
                  height: '550px',
                  boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
                  border: '4px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #2563eb) border-box'
                }}
              >
                {featuredCebuSites.map((site, index) => (
                  <div
                    key={index}
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundImage: `url(${site.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: currentImageIndex === index ? 1 : 0,
                      transition: 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out',
                      transform: currentImageIndex === index ? 'scale(1)' : 'scale(1.1)'
                    }}
                  >
                    <div 
                      className="position-absolute bottom-0 start-0 w-100 p-4"
                      style={{
                        background: 'linear-gradient(to top, rgba(30, 58, 95, 0.95) 0%, rgba(44, 82, 130, 0.7) 50%, transparent 100%)'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={20} className="text-white" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }} />
                          <p className="text-white mb-0 fw-semibold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{site.location}</p>
                        </div>
                        <span className="badge px-3 py-2" style={{
                          background: site.category === 'Cultural Heritage' 
                            ? 'rgba(251, 191, 36, 0.85)' 
                            : site.category === 'Historical Heritage'
                            ? 'rgba(148, 163, 184, 0.85)'
                            : 'rgba(52, 211, 153, 0.85)',
                          color: 'white',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                          {site.category.replace(' Heritage', '')}
                        </span>
                      </div>
                      <h3 className="text-white fw-bold mb-2 display-6" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.6)' }}>{site.title}</h3>
                      <p className="text-white mb-0" style={{ fontSize: '1rem', textShadow: '1px 1px 4px rgba(0,0,0,0.5)', lineHeight: '1.5' }}>{site.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Slider Indicators */}
              <div className="d-flex justify-content-center gap-2 mt-4">
                {featuredCebuSites.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="btn p-0"
                    style={{
                      width: currentImageIndex === index ? '40px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      background: currentImageIndex === index 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : '#cbd5e1',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: currentImageIndex === index ? '0 2px 10px rgba(59, 130, 246, 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <span className="badge px-3 py-2 mb-3" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                ABOUT THE PLATFORM
              </span>
              <h3 className="display-6 fw-bold mb-4" style={{ color: '#0c4a6e' }}>
                Your Gateway to Cebu's Rich Heritage
              </h3>
              <p className="text-muted mb-4 fs-6" style={{ lineHeight: '1.8' }}>
                SugboSphere is a comprehensive digital platform dedicated to showcasing and preserving Cebu's cultural heritage, 
                historical landmarks, and natural wonders. Explore the Queen City of the South through immersive experiences, 
                interactive maps, and rich multimedia content designed for students, educators, tourists, and cultural enthusiasts.
              </p>
              <ul className="list-unstyled mb-5">
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-4" style={{ color: '#3b82f6' }}>✓</span>
                  <div>
                    <strong className="d-block mb-1">Interactive Heritage Map</strong>
                    <span className="text-muted small">Explore 15+ heritage sites across Cebu with detailed information and coordinates</span>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-4" style={{ color: '#3b82f6' }}>✓</span>
                  <div>
                    <strong className="d-block mb-1">Cultural Documentation</strong>
                    <span className="text-muted small">Learn about Cebuano traditions, practices, and indigenous knowledge</span>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-4" style={{ color: '#3b82f6' }}>✓</span>
                  <div>
                    <strong className="d-block mb-1">Educational Resources</strong>
                    <span className="text-muted small">Perfect for students, researchers, and anyone passionate about Cebu's heritage</span>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-4" style={{ color: '#3b82f6' }}>✓</span>
                  <div>
                    <strong className="d-block mb-1">Natural Wonders & Biodiversity</strong>
                    <span className="text-muted small">Discover beaches, waterfalls, marine sanctuaries, and native species</span>
                  </div>
                </li>
              </ul>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <button 
                  className="btn btn-lg px-5 py-3 d-flex align-items-center gap-2 fw-semibold"
                  onClick={handleExploreClick}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    flex: '1 1 auto',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  <Globe size={20} />
                  Explore Map
                </button>
                <button 
                  className="btn btn-lg px-5 py-3 d-flex align-items-center gap-2 fw-semibold"
                  onClick={handleViewDestinations}
                  style={{
                    background: 'white',
                    border: '2px solid #3b82f6',
                    color: '#3b82f6',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                    flex: '1 1 auto',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.25)';
                    e.currentTarget.style.background = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  View All Sites <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

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
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;