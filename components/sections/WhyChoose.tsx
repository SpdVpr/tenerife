'use client';

import { Users, Home, Wind, Wifi, Waves, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Users,
    titleKey: 'why.pool',
    descKey: 'why.poolDesc',
    color: 'bg-primary-blue',
  },
  {
    icon: Home,
    titleKey: 'why.terrace',
    descKey: 'why.terraceDesc',
    color: 'bg-primary-cyan',
  },
  {
    icon: Wind,
    titleKey: 'why.ac',
    descKey: 'why.acDesc',
    color: 'bg-primary-lightBlue',
  },
  {
    icon: Wifi,
    titleKey: 'why.wifi',
    descKey: 'why.wifiDesc',
    color: 'bg-primary-blue',
  },
  {
    icon: Waves,
    titleKey: 'why.view',
    descKey: 'why.viewDesc',
    color: 'bg-primary-cyan',
  },
  {
    icon: Star,
    titleKey: 'why.equipped',
    descKey: 'why.equippedDesc',
    color: 'bg-accent-yellow',
  },
];

export default function WhyChoose() {
  const { t } = useLanguage();

  return (
    <section id="apartment" className="py-20 bg-gradient-to-b from-white to-accent-beige">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            {t('why.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('why.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                {/* Icon */}
                <div
                  className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

