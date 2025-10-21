'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Guest Book
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Příručka pro hosty / Guide for Guests
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/Guest Book_new.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-cyan transition-colors shadow-lg hover:shadow-xl"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Otevřít v novém okně / Open in New Tab</span>
          </a>
          
          <a
            href="/Guest Book_new.pdf"
            download="Cielo_Dorado_Guest_Book.pdf"
            className="inline-flex items-center space-x-2 bg-white text-primary-blue border-2 border-primary-blue px-6 py-3 rounded-lg hover:bg-primary-blue hover:text-white transition-colors shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Stáhnout PDF / Download PDF</span>
          </a>
        </div>
      </div>

      {/* PDF Controls */}
      {!isLoading && numPages > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg bg-primary-blue text-white hover:bg-primary-cyan disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-gray-700 font-medium px-4">
              Strana {pageNumber} z {numPages}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-lg bg-primary-blue text-white hover:bg-primary-cyan disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-gray-700 font-medium px-4">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={scale >= 2.0}
              className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-center p-4 bg-gray-100">
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Načítání PDF...</p>
            </div>
          )}
          
          <Document
            file="/Guest Book_new.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Načítání PDF...</p>
              </div>
            }
            error={
              <div className="text-center py-20 px-4">
                <p className="text-red-600 mb-4">
                  Nepodařilo se načíst PDF.
                  <br />
                  <em>Failed to load PDF.</em>
                </p>
                <a
                  href="/Guest Book_new.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-primary-cyan transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Otevřít PDF / Open PDF</span>
                </a>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Tip:</strong> Použijte tlačítka pro navigaci mezi stránkami a přiblížení/oddálení.
          <br />
          <em>Use the buttons to navigate between pages and zoom in/out.</em>
        </p>
      </div>
    </div>
  );
}

