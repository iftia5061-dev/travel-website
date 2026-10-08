import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Hero from '@/components/hero/Hero';
import { MapPin, Star, ArrowRight, Clock, Plane, Hotel, CreditCard, Shield } from 'lucide-react';

export default function Home() {
  const destinations = [
    { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', description: 'Modern luxury and desert adventures' },
    { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', description: 'Paradise islands and crystal waters' },
    { name: 'Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', description: 'Temples, beaches and vibrant culture' },
    { name: 'Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400', description: 'Diverse landscapes and city life' },
    { name: 'Singapore', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400', description: 'Garden city and modern marvels' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', description: 'Spiritual retreats and natural beauty' },
    { name: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400', description: 'Historic sites and stunning coastlines' },
    { name: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', description: 'Ancient traditions meets future' },
  ];

  const features = [
    { icon: Plane, title: 'Best Tours', description: 'Curated travel experiences worldwide' },
    { icon: Hotel, title: 'Premium Hotels', description: 'Handpicked accommodations' },
    { icon: CreditCard, title: 'Best Prices', description: 'Competitive rates guaranteed' },
    { icon: Shield, title: 'Safe Travel', description: '24/7 support and assistance' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Explore Popular Destinations</h2>
            <p className="text-xl text-dark-700">Discover the world's most amazing places</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{dest.description}</p>
                  <button className="flex items-center space-x-2 text-primary font-semibold">
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-dark-700">Your trusted travel partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{feature.title}</h3>
                <p className="text-dark-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Special Offers</h2>
            <p className="text-xl text-white/90 mb-8">Get up to 30% off on selected packages</p>
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-full hover:shadow-lg transition-all">
              View All Offers
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
