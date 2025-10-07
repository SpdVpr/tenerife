'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Vše' },
  { id: 'view', name: 'Výhled' },
  { id: 'living-room', name: 'Obývací pokoj' },
  { id: 'bedroom', name: 'Ložnice' },
  { id: 'kitchen', name: 'Kuchyň' },
  { id: 'bathroom', name: 'Koupelna' },
  { id: 'terrace', name: 'Terasa' },
  { id: 'pool', name: 'Bazén' },
  { id: 'exterior', name: 'Exteriér' },
];

// Generujeme seznam obrázků na základě optimalizovaných fotek
const galleryImages = [
  // View images (1, 2, 32, 33, 34)
  { src: '/images/optimized/view/image00001-medium.webp', category: 'view', alt: 'Výhled na oceán 1' },
  { src: '/images/optimized/view/image00002-medium.webp', category: 'view', alt: 'Výhled na oceán 2' },
  { src: '/images/optimized/view/image00032-medium.webp', category: 'view', alt: 'Výhled na oceán 3' },
  { src: '/images/optimized/view/image00033-medium.webp', category: 'view', alt: 'Výhled na oceán 4' },
  { src: '/images/optimized/view/image00034-medium.webp', category: 'view', alt: 'Výhled na oceán 5' },

  // Living room images (9, 10, 12, 13, 14, 25)
  { src: '/images/optimized/view/image00009-medium.webp', category: 'living-room', alt: 'Obývací pokoj 1' },
  { src: '/images/optimized/view/image00010-medium.webp', category: 'living-room', alt: 'Obývací pokoj 2' },
  { src: '/images/optimized/view/image00012-medium.webp', category: 'living-room', alt: 'Obývací pokoj 3' },
  { src: '/images/optimized/view/image00013-medium.webp', category: 'living-room', alt: 'Obývací pokoj 4' },
  { src: '/images/optimized/view/image00014-medium.webp', category: 'living-room', alt: 'Obývací pokoj 5' },
  { src: '/images/optimized/view/image00025-medium.webp', category: 'living-room', alt: 'Obývací pokoj 6' },

  // Bedroom images (22, 23)
  { src: '/images/optimized/view/image00022-medium.webp', category: 'bedroom', alt: 'Ložnice 1' },
  { src: '/images/optimized/view/image00023-medium.webp', category: 'bedroom', alt: 'Ložnice 2' },

  // Kitchen images (4, 6, 7)
  { src: '/images/optimized/view/image00004-medium.webp', category: 'kitchen', alt: 'Kuchyň 1' },
  { src: '/images/optimized/view/image00006-medium.webp', category: 'kitchen', alt: 'Kuchyň 2' },
  { src: '/images/optimized/view/image00007-medium.webp', category: 'kitchen', alt: 'Kuchyň 3' },

  // Bathroom images (17, 19, 20)
  { src: '/images/optimized/view/image00017-medium.webp', category: 'bathroom', alt: 'Koupelna 1' },
  { src: '/images/optimized/view/image00019-medium.webp', category: 'bathroom', alt: 'Koupelna 2' },
  { src: '/images/optimized/view/image00020-medium.webp', category: 'bathroom', alt: 'Koupelna 3' },

  // Terrace images (24, 35, 36, 37)
  { src: '/images/optimized/view/image00024-medium.webp', category: 'terrace', alt: 'Terasa 1' },
  { src: '/images/optimized/view/image00035-medium.webp', category: 'terrace', alt: 'Terasa 2' },
  { src: '/images/optimized/view/image00036-medium.webp', category: 'terrace', alt: 'Terasa 3' },
  { src: '/images/optimized/view/image00037-medium.webp', category: 'terrace', alt: 'Terasa 4' },

  // Pool images (26, 27, 30)
  { src: '/images/optimized/view/image00026-medium.webp', category: 'pool', alt: 'Bazén 1' },
  { src: '/images/optimized/view/image00027-medium.webp', category: 'pool', alt: 'Bazén 2' },
  { src: '/images/optimized/view/image00030-medium.webp', category: 'pool', alt: 'Bazén 3' },

  // Exterior images (42, 34, 33, 40, 1, 2)
  { src: '/images/optimized/view/image00042-medium.webp', category: 'exterior', alt: 'Exteriér 1' },
  { src: '/images/optimized/view/image00034-medium.webp', category: 'exterior', alt: 'Exteriér 2' },
  { src: '/images/optimized/view/image00033-medium.webp', category: 'exterior', alt: 'Exteriér 3' },
  { src: '/images/optimized/view/image00040-medium.webp', category: 'exterior', alt: 'Exteriér 4' },
  { src: '/images/optimized/view/image00001-medium.webp', category: 'exterior', alt: 'Exteriér 5' },
  { src: '/images/optimized/view/image00002-medium.webp', category: 'exterior', alt: 'Exteriér 6' },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 16;

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galerie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prohlédněte si fotografie apartmánu a okolí
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-blue to-primary-cyan text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div
              key={index}
              onClick={() => openLightbox(startIndex + index)}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-primary-blue to-primary-cyan text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Image Count */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Zobrazeno <span className="font-bold text-primary-blue">{startIndex + 1}-{Math.min(endIndex, filteredImages.length)}</span> z <span className="font-bold text-primary-blue">{filteredImages.length}</span> fotografií
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative max-w-7xl max-h-full w-full h-full">
              <Image
                src={filteredImages[currentImageIndex].src}
                alt={filteredImages[currentImageIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-white font-medium">
              {currentImageIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

