'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Domů', href: '/', isAnchor: false },
  { name: 'Apartmán', href: '/#apartment', isAnchor: false },
  { name: 'Galerie', href: '/#gallery', isAnchor: false },
  { name: 'Ceník', href: '/#pricing', isAnchor: false },
  { name: 'Rezervace', href: '/#booking', isAnchor: false },
  { name: 'Lokalita', href: '/#location', isAnchor: false },
  { name: 'Guest Book', href: '/guest-book', isAnchor: false },
  { name: 'Kontakt', href: '/#contact', isAnchor: false },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setIsMobileMenuOpen(false);
  };

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
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-cyan cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-3 py-1 text-sm font-medium bg-primary-blue text-white rounded transition-colors">
                CZ
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors">
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
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-blue transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-2 px-4 pt-2 border-t">
                <button className="flex-1 px-3 py-2 text-sm font-medium bg-primary-blue text-white rounded">
                  CZ
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
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

