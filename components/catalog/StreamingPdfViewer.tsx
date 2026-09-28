'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  RotateCw
} from 'lucide-react';

interface StreamingPdfViewerProps {
  pdfUrl: string;
  pdfTitle?: string;
  fileSize?: string;
}

interface PageItemProps {
  pageNumber: number;
  pdfDoc: any;
  scale: number;
  rotation: number;
  onVisible: (pageNumber: number) => void;
}

function ContinuousPdfPage({
  pageNumber,
  pdfDoc,
  scale,
  rotation,
  onVisible,
}: PageItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isIntersectingRef = useRef(false);
  const [rendered, setRendered] = useState(false);
  const [pageDim, setPageDim] = useState<{ width: number; height: number } | null>(null);
  const renderTaskRef = useRef<any>(null);

  const renderCanvas = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }

      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale, rotation });
      const canvas = canvasRef.current;
      if (!canvas) return;

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      setPageDim({ width: viewport.width, height: viewport.height });

      const context = canvas.getContext('2d');
      if (!context) return;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;
      const renderTask = page.render({
        canvasContext: context,
        transform,
        viewport,
      });

      renderTaskRef.current = renderTask;
      await renderTask.promise;
      setRendered(true);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error(`Page ${pageNumber} render failed:`, err);
      }
    }
  }, [pdfDoc, pageNumber, scale, rotation]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersectingRef.current = true;
            onVisible(pageNumber);
            renderCanvas();
          } else {
            isIntersectingRef.current = false;
          }
        });
      },
      { rootMargin: '400px 0px 400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNumber, renderCanvas, onVisible]);

  return (
    <div
      ref={wrapperRef}
      id={`pdf-page-${pageNumber}`}
      className="my-4 flex flex-col items-center justify-center relative"
      style={{
        minHeight: pageDim ? `${pageDim.height}px` : '700px',
        minWidth: pageDim ? `${pageDim.width}px` : 'auto',
      }}
    >
      <div className="relative shadow-2xl bg-white rounded-xs overflow-hidden border border-black/30">
        {!rendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2b2b2b] text-white/50 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-gold mb-2" />
            <span>Rendering Page {pageNumber}...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="block" />
      </div>
      <span className="text-[11px] text-white/40 mt-1.5 font-mono tracking-wider">
        Page {pageNumber}
      </span>
    </div>
  );
}

export default function StreamingPdfViewer({
  pdfUrl,
  pdfTitle = 'House of Karvi Catalogue',
  fileSize,
}: StreamingPdfViewerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  // Default size set to 85% as requested
  const [scale, setScale] = useState<number>(0.85);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          disableRange: false,
          disableStream: false,
          disableAutoFetch: true,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to load PDF.js stream:', err);
        if (!isCancelled) {
          setIsLoading(false);
          setErrorMessage(
            err.name === 'MissingPDFException'
              ? 'PDF file not found. Please verify the URL.'
              : `Unable to stream PDF: ${err.message || 'Network error'}.`
          );
        }
      }
    }

    if (pdfUrl) {
      loadPdf();
    }

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  const scrollToPage = (pageNum: number) => {
    const target = document.getElementById(`pdf-page-${pageNum}`);
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNum);
      setPageInput(pageNum.toString());
    }
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      scrollToPage(num);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageVisible = useCallback((visibleNum: number) => {
    setCurrentPage(visibleNum);
    setPageInput(visibleNum.toString());
  }, []);

  const handleZoomIn = () => setScale((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 3.0));
  const handleZoomOut = () => setScale((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.4));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Close tab handler: attempts to close the tab, falls back to redirecting to /catalog if opened directly
  const handleCloseTab = () => {
    if (window.opener || window.history.length <= 1) {
      window.close();
    } else {
      window.close();
      // Fallback if browser blocks script window.close()
      setTimeout(() => {
        window.location.href = '/catalog';
      }, 150);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen flex flex-col bg-[#323639] text-[#e8eaed] overflow-hidden select-none font-sans">
      {/* Adobe Acrobat Style Top Dark Header Toolbar */}
      <header className="h-12 bg-[#202124] border-b border-[#3c4043] px-3 sm:px-4 flex items-center justify-between text-xs shrink-0 z-30 shadow-md">
        {/* Left Section: Close Tab / Back Button & Document Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCloseTab}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-[#2d2f31] hover:bg-red-900/60 hover:text-white text-white/90 transition-colors"
            title="Close viewer tab"
          >
            <X className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[11px] font-medium hidden sm:inline">Close</span>
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="truncate max-w-[140px] sm:max-w-xs md:max-w-md">
            <span className="font-medium text-white/90 text-xs truncate">{pdfTitle}</span>
            {fileSize && <span className="text-white/40 text-[10px] ml-1.5">({fileSize})</span>}
          </div>
        </div>

        {/* Center Section: Adobe Acrobat Style Page Jump & Zoom Controls (Default 85%) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {totalPages > 0 && (
            <div className="flex items-center bg-[#2d2f31] rounded-sm px-1.5 py-0.5 border border-[#3c4043]">
              <button
                type="button"
                onClick={() => currentPage > 1 && scrollToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1 hover:text-brand-gold disabled:opacity-30 transition-colors"
                title="Previous Page"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              <form onSubmit={handlePageSubmit} className="flex items-center px-1">
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => setPageInput(currentPage.toString())}
                  className="w-9 text-center bg-black/40 text-white rounded-xs border border-white/20 text-xs py-0.5 focus:outline-none focus:border-brand-gold font-mono"
                />
                <span className="text-white/50 text-[11px] ml-1">/ {totalPages}</span>
              </form>

              <button
                type="button"
                onClick={() => currentPage < totalPages && scrollToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1 hover:text-brand-gold disabled:opacity-30 transition-colors"
                title="Next Page"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center bg-[#2d2f31] rounded-sm border border-[#3c4043]">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-[#3c4043] rounded-l-sm transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setScale(0.85)}
              className="px-2 text-[11px] font-mono text-white/80 hover:text-white"
              title="Reset Zoom to 85%"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-[#3c4043] rounded-r-sm transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: Rotate, Fullscreen (Download Master PDF REMOVED) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-[#2d2f31] rounded-sm text-white/80 hover:text-white transition-colors"
            title="Rotate Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-[#2d2f31] rounded-sm text-white/80 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Continuous Scroll Area (Adobe Acrobat style) */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto relative flex flex-col items-center bg-[#525659] px-2 sm:px-6 py-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
            <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            <div>
              <p className="text-base font-medium text-white tracking-wide">Loading Catalogue...</p>
              <p className="text-xs text-white/50 mt-1 font-light tracking-wide">
                Preparing high-resolution architectural pages
              </p>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {errorMessage && !isLoading && (
          <div className="max-w-md p-6 bg-red-950/60 border border-red-500/40 text-center space-y-4 rounded-xs my-auto shadow-2xl">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-xs text-red-200 leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Continuous Page List (All pages scroll smoothly like Acrobat Reader) */}
        {!isLoading && pdfDoc && totalPages > 0 && (
          <div className="w-full flex flex-col items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <ContinuousPdfPage
                key={`page-${pageNum}`}
                pageNumber={pageNum}
                pdfDoc={pdfDoc}
                scale={scale}
                rotation={rotation}
                onVisible={handlePageVisible}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
