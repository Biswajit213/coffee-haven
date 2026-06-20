import React from 'react';
import { Link } from 'react-router-dom';
import { FiCoffee, FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      <div className="container-max px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-accent font-heading font-bold text-xl mb-3 sm:mb-4">
              <FiCoffee className="text-xl sm:text-2xl" />
              <span>Coffee Haven</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              Premium coffee crafted with passion. From bean to cup, we bring you the finest coffee experience.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="p-2 rounded-full bg-gray-700 hover:bg-primary transition-colors">
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Categories</h3>
            <ul className="space-y-2 text-sm">
              {['Espresso', 'Cappuccino', 'Latte', 'Cold Coffee', 'Tea', 'Snacks'].map((cat) => (
                <li key={cat}>
                  <Link to={`/menu?category=${cat}`} className="hover:text-accent transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              {[
                { icon: FiMapPin, text: '123 Coffee Lane, Brew City, CA 90210' },
                { icon: FiPhone, text: '+1 (555) 123-4567' },
                { icon: FiMail, text: 'hello@coffeehaven.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon className="mt-0.5 text-accent flex-shrink-0" size={15} />
                  <span className="text-gray-400">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-5 text-center text-xs sm:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Coffee Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
