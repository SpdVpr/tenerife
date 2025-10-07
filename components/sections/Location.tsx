import { MapPin, Utensils, Ship, Mountain, Waves, ShoppingBag } from 'lucide-react';

const nearbyPlaces = [
  {
    icon: Waves,
    title: 'Pláž Los Gigantes',
    distance: '5 min pěšky',
    description: 'Krásná černá sopečná pláž s klidným mořem',
  },
  {
    icon: Ship,
    title: 'Přístav',
    distance: '3 min pěšky',
    description: 'Výlety lodí, pozorování velryb a delfínů',
  },
  {
    icon: Mountain,
    title: 'Útes Los Gigantes',
    distance: 'Přímo před vámi',
    description: 'Ikonické útesy vysoké až 800 metrů',
  },
  {
    icon: Utensils,
    title: 'Restaurace a bary',
    distance: '2-5 min pěšky',
    description: 'Široká nabídka místních i mezinárodních restaurací',
  },
  {
    icon: ShoppingBag,
    title: 'Obchody',
    distance: '3 min pěšky',
    description: 'Supermarkety, lékárna, bankomaty',
  },
  {
    icon: MapPin,
    title: 'Centrum Puerto Santiago',
    distance: '10 min autem',
    description: 'Větší nákupní centrum a další služby',
  },
];

export default function Location() {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-blue mb-4">
            Lokalita
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Los Gigantes - klidné městečko s úchvatným výhledem na útes
          </p>
        </div>

        {/* Nearby Places */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {nearbyPlaces.map((place, index) => {
            const Icon = place.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {place.title}
                    </h3>
                    <p className="text-sm text-primary-blue font-semibold mb-2">
                      {place.distance}
                    </p>
                    <p className="text-sm text-gray-600">
                      {place.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map and Info Combined */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl h-full">
              <div className="aspect-video lg:aspect-auto lg:h-full relative min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.234567890123!2d-16.8456789!3d28.2456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd6b0e1e0001%3A0x1234567890abcdef!2sAv.%20Jose%20Gonzalez%20Forte%2C%2073%2C%2038683%20Santiago%20del%20Teide%2C%20Santa%20Cruz%20de%20Tenerife%2C%20Spain!5e0!3m2!1scs!2scz!4v1234567890123!5m2!1scs!2scz"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Info - 1 column */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-xl flex-1">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-primary-blue flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Adresa apartmánu
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Colonial 1 Apartment<br />
                    Av. Jose Gonzalez Forte, 73<br />
                    38683 Santiago del Teide<br />
                    Santa Cruz de Tenerife, Španělsko
                  </p>
                  <a
                    href="https://maps.google.com/?q=Colonial+1+Apartment,+Av.+Jose+Gonzalez+Forte,+73,+38683+Santiago+del+Teide,+Santa+Cruz+de+Tenerife,+Spain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-primary-blue hover:text-primary-cyan font-semibold transition-colors text-sm"
                  >
                    Otevřít v Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Why Los Gigantes */}
            <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-2xl p-6 flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Proč Los Gigantes?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Klidné přímořské městečko na západním pobřeží Tenerife s impozantními útesy
                vysokými až 800 metrů. Ideální pro klid, relaxaci a autentickou atmosféru.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Nádherné západy slunce z terasy, restaurace, obchody, pláže a vodní sporty
                v okolí.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

