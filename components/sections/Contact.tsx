'use client';

import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-accent-beige">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Phone */}
          <a
            href="tel:+420723382745"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('contact.phone')}
              </h3>
              <p className="text-primary-blue font-semibold text-lg">
                +420 723 382 745
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {t('contact.owner')}
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:martin.holann@gmail.com"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-primary-cyan rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('contact.email')}
              </h3>
              <p className="text-primary-blue font-semibold text-lg break-all">
                martin.holann@gmail.com
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {t('contact.response24h')}
              </p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/420723382745"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('contact.whatsapp')}
              </h3>
              <p className="text-primary-blue font-semibold text-lg">
                +420 723 382 745
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {t('contact.fastestResponse')}
              </p>
            </div>
          </a>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t('contact.readyToBook')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('contact.readyDesc')}
            </p>
            <a
              href="#booking"
              className="inline-block bg-gradient-to-r from-primary-blue to-primary-cyan text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              {t('contact.bookApartment')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

