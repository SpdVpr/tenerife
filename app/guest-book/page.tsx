import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GuestBook from '@/components/sections/GuestBook';

export const metadata = {
  title: 'Guest Book - Informace pro hosty | Cielo Dorado',
  description: 'Důležité informace pro hosty apartmánu Cielo Dorado - pravidla, doprava, kontakty a užitečné tipy.',
};

export default function GuestBookPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <GuestBook />
      </main>
      <Footer />
    </div>
  );
}

