'use client';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Plane, Globe, Heart, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-white/90">Your trusted travel partner since 2010</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="text-primary" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-dark-900 mb-4">Our Mission</h2>
                <p className="text-dark-700 leading-relaxed">
                  To provide exceptional travel experiences that create lasting memories. We are committed to delivering personalized service, expert guidance, and unforgettable journeys for every traveler.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Globe className="text-secondary" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-dark-900 mb-4">Our Vision</h2>
                <p className="text-dark-700 leading-relaxed">
                  To be the leading travel agency in the region, known for innovation, reliability, and customer satisfaction. We aim to make travel accessible, enjoyable, and memorable for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Our Values</h2>
            <p className="text-xl text-dark-700">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Customer First', description: 'Your satisfaction is our top priority' },
              { icon: Plane, title: 'Excellence', description: 'Delivering quality in every service' },
              { icon: Globe, title: 'Integrity', description: 'Honest and transparent business practices' },
            ].map((value) => (
              <div
                key={value.title}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-primary" size={40} />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{value.title}</h3>
                <p className="text-dark-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '50K+', label: 'Happy Travelers' },
              { number: '100+', label: 'Destinations' },
              { number: '500+', label: 'Tour Packages' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-dark-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
