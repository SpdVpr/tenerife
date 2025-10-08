'use client';

import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo/logo-small.webp"
                alt="Cielo Dorado Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">Cielo Dorado</h3>
                <p className="text-sm text-gray-400">Premium Holiday Apartment</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {t('footer.aboutDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-3">
              <a
                href="#apartment"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.apartment')}
              </a>
              <a
                href="#gallery"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.gallery')}
              </a>
              <a
                href="#pricing"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.pricing')}
              </a>
              <Link
                href="/guest-book"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.guestbook')}
              </Link>
              <a
                href="#booking"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.booking')}
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <a
                href="tel:+420723382745"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+420 723 382 745</span>
              </a>
              <a
                href="mailto:martin.holann@gmail.com"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>martin.holann@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/mynameis.martin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>@mynameis.martin</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('location.title')}</h4>
            <div className="flex items-start space-x-3 text-gray-400">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <div className="text-sm">
                <p>Colonial 1 Apartment</p>
                <p>Av. Jose Gonzalez Forte, 73</p>
                <p>38683 Santiago del Teide</p>
                <p>Santa Cruz de Tenerife</p>
                <a
                  href="https://maps.google.com/?q=Colonial+1+Apartment,+Av.+Jose+Gonzalez+Forte,+73,+38683+Santiago+del+Teide,+Santa+Cruz+de+Tenerife,+Spain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-cyan hover:text-white transition-colors inline-block mt-1"
                >
                  Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Cielo Dorado. {t('footer.rights')}</p>
          <p className="mt-2">Los Gigantes, Tenerife</p>
        </div>
      </div>
    </footer>
  );
}

