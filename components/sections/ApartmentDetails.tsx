import { Users, Bed, Sofa, Bath, ChefHat, Palmtree, Maximize2, Building2, Wind, Wifi, Tv, UtensilsCrossed, WashingMachine, Shirt, Wind as Dryer, Sparkles, Coffee, Zap, Waves } from 'lucide-react';
import Image from 'next/image';

const specifications = [
  { label: 'Kapacita', value: 'Až 4 osoby', icon: Users },
  { label: 'Ložnice', value: '1 ložnice s manželskou postelí', icon: Bed },
  { label: 'Obývací pokoj', value: 'Rozkládací gauč pro 2 osoby', icon: Sofa },
  { label: 'Koupelna', value: 'Moderní koupelna se sprchovým koutem', icon: Bath },
  { label: 'Kuchyň', value: 'Plně vybavená kuchyňská linka', icon: ChefHat },
  { label: 'Terasa', value: '27 m² s výhledem na oceán', icon: Palmtree },
  { label: 'Plocha', value: '47 m² + terasa 27 m²', icon: Maximize2 },
  { label: 'Patro', value: '5. patro s výtahem', icon: Building2 },
];

const amenities = [
  { name: 'Klimatizace Daikin (chlazení i topení)', icon: Wind },
  { name: 'Wi-Fi zdarma (vysokorychlostní)', icon: Wifi },
  { name: 'Smart TV s Netflix', icon: Tv },
  { name: 'Plně vybavená kuchyň (myčka, trouba, mikrovlnka)', icon: UtensilsCrossed },
  { name: 'Pračka', icon: WashingMachine },
  { name: 'Žehlička a žehlicí prkno', icon: Shirt },
  { name: 'Fén', icon: Dryer },
  { name: 'Ložní prádlo a ručníky', icon: Sparkles },
  { name: 'Základní kuchyňské vybavení', icon: UtensilsCrossed },
  { name: 'Kávovar', icon: Coffee },
  { name: 'Varná konvice', icon: Zap },
  { name: 'Toustovač', icon: Zap },
];

export default function ApartmentDetails() {
  return (
    <section id="details" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-primary-blue to-primary-cyan text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
              Detail Apartmánu
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Váš dokonalý domov na dovolené
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Moderně zařízený apartmán s panoramatickým výhledem, který nabízí vše pro váš komfortní pobyt
          </p>
        </div>

        {/* Specifications Cards */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Specifikace
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
                    <div className="font-bold text-gray-900 text-lg mb-2">{spec.label}</div>
                    <div className="text-gray-600 text-sm leading-relaxed">{spec.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Vybavení apartmánu
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
                    <span className="text-gray-700 font-medium">{amenity.name}</span>
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
                alt="Střešní bazén s výhledem na oceán"
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
                Střešní bazén a společné prostory
              </h3>
              <p className="text-lg md:text-xl leading-relaxed mb-6 text-white/90">
                Apartmán je součástí rezidenčního komplexu Colonial Parque s exkluzivním střešním bazénem
                pouze pro rezidenty. Bazén nabízí úchvatný výhled na útes Los Gigantes a Atlantský oceán.
              </p>
              <p className="text-lg leading-relaxed text-white/90">
                K dispozici jsou také lehátka, slunečníky a sprchy. Ideální místo pro relaxaci
                a odpočinek po dni stráveném objevováním ostrova.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

