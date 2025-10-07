import { 
  Info, 
  Clock, 
  MapPin, 
  Phone, 
  Bus, 
  Car, 
  Home, 
  Volume2, 
  Cigarette,
  ShoppingCart,
  AlertTriangle,
  Shield,
  Thermometer,
  Trash2,
  Dog
} from 'lucide-react';

export default function GuestBook() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Guest Book
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Příručka pro hosty / Guide for Guests
          </p>
          <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-2xl p-6 max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Thank you for choosing <strong>CIELO DORADO</strong> apartment for your stay!<br />
              We wish you a pleasant and enjoyable holiday :)
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Obsah / Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Základní informace / Basic Info',
              '2. Doprava / Transportation',
              '3. Pravidla domu / House Rules',
              '4. Zákaz kouření / No Smoking',
              '5. Nejsme hotel / We Are Not a Hotel',
              '6. Nákupy / Grocery Shopping',
              '7. Španělské "Okupas"',
              '8. Hasicí přístroj / Fire Extinguisher',
              '9. Trezor / Safe',
              '10. Klimatizace / Air Conditioning',
              '11. Odpadové hospodářství / Waste Management',
              '12. Psi / Dogs',
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-blue/10 transition-colors"
              >
                <span className="text-primary-blue font-semibold">{item}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-primary-blue to-primary-cyan text-white rounded-2xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4">Kontakt / Contact</h3>
          <p className="mb-4">
            Pro nejlepší cenu na váš další pobyt nás kontaktujte na WhatsApp:<br />
            To get the best price for your next stay, message us on WhatsApp:
          </p>
          <a
            href="https://wa.me/420723382745"
            className="inline-flex items-center space-x-2 bg-white text-primary-blue px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>+420 723 382 745</span>
          </a>
          <p className="mt-4 text-sm">
            Email: martin.holann@gmail.com
          </p>
        </div>

        {/* Section 1: Basic Info */}
        <div id="section-1" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">1. Základní informace / Basic Info</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-blue" />
                Příjezd / Arrival
              </h3>
              <p className="text-gray-700">
                Apartmán je k dispozici od <strong>14:30</strong> v den příjezdu.<br />
                The apartment is available from <strong>2:30 PM</strong> on your arrival day.
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-blue" />
                Odjezd / Departure
              </h3>
              <p className="text-gray-700">
                Apartmán je k dispozici do <strong>11:00</strong> v den odjezdu.<br />
                The apartment is available until <strong>11 AM</strong> on your departure day.
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Bazén / Swimming Pool</h3>
              <p className="text-gray-700">
                Nově zrekonstruovaný bazén je na 5. patře. Otevřeno <strong>10:00 - 20:30</strong>. 
                Dveře otevřete klíčem z klíčenky.<br />
                Newly reconstructed pool on the 5th floor. Open <strong>10 AM - 8:30 PM</strong>. 
                Open the door with the key on your keyring.
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Wi-Fi & Internet</h3>
              <p className="text-gray-700">
                Bezplatný Wi-Fi přístup je k dispozici v celém apartmánu.<br />
                Free Wi-Fi access is available throughout the apartment.
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Parkování / Parking</h3>
              <p className="text-gray-700">
                Bezplatné parkování na přístupových cestách. Nemáme rezervovaná místa.<br />
                Free parking on access roads outside. We do not have reserved spots.
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Noční vstup / Night Entrance</h3>
              <p className="text-gray-700">
                Hlavní vchod je uzamčen o půlnoci. Můžete vstoupit druhým klíčem kdykoliv.<br />
                Main entrance is locked at midnight. You can enter with the second key anytime.
              </p>
            </div>

            <div className="border-l-4 border-accent-red pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Lékařská pomoc / Medical Help</h3>
              <p className="text-gray-700 text-sm">
                <strong>Praktický lékař / GP:</strong> Med Center No 3, C./ Flor de Pascua 33, Tel: +34 922 096 614<br />
                <strong>Zubař / Dentist:</strong> Dental Centre Nodarse, Calle Petunia 3, Tel: +34 922 86 71 50<br />
                <strong>Lékárna / Pharmacy:</strong> Calle González Forte, Tel: 922 861 612<br />
                <strong>Pohotovost / Emergency:</strong> 112
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Transportation */}
        <div id="section-2" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Bus className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">2. Doprava / Transportation</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-blue" />
                Adresa / Address
              </h3>
              <p className="text-gray-700 mb-3">
                Colonial 1 Apartment<br />
                Av. Jose Gonzalez Forte, 73<br />
                38683 Santiago del Teide<br />
                Santa Cruz de Tenerife, Španělsko
              </p>
              <a
                href="https://maps.google.com/?q=Colonial+1+Apartment,+Av.+Jose+Gonzalez+Forte,+73,+38683+Santiago+del+Teide,+Santa+Cruz+de+Tenerife,+Spain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary-blue hover:text-primary-cyan font-semibold transition-colors"
              >
                Otevřít v Google Maps →
              </a>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Autobus / Public Bus</h3>
              <p className="text-gray-700 mb-2">
                <strong>www.titsa.com</strong> nebo Google Maps<br />
                Zastávka: Los Gigantes &quot;Quinto Centenario&quot;
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Z letiště jih: Linka 40 nebo 343 → Costa Adeje → Linka 473 nebo 477 (cca €10)</li>
                <li>• Z letiště sever: Linka 343 → Costa Adeje → Linka 473 nebo 477 (cca €20)</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Car className="w-5 h-5 mr-2 text-primary-blue" />
                Taxi
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Z letiště jih:</strong> +34 922 397 074, cca €55 pro 2 osoby + zavazadla<br />
                <strong>Z letiště sever:</strong> +34 922 264 050, cca €130 pro 2 osoby + zavazadla<br />
                <strong>Taxi Los Gigantes:</strong> +34 922 397 475
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Půjčovna aut / Rent a Car</h3>
              <p className="text-gray-700">
                <a href="https://www.cicar.com" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">www.cicar.com</a><br />
                <a href="https://www.autospluscar.com" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">www.autospluscar.com</a>
              </p>
            </div>

            <div className="bg-accent-yellow/20 border border-accent-yellow rounded-lg p-4">
              <p className="text-sm text-gray-700">
                ⚠️ <strong>Důležité:</strong> Vždy si ověřte cenu předem! Cielo Dorado není licencován k poskytování dopravních služeb.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: House Rules */}
        <div id="section-3" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Home className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">3. Pravidla domu / House Rules</h2>
          </div>

          <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-lg p-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              Zaměřujeme se na udržování přátelské atmosféry mezi sousedy, vzájemný respekt 
              a čisté a upravené veřejné i soukromé prostory.<br />
              <em>We focus on maintaining a friendly atmosphere between neighbors, mutual respect 
              and clean and tidy public and private areas.</em>
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Volume2,
                title: 'Hluk / Noise',
                text: 'Žádný hluk od 22:00 do 10:00. Regulujte hlasitost TV a rádia. / No noise from 10 PM to 10 AM. Regulate TV and radio volume.',
              },
              {
                icon: Dog,
                title: 'Domácí zvířata / Pets',
                text: 'Zvířata nejsou povolena ve společných prostorách (chodby, schody, bazén). / Pets not allowed in communal areas (hallways, stairs, pool).',
              },
              {
                icon: Cigarette,
                title: 'Kouření / Smoking',
                text: 'Zákaz kouření ve společných prostorách (výtah, chodby, schody). Používejte popelníky u bazénu. / No smoking in communal areas. Use ashtrays at the pool.',
              },
              {
                icon: AlertTriangle,
                title: 'Bezpečnost / Security',
                text: 'Udržujte hlavní vchod uzamčený. Nepouštějte dovnitř neznámé osoby! / Keep main entrance locked. Do not let unknown visitors in!',
              },
              {
                icon: Trash2,
                title: 'Odpad / Waste',
                text: 'Odneste odpad do kontejnerů na konci ulice, ne do košů u bazénu nebo vchodu. / Take waste to bins at the end of the road, not pool or entrance bins.',
              },
            ].map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-blue flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{rule.title}</h3>
                    <p className="text-sm text-gray-700">{rule.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-accent-red/10 border border-accent-red rounded-lg p-6">
            <p className="text-gray-900 font-semibold mb-2">⚠️ Důležité upozornění / Important Notice</p>
            <p className="text-sm text-gray-700">
              V případě porušení pravidel jsme oprávněni okamžitě zrušit rezervaci bez nároku na vrácení peněz!<br />
              <em>In case of violation of the rules, we are entitled to cancel the reservation immediately without refund!</em>
            </p>
          </div>
        </div>

        {/* Section 4: No Smoking */}
        <div id="section-4" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Cigarette className="w-8 h-8 text-accent-red" />
            <h2 className="text-3xl font-bold text-gray-900">4. Zákaz kouření / No Smoking</h2>
          </div>

          <div className="bg-accent-red/10 border-2 border-accent-red rounded-lg p-6">
            <h3 className="text-xl font-bold text-accent-red mb-4">
              🚭 PŘÍSNÝ ZÁKAZ KOUŘENÍ A VAPOVÁNÍ / NO SMOKING OR VAPING ALLOWED
            </h3>
            <p className="text-gray-700 mb-4">
              Všechny pokoje (kromě teras a balkonů) jsou přísně nekuřácké!<br />
              <em>All rooms (except terraces and balconies) are strictly non-smoking!</em>
            </p>
            <p className="text-gray-700">
              Čištění apartmánu od silného zápachu cigaret nás stojí hodně peněz. 
              Děkujeme za dodržování našich pravidel!<br />
              <em>It costs us a lot of money to clean the apartment from the strong smell of cigarette smoke. 
              Thank you for following our regulations!</em>
            </p>
            <p className="text-accent-red font-semibold mt-4">
              ⚠️ Nedodržení může vést k penalizaci! / Non-compliance may result in a penalty!
            </p>
          </div>
        </div>

        {/* Section 5: We Are Not a Hotel */}
        <div id="section-5" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Info className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">5. Nejsme hotel / We Are Not a Hotel</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Neposkytujeme hotelové služby</h3>
              <p className="text-gray-700">
                Nejsme hotel. Neposkytujeme speciální služby, ani za příplatek. 
                Nemáme recepci ani vlastní zaměstnance.<br />
                <em>We are not a hotel. We do not provide special services, not even with extra charges. 
                We do not have a reception or our own employees.</em>
              </p>
            </div>

            <div className="border-l-4 border-primary-blue pl-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-blue" />
                Potřebujete pomoc? / Need Help?
              </h3>
              <p className="text-gray-700 mb-2">
                Problémy s vodou, odpadem, toaletou nebo ztracené klíče?<br />
                <em>Problems with water, waste, toilet or lost keys?</em>
              </p>
              <a href="tel:+34658866886" className="text-primary-blue font-semibold text-lg">
                +34 658 866 886
              </a>
            </div>

            <div className="bg-accent-red/10 border border-accent-red rounded-lg p-4">
              <h3 className="font-bold text-accent-red mb-2">🚨 Naléhavá pomoc / Urgent Help</h3>
              <p className="text-gray-700">
                Potřebujete policii, hasiče nebo lékaře? Volejte <strong>112</strong>!<br />
                <em>Need Police, Firefighters or a Doctor? Call <strong>112</strong>!</em>
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Grocery Shopping */}
        <div id="section-6" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <ShoppingCart className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">6. Nákupy / Grocery Shopping</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              Chápeme, že jste unavení po dlouhé cestě. Proto náš apartmán nabízí zdarma čaj, kávu,
              cukr, sůl, prací prášek, toaletní papír atd.<br />
              <em>We understand that you are tired after a long journey, therefore our apartment offers
              free tea, coffee, sugar, salt, washing powder, tissue paper, etc.</em>
            </p>

            <div className="bg-primary-blue/10 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">🛒 Kde nakoupit / Where to Shop</h3>
              <p className="text-gray-700">
                Další nákupy můžete udělat v obchodě <strong>LIDL</strong> nebo <strong>HiperDino</strong>,
                jen 5 minut pěšky, kde můžete koupit vše, co potřebujete - od potravin po drogerii.<br />
                <em>You can make other purchases at LIDL store or HiperDino, only 5 min away, where you
                can buy everything you need from groceries to drugstore goods.</em>
              </p>
            </div>
          </div>
        </div>

        {/* Section 7: Spanish "Okupas" */}
        <div id="section-7" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-accent-red" />
            <h2 className="text-3xl font-bold text-gray-900">7. Španělské &quot;Okupas&quot;</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-accent-red/10 border border-accent-red rounded-lg p-4">
              <h3 className="font-bold text-accent-red mb-2">⚠️ Varování / Warning</h3>
              <p className="text-gray-700">
                Španělský Nejvyšší soud varoval, že i rekreační apartmány se nedávno staly terčem
                nechtěných obyvatel (okupas).<br />
                <em>The Spanish Supreme Court warned that even summer apartments have recently become
                the target of unwanted residents (okupas).</em>
              </p>
            </div>

            <p className="text-gray-700">
              <strong>Problém:</strong> Neznámá osoba nebo skupina lidí nelegálně obsadí váš apartmán.
              Pokud uplyne více než 48 hodin, stává se to jejich obydlím zaručeným španělskou ústavou.
              Vystěhování pak může trvat roky!<br />
              <em>If more than 48 hours pass, it becomes their dwelling guaranteed by the Spanish
              constitution, and eviction can last for years!</em>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">📊 <strong>49 nemovitostí</strong> je nelegálně obsazeno každý den</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">⚖️ <strong>10,000 žalob</strong> ročně na vystěhování</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">🚨 <strong>520 trestních oznámení</strong> denně</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">🏠 <strong>7,500 vystěhování</strong> ročně soudem</p>
              </div>
            </div>

            <div className="bg-accent-yellow/20 border border-accent-yellow rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2">🔔 Buďte opatrní s domácím telefonem!</h3>
              <p className="text-gray-700">
                Používejte INTERCOM k otevření hlavních dveří pouze pokud víte, kdo stojí venku!
                Informujte o tomto problému své návštěvy!<br />
                <em>Please be careful when using the INTERCOM to open the main entrance door!
                Only use if you know who the person standing outside is!</em>
              </p>
              <p className="text-gray-700 mt-2">
                Pokud uvidíte někoho podezřelého nebo někoho, kdo se snaží násilím dostat do apartmánu,
                okamžitě volejte <strong>112</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Section 8: Fire Extinguisher */}
        <div id="section-8" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-accent-red" />
            <h2 className="text-3xl font-bold text-gray-900">8. Hasicí přístroj / Fire Extinguisher</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Typ:</strong> EXTINTOR PORTATIL 3 KG<br />
                <strong>Model:</strong> VU-3-PP<br />
                <strong>Type:</strong> Dry Chemical Powder Fire Extinguisher
              </p>
            </div>

            <div className="bg-accent-red/10 border border-accent-red rounded-lg p-4">
              <h3 className="font-bold text-accent-red mb-3">🔥 Jak použít / How to Use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Odstraňte pojistný kolík a přerušte pojistný pečetní pruh<br />
                  <em className="text-sm">Remove the safety pin, breaking the safety seal</em>
                </li>
                <li>Stiskněte horní páku a nasměrujte proud na základnu plamenů<br />
                  <em className="text-sm">Press the upper lever and direct the jet at the base of the flames</em>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 9: Safe */}
        <div id="section-9" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">9. Trezor / Safe</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-accent-red/10 border border-accent-red rounded-lg p-4">
              <p className="text-gray-700">
                <strong>⚠️ Nikdy neotevírejte trezor násilím!</strong> V případě poškození budete požádáni
                o zaplacení opravy!<br />
                <em>Never open the safe by force! In case of damage, you will be asked to pay for the repair!</em>
              </p>
              <p className="text-gray-700 mt-2">
                Pokud trezor začne bez důvodu pípat, kontaktujte nás a požádejte o výměnu baterií.<br />
                <em>If the safe starts beeping for no reason, contact us and ask to replace the batteries.</em>
              </p>
            </div>

            <div className="bg-primary-blue/10 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">🔐 Návod k použití IBIZA SAFE:</h3>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">Nastavení kódu / To Program:</p>
                  <ol className="list-decimal list-inside text-gray-700 ml-4">
                    <li>Stiskněte <strong>#</strong></li>
                    <li>Zadejte 4místný kód</li>
                    <li>Znovu zadejte kód</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Otevření/Zavření / To Open/Close:</p>
                  <p className="text-gray-700 ml-4">Zadejte váš 4místný kód<br />
                    <em>Enter your 4 digits code</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 10: Air Conditioning */}
        <div id="section-10" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Thermometer className="w-8 h-8 text-primary-cyan" />
            <h2 className="text-3xl font-bold text-gray-900">10. Klimatizace Daikin / Air Conditioning</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-accent-green/10 border border-accent-green rounded-lg p-4">
              <p className="text-gray-700">
                Prosím, používejte klimatizaci rozumně a neplýtvejte energií. Výroba energie má stále
                obrovský dopad na životní prostředí a čím méně jí použijeme, tím lépe pro všechny! :)<br />
                <em>Please be sure to use the air conditioner wisely and not waste the energy, because
                there is still a massive impact on the environment to produce energy and the less we can
                use of it the better for all! :)</em>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>💡 Tip:</strong> Nepoužívejte žádné jiné ovládací prvky kromě dálkového ovladače.<br />
                <em>Thank you for not using any other controls!</em>
              </p>
            </div>
          </div>
        </div>

        {/* Section 11: Waste Management */}
        <div id="section-11" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Trash2 className="w-8 h-8 text-accent-green" />
            <h2 className="text-3xl font-bold text-gray-900">11. Odpadové hospodářství / Waste Management</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-accent-red/10 border border-accent-red rounded-lg p-4">
              <p className="text-gray-700">
                <strong>⚠️ NEUKLÁDEJTE</strong> odpad z apartmánu do košů u bazénu nebo u vchodových dveří!<br />
                <em>Do NOT place apartment rubbish in the pool bins or front door bins!</em>
              </p>
            </div>

            <div className="bg-accent-green/10 border border-accent-green rounded-lg p-4">
              <p className="text-gray-700">
                <strong>✅ Odneste prosím svůj odpad</strong> do kontejnerů na konci silnice.<br />
                <em>Please take your rubbish to the refuge bins at the end of the road.</em>
              </p>
            </div>

            <p className="text-gray-700">
              Třídění odpadu pomáhá chránit životní prostředí. Děkujeme za vaši spolupráci!<br />
              <em>Waste sorting helps protect the environment. Thank you for your cooperation!</em>
            </p>
          </div>
        </div>

        {/* Section 12: Dogs */}
        <div id="section-12" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Dog className="w-8 h-8 text-primary-blue" />
            <h2 className="text-3xl font-bold text-gray-900">12. Psi / Dogs</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-primary-blue/10 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>🐕 Vaši čtyřnozí přátelé jsou u nás vítáni!</strong><br />
                Rádi vám poskytneme misku na krmení pro vašeho psa.<br />
                <em>Your &quot;four-legged friends&quot; are most welcome here in apartments.
                We are happy to provide a feeding bowl for your dog.</em>
              </p>
            </div>

            <div className="bg-accent-yellow/20 border border-accent-yellow rounded-lg p-4">
              <p className="text-gray-700">
                <strong>💰 Poznámka:</strong> Kvůli vyšším nákladům na údržbu a úklid při pobytu se zvířaty
                je k poplatku za úklid přidáno 20 €.<br />
                <em>Note: Due to the higher maintenance and cleaning costs when staying with pets,
                20 € is added to the cleaning fee.</em>
              </p>
            </div>

            <p className="text-gray-700">
              Informace o místních procházkách najdete v apartmánu.<br />
              <em>You will find information on local walks in the apartment.</em>
            </p>
          </div>
        </div>

        {/* Final Note */}
        <div className="bg-gradient-to-br from-primary-blue to-primary-cyan text-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Děkujeme! / Thank You!</h3>
          <p className="text-lg mb-4">
            Přejeme vám příjemný pobyt v Cielo Dorado!<br />
            We wish you a pleasant stay at Cielo Dorado!
          </p>
          <p className="text-sm">
            Pro jakékoliv dotazy nás neváhejte kontaktovat.<br />
            For any questions, don&apos;t hesitate to contact us.
          </p>
        </div>
      </div>
    </section>
  );
}

