'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Import PDFViewer with SSR disabled to avoid DOMMatrix error
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Načítání PDF vieweru...</p>
      </div>
    </div>
  ),
});

export default function GuestBookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <PDFViewer />
      </main>
      <Footer />
    </div>
  );
}

