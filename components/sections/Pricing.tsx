'use client';

import { Check, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const includedItemsKeys = [
  'pricing.electricity',
  'pricing.wifi',
  'pricing.ac',
  'pricing.linens',
  'pricing.cleaningBefore',
  'pricing.poolAccess',
  'pricing.parking',
  'pricing.touristTax',
];

export default function Pricing() {
  const { t } = useLanguage();
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-accent-beige to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Standard Price */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:border-primary-blue transition-all">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('pricing.standard')}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-primary-blue">95</span>
                <span className="text-2xl text-gray-600 ml-2">EUR</span>
              </div>
              <p className="text-gray-600 mt-2">{t('pricing.perNight')}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar className="w-5 h-5 text-primary-blue" />
                <span>{t('pricing.nights1-9')}</span>
              </div>
            </div>
          </div>

          {/* Discounted Price */}
          <div className="bg-gradient-to-br from-primary-blue to-primary-cyan rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-accent-yellow text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              {t('pricing.discount')}
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {t('pricing.discounted')}
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold">85</span>
                <span className="text-2xl ml-2">EUR</span>
              </div>
              <p className="text-white/90 mt-2">{t('pricing.perNight')}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>{t('pricing.nights10plus')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Fee */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-blue/30">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {t('pricing.additionalFee')}
            </h3>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-lg text-gray-700">{t('pricing.cleaning')}</span>
              <span className="text-3xl font-bold text-primary-blue">80 EUR</span>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('pricing.included')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {includedItemsKeys.map((itemKey, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">{t(itemKey)}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}

