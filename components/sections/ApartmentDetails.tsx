'use client';

import { Users, Bed, Sofa, Bath, ChefHat, Palmtree, Maximize2, Building2, Wind, Wifi, Tv, UtensilsCrossed, WashingMachine, Shirt, Wind as Dryer, Sparkles, Coffee, Zap, Waves } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const specifications = [
  { labelKey: 'details.capacity', valueKey: 'details.capacityValue', icon: Users },
  { labelKey: 'details.bedroom', valueKey: 'details.bedroomValue', icon: Bed },
  { labelKey: 'details.livingRoom', valueKey: 'details.livingRoomValue', icon: Sofa },
  { labelKey: 'details.bathroom', valueKey: 'details.bathroomValue', icon: Bath },
  { labelKey: 'details.kitchen', valueKey: 'details.kitchenValue', icon: ChefHat },
  { labelKey: 'details.terrace', valueKey: 'details.terraceValue', icon: Palmtree },
  { labelKey: 'details.area', valueKey: 'details.areaValue', icon: Maximize2 },
  { labelKey: 'details.floor', valueKey: 'details.floorValue', icon: Building2 },
];

const amenities = [
  { nameKey: 'amenity.ac', icon: Wind },
  { nameKey: 'amenity.wifi', icon: Wifi },
  { nameKey: 'amenity.tv', icon: Tv },
  { nameKey: 'amenity.kitchen', icon: UtensilsCrossed },
  { nameKey: 'amenity.washer', icon: WashingMachine },
  { nameKey: 'amenity.iron', icon: Shirt },
  { nameKey: 'amenity.dryer', icon: Dryer },
  { nameKey: 'amenity.linens', icon: Sparkles },
  { nameKey: 'amenity.kitchenBasics', icon: UtensilsCrossed },
  { nameKey: 'amenity.coffee', icon: Coffee },
  { nameKey: 'amenity.kettle', icon: Zap },
  { nameKey: 'amenity.toaster', icon: Zap },
];

export default function ApartmentDetails() {
  const { t } = useLanguage();
  return (
    <section id="details" className="py-20 bg-gradient-to-b from-white via-accent-beige to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-primary-blue to-primary-cyan text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
              {t('details.badge')}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-primary-blue mb-6">
            {t('details.title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t('details.subtitle')}
          </p>
        </div>

        {/* Specifications Cards */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('details.specifications')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specifications.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-primary-blue/30 transform hover:-translate-y-2"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-xl mb-4 mx-auto">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg mb-2">{t(spec.labelKey)}</div>
                    <div className="text-gray-600 text-sm leading-relaxed">{t(spec.valueKey)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('details.amenities')}
          </h3>
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity, index) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:from-primary-blue/5 hover:to-primary-cyan/5 transition-all border border-gray-100 hover:border-primary-blue/20"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{t(amenity.nameKey)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pool & Common Areas */}
        <div className="bg-gradient-to-br from-primary-blue via-primary-cyan to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 lg:h-auto">
              <Image
                src="/images/optimized/view/image00030-medium.webp"
                alt={t('details.poolTitle')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Waves className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {t('details.poolTitle')}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed mb-6 text-white/90">
                {t('details.poolDesc1')}
              </p>
              <p className="text-lg leading-relaxed text-white/90">
                {t('details.poolDesc2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

