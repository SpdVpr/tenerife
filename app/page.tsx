import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import WhyChoose from '@/components/sections/WhyChoose';
import ApartmentDetails from '@/components/sections/ApartmentDetails';
import Pricing from '@/components/sections/Pricing';
import Gallery from '@/components/sections/Gallery';
import Location from '@/components/sections/Location';
import Booking from '@/components/sections/Booking';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhyChoose />
        <ApartmentDetails />
        <Gallery />
        <Location />
        <Pricing />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
