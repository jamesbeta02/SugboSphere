import { useState, useEffect } from 'react';
import { Search, Filter, X, TrendingUp } from 'lucide-react';

function SearchPage() {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [footerHeight, setFooterHeight] = useState(200);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
      
      const footer = document.querySelector('footer');
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'posts', label: 'Posts' },
    { id: 'users', label: 'Users' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' }
  ];

  const trendingSearches = [
    'React tutorials',
    'JavaScript tips',
    'Web design trends',
    'CSS animations',
    'Node.js best practices'
  ];

  const recentSearches = [
    'Bootstrap components',
    'Responsive design',
    'API integration'
  ];

  const searchResults = [
    {
      id: 1,
      title: 'Getting Started with React',
      description: 'Learn the fundamentals of React and build your first application.',
      category: 'posts',
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Techniques',
      description: 'Master advanced JavaScript concepts and improve your coding skills.',
      category: 'posts',
      date: '1 week ago'
    },
    {
      id: 3,
      title: 'Modern Web Design Principles',
      description: 'Explore the latest trends and best practices in web design.',
      category: 'posts',
      date: '3 days ago'
    },
    {
      id: 4,
      title: 'CSS Grid Layout Tutorial',
      description: 'Complete guide to creating responsive layouts with CSS Grid.',
      category: 'posts',
      date: '5 days ago'
    }
  ];

  const filteredResults = searchQuery
    ? searchResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      className="bg-light"
      style={{
        paddingTop: `${navbarHeight}px`,
        paddingBottom: `${footerHeight}px`,
        minHeight: '100vh',
        transition: 'padding-top 0.3s ease, padding-bottom 0.3s ease'
      }}
    >
      <div className="container-fluid py-4">
        {/* Search Header */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold mb-2">Search</h1>
              <p className="text-muted">Find what you're looking for</p>
            </div>

            {/* Search Bar */}
            <div className="position-relative mb-3">
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={20} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '1rem' }}
                />
                {searchQuery && (
                  <button
                    className="btn btn-link text-muted"
                    onClick={() => setSearchQuery('')}
                    style={{ textDecoration: 'none' }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary d-md-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="me-1" />
                Filters
              </button>
              
              <div className={`d-flex gap-2 flex-wrap ${showFilters ? 'd-flex' : 'd-none d-md-flex'}`}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`btn btn-sm ${
                      selectedCategory === category.id
                        ? 'btn-dark'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Show trending/recent when no search */}
            {!searchQuery && (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                        <TrendingUp size={20} className="text-primary" />
                        Trending Searches
                      </h5>
                      <ul className="list-unstyled mb-0">
                        {trendingSearches.map((search, index) => (
                          <li key={index} className="mb-2">
                            <button
                              className="btn btn-link text-decoration-none text-start p-0"
                              onClick={() => setSearchQuery(search)}
                            >
                              <Search size={14} className="me-2 text-muted" />
                              {search}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Recent Searches</h5>
                      <ul className="list-unstyled mb-0">
                        {recentSearches.map((search, index) => (
                          <li key={index} className="mb-2">
                            <button
                              className="btn btn-link text-decoration-none text-start p-0"
                              onClick={() => setSearchQuery(search)}
                            >
                              <Search size={14} className="me-2 text-muted" />
                              {search}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <>
                <div className="mb-3">
                  <p className="text-muted">
                    {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {filteredResults.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {filteredResults.map((result) => (
                      <div key={result.id} className="card shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title mb-2">{result.title}</h5>
                          <p className="card-text text-muted mb-2">{result.description}</p>
                          <div className="d-flex gap-3 align-items-center">
                            <span className="badge bg-secondary">{result.category}</span>
                            <small className="text-muted">{result.date}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <Search size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No results found</h5>
                    <p className="text-muted">Try adjusting your search terms</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;