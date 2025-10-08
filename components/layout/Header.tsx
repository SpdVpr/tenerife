'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const navigation = [
  { key: 'nav.home', href: '/', isAnchor: false },
  { key: 'nav.apartment', href: '/#apartment', isAnchor: false },
  { key: 'nav.gallery', href: '/#gallery', isAnchor: false },
  { key: 'nav.pricing', href: '/#pricing', isAnchor: false },
  { key: 'nav.booking', href: '/#booking', isAnchor: false },
  { key: 'nav.location', href: '/#location', isAnchor: false },
  { key: 'nav.guestbook', href: '/guest-book', isAnchor: false },
  { key: 'nav.contact', href: '/#contact', isAnchor: false },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-white/95 backdrop-blur-sm shadow-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo/logo-small.webp"
              alt="Cielo Dorado Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 transition-colors">
                Cielo Dorado
              </span>
              <span className="text-xs text-gray-600 transition-colors">
                Los Gigantes, Tenerife
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-cyan cursor-pointer"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setLanguage('cs')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  language === 'cs'
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                CZ
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  language === 'en'
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 bg-white rounded-lg shadow-xl animate-slide-down">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-blue transition-colors cursor-pointer"
                >
                  {t(item.key)}
                </a>
              ))}
              <div className="flex items-center space-x-2 px-4 pt-2 border-t">
                <button
                  onClick={() => setLanguage('cs')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded ${
                    language === 'cs'
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded ${
                    language === 'en'
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

