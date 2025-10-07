import { Users, Home, Wind, Wifi, Waves, Star } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Střešní bazén',
    description: 'Exkluzivně pro rezidenty s výhledem na útes',
    color: 'bg-blue-500',
  },
  {
    icon: Home,
    title: 'Velká terasa 27m²',
    description: 'Jihozápadní orientace, ideální pro západy slunce',
    color: 'bg-cyan-500',
  },
  {
    icon: Wind,
    title: 'Klimatizace Daikin',
    description: 'Moderní energeticky úsporný systém',
    color: 'bg-green-500',
  },
  {
    icon: Wifi,
    title: 'Wi-Fi zdarma',
    description: 'Vysokorychlostní připojení po celém apartmánu',
    color: 'bg-purple-500',
  },
  {
    icon: Waves,
    title: 'Výhled na oceán',
    description: 'Úchvatné panorama na Atlantik',
    color: 'bg-blue-600',
  },
  {
    icon: Star,
    title: 'Plně vybaveno',
    description: 'Myčka, pračka, vše co potřebujete',
    color: 'bg-yellow-500',
  },
];

export default function WhyChoose() {
  return (
    <section id="apartment" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Proč si vybrat Cielo Dorado?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Objevte výhody našeho luxusního apartmánu v srdci Los Gigantes
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
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

