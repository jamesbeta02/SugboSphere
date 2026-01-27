import { useState, useEffect } from 'react';
import { Search, ArrowRight, MapPin, Globe, Landmark, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBackground from './image/coron.jpg';

function Home() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const featuredHeritageSites = [
    {
      // Banaue Rice Terraces - Actual photo
      image: 'src/image/banaue-rice-terraces.jpg',
      title: 'Banaue Rice Terraces',
      location: 'Ifugao, Cordillera',
      category: 'Cultural Heritage',
      description: '2,000-year-old terraces carved by Ifugao ancestors'
    },
    {
      // Intramuros - Actual Spanish colonial walls
      image: 'src/image/intramuros.jpg',
      title: 'Intramuros',
      location: 'Manila',
      category: 'Historical Heritage',
      description: 'Spanish colonial walled city from 1571'
    },
    {
      // Vigan Heritage Village - Actual cobblestone streets
      image: 'src/image/vigan-heritage.JPG',
      title: 'Vigan Heritage Village',
      location: 'Ilocos Sur',
      category: 'Cultural Heritage',
      description: 'Best-preserved Spanish colonial town in Asia'
    },
    {
      // Tubbataha Reefs - Actual marine life
      image: 'src/image/tubbataha.jpg',
      title: 'Tubbataha Reefs',
      location: 'Palawan',
      category: 'Natural Heritage',
      description: 'UNESCO marine sanctuary with pristine coral reefs'
    },
    {
      // Chocolate Hills - Actual landscape
      image: 'src/image/chocolate-hills.jpeg',
      title: 'Chocolate Hills',
      location: 'Bohol',
      category: 'Natural Heritage',
      description: '1,200+ unique geological limestone hills'
    }
  ];

  const heritageStats = [
    { icon: <Landmark />, value: '5', label: 'UNESCO Sites', color: '#f59e0b' },
    { icon: <Globe />, value: '3', label: 'Heritage Categories', color: '#3b82f6' },
    { icon: <Award />, value: '15+', label: 'Cultural Practices', color: '#10b981' },
    { icon: <Users />, value: '50+', label: 'Native Species', color: '#8b5cf6' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    }, 50);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredHeritageSites.length);
    }, 4000);

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
    <div className="bg-light" style={{ paddingTop: `${navbarHeight}px` }}>
      {/* Full Screen Hero */}
      <div 
        className="position-relative overflow-hidden"
        style={{
          height: '100vh',
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      > 
        {/* Gradient Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.85) 0%, rgba(44, 82, 130, 0.75) 50%, rgba(26, 54, 93, 0.9) 100%)'
          }}
        />
        
        {/* Animated particles */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ overflow: 'hidden' }}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="position-absolute"
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: 'rgba(147, 197, 253, 0.4)',
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
            animation: 'fadeInUp 1s ease'
          }}
        >
          <h1 className="display-3 fw-bold mb-4" style={{ 
            textShadow: '2px 2px 12px rgba(0,0,0,0.7)',
            animation: 'fadeInUp 1s ease 0.2s backwards'
          }}>
            Welcome to {' '}
            <span style={{
              background: 'linear-gradient(90deg, #fff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Maharlika
            </span>
          </h1>
          <p className="fs-4 mb-5" style={{ 
            textShadow: '1px 1px 6px rgba(0,0,0,0.7)',
            animation: 'fadeInUp 1s ease 0.4s backwards'
          }}>
            Explore the rich tapestry of Filipino culture, history, and natural wonders through our interactive heritage platform
          </p>
          
          {/* Search Bar */}
          <div className="mb-4" style={{ animation: 'fadeInUp 1s ease 0.6s backwards' }}>
            <div className="input-group input-group-lg mx-auto" style={{ maxWidth: '600px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Philippine heritage sites, cultural practices, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none',
                  padding: '15px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              />
              <button 
                className="btn px-4" 
                type="button"
                onClick={handleSearch}
                style={{
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                }}
              >
                <Search size={20} />
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
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
            >
              <Globe size={20} />
              Explore Interactive Map <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-white text-center"
          style={{ opacity: opacity, transition: 'opacity 0.1s ease', animation: 'bounce 2s ease-in-out infinite' }}
        >
          <p className="mb-2 small" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>Discover Philippine Heritage</p>
          <div className="d-flex justify-content-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-5" style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div className="row g-4">
            {heritageStats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="text-center" style={{ animation: 'fadeInUp 0.6s ease' }}>
                  <div className="mb-3 d-flex justify-content-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `rgba(255, 255, 255, 0.1)`,
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      fontSize: '1.5rem',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${stat.color}40`
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="display-6 fw-bold mb-2">{stat.value}</h3>
                  <p className="mb-0 opacity-75">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heritage Sites Section */}
      <div style={{ 
        background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
        padding: '80px 0'
      }}>
        <div className="container-fluid py-5 px-4">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center" style={{ animation: 'fadeInUp 1s ease' }}>
              <h2 className="display-5 fw-bold mb-4" style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Philippine Heritage Treasures
              </h2>
              <p className="fs-5 text-muted mb-5">
                Explore UNESCO World Heritage Sites, cultural landmarks, and natural wonders that showcase the Philippines' rich history and biodiversity
              </p>
            </div>
          </div>

          {/* Image Slider */}
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div 
                className="position-relative overflow-hidden rounded-3" 
                style={{ 
                  height: '500px',
                  boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
                  border: '3px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #2563eb) border-box'
                }}
              >
                {featuredHeritageSites.map((site, index) => (
                  <div
                    key={index}
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundImage: `url(${site.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: currentImageIndex === index ? 1 : 0,
                      transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
                      transform: currentImageIndex === index ? 'scale(1)' : 'scale(1.1)'
                    }}
                  >
                    <div 
                      className="position-absolute bottom-0 start-0 w-100 p-4"
                      style={{
                        background: 'linear-gradient(to top, rgba(30, 58, 95, 0.9), transparent)'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={18} className="text-white" />
                          <p className="text-white-50 mb-0">{site.location}</p>
                        </div>
                        <span className="badge px-3 py-1" style={{
                          background: site.category === 'Cultural Heritage' 
                            ? 'rgba(245, 158, 11, 0.9)' 
                            : site.category === 'Historical Heritage'
                            ? 'rgba(59, 130, 246, 0.9)'
                            : 'rgba(34, 197, 94, 0.9)',
                          color: 'white',
                          fontWeight: '500'
                        }}>
                          {site.category.replace(' Heritage', '')}
                        </span>
                      </div>
                      <h3 className="text-white fw-bold mb-1">{site.title}</h3>
                      <p className="text-white-75 mb-0" style={{ fontSize: '0.9rem' }}>{site.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Slider Indicators */}
              <div className="d-flex justify-content-center gap-2 mt-3">
                {featuredHeritageSites.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="btn p-0"
                    style={{
                      width: currentImageIndex === index ? '30px' : '12px',
                      height: '12px',
                      borderRadius: '6px',
                      background: currentImageIndex === index 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : '#dee2e6',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: currentImageIndex === index ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <h3 className="h2 fw-bold mb-4" style={{ color: '#1e3a5f' }}>
                About Maharlika Heritage
              </h3>
              <p className="text-muted mb-4">
                Maharlika is an interactive digital platform dedicated to preserving and promoting Philippine cultural heritage. 
                We document historical sites, traditional practices, and natural wonders through engaging multimedia experiences.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: '#3b82f6' }}>✓</span>
                  <span><strong>Interactive Maps</strong> - Explore heritage sites across 7,641 islands</span>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: '#3b82f6' }}>✓</span>
                  <span><strong>Cultural Documentation</strong> - Traditional practices and indigenous knowledge</span>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: '#3b82f6' }}>✓</span>
                  <span><strong>Educational Resources</strong> - For students, researchers, and cultural advocates</span>
                </li>
                <li className="mb-3 d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: '#3b82f6' }}>✓</span>
                  <span><strong>Biodiversity Database</strong> - Native Philippine flora and fauna</span>
                </li>
              </ul>
              <div className="d-flex gap-3 mt-4">
                <button 
                  className="btn btn-lg px-4 py-3 d-flex align-items-center gap-2"
                  onClick={handleExploreClick}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  <Globe size={20} />
                  Explore Map
                </button>
                <button 
                  className="btn btn-lg px-4 py-3 d-flex align-items-center gap-2"
                  onClick={handleViewDestinations}
                  style={{
                    background: 'white',
                    border: '2px solid #3b82f6',
                    color: '#3b82f6',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.1)',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.background = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.1)';
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