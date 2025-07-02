import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter,
  ChevronRight,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

const ShopDiscovery = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  // Mock shop data
  const mockShops = [
    {
      id: '1',
      name: 'Mike\'s Barbershop',
      address: '123 Main St, New York, NY',
      distance: 0.3,
      rating: 4.8,
      reviewCount: 127,
      services: ['Haircut', 'Beard Trim', 'Shave'],
      priceRange: '$20-$45',
      nextAvailable: '10:00 AM',
      openNow: true,
      hours: 'Open until 8:00 PM',
      image: null
    },
    {
      id: '2',
      name: 'Style Studio',
      address: '456 Oak Ave, New York, NY',
      distance: 0.5,
      rating: 4.6,
      reviewCount: 89,
      services: ['Haircut', 'Hair Wash', 'Styling'],
      priceRange: '$25-$50',
      nextAvailable: '11:30 AM',
      openNow: true,
      hours: 'Open until 9:00 PM',
      image: null
    },
    {
      id: '3',
      name: 'Classic Cuts',
      address: '789 Pine St, New York, NY',
      distance: 0.7,
      rating: 4.9,
      reviewCount: 203,
      services: ['Haircut', 'Beard Trim', 'Shave', 'Hair Wash'],
      priceRange: '$30-$60',
      nextAvailable: '2:00 PM',
      openNow: true,
      hours: 'Open until 7:00 PM',
      image: null
    },
    {
      id: '4',
      name: 'Urban Barbers',
      address: '321 Elm St, New York, NY',
      distance: 1.2,
      rating: 4.4,
      reviewCount: 156,
      services: ['Haircut', 'Beard Trim', 'Hair Styling'],
      priceRange: '$20-$40',
      nextAvailable: 'Tomorrow 9:00 AM',
      openNow: false,
      hours: 'Closed • Opens tomorrow at 9:00 AM',
      image: null
    },
    {
      id: '5',
      name: 'The Gentleman\'s Cut',
      address: '654 Maple Ave, New York, NY',
      distance: 1.5,
      rating: 4.7,
      reviewCount: 92,
      services: ['Haircut', 'Beard Trim', 'Shave', 'Mustache Trim'],
      priceRange: '$35-$70',
      nextAvailable: '3:30 PM',
      openNow: true,
      hours: 'Open until 8:00 PM',
      image: null
    }
  ];

  useEffect(() => {
    loadShops();
    requestLocation();
  }, []);

  useEffect(() => {
    filterAndSortShops();
  }, [shops, searchQuery, sortBy]);

  const loadShops = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShops(mockShops);
    setLoading(false);
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast.error('Unable to get your location');
        }
      );
    }
  };

  const filterAndSortShops = () => {
    let filtered = shops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.services.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // Sort shops
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'availability':
        filtered.sort((a, b) => {
          if (a.openNow && !b.openNow) return -1;
          if (!a.openNow && b.openNow) return 1;
          return a.distance - b.distance;
        });
        break;
      default:
        break;
    }

    setFilteredShops(filtered);
  };

  const formatDistance = (distance) => {
    return distance < 1 ? `${Math.round(distance * 10) / 10} mi` : `${Math.round(distance)} mi`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Discover Shops</h1>
          <p className="page-subtitle">Finding barbershops near you...</p>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Discover Shops</h1>
        <p className="page-subtitle">
          Find the best barbershops near you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search shops, services, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input flex-1"
          >
            <option value="distance">Nearest First</option>
            <option value="rating">Highest Rated</option>
            <option value="availability">Available Now</option>
          </select>
        </div>
      </div>

      {/* Location Info */}
      {userLocation && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Navigation size={16} className="text-accent" />
            <span className="font-medium text-sm">Your Location</span>
          </div>
          <p className="text-sm text-muted">
            Showing results near your current location
          </p>
        </div>
      )}

      {/* Results */}
      {filteredShops.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredShops.map((shop) => (
            <Link
              key={shop.id}
              to={`/customer/book/${shop.id}`}
              className="card shop-card block"
            >
              <div className="shop-distance">{formatDistance(shop.distance)}</div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{shop.name}</h3>
                  <p className="text-sm text-muted mb-2">{shop.address}</p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="shop-rating">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`star ${i < Math.floor(shop.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted ml-2">
                        {shop.rating} ({shop.reviewCount})
                      </span>
                    </div>
                    
                    <span className="text-sm font-medium text-accent">
                      {shop.priceRange}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      shop.openNow 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {shop.openNow ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs text-muted">{shop.hours}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {shop.services.slice(0, 3).map((service, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {shop.services.length > 3 && (
                      <span className="text-xs text-muted">
                        +{shop.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <ChevronRight size={16} className="text-muted flex-shrink-0" />
              </div>
              
              <div className="flex items-center justify-between text-sm border-t pt-3">
                <div className="flex items-center gap-1 text-muted">
                  <Clock size={12} />
                  <span>Next: {shop.nextAvailable}</span>
                </div>
                <span className="text-accent font-medium">Book Now</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MapPin className="empty-state-icon" />
          <h3 className="empty-state-title">No shops found</h3>
          <p className="empty-state-description">
            {searchQuery 
              ? `No shops match "${searchQuery}". Try adjusting your search.`
              : 'No barbershops found in your area.'
            }
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="btn btn-primary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopDiscovery;