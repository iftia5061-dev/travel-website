import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Travel Website
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover amazing destinations, unforgettable tours and hassle-free travel services. Your journey begins with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-primary transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-gray-400 hover:text-primary transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/visa" className="text-gray-400 hover:text-primary transition-colors">
                  Visa Services
                </Link>
              </li>
              <li>
                <Link href="/hajj-umrah" className="text-gray-400 hover:text-primary transition-colors">
                  Hajj & Umrah
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@travelwebsite.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Your Address Here</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <button className="bg-primary hover:bg-primary-600 text-white p-3 rounded-full transition-colors cursor-not-allowed opacity-60">
                <Facebook size={20} />
              </button>
              <button className="bg-primary hover:bg-primary-600 text-white p-3 rounded-full transition-colors cursor-not-allowed opacity-60">
                <Instagram size={20} />
              </button>
              <button className="bg-primary hover:bg-primary-600 text-white p-3 rounded-full transition-colors cursor-not-allowed opacity-60">
                <Twitter size={20} />
              </button>
              <button className="bg-primary hover:bg-primary-600 text-white p-3 rounded-full transition-colors cursor-not-allowed opacity-60">
                <Youtube size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Travel Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
