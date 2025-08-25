import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PDFJSViewerProps {
  pdfUrl: string;
  width?: string | number;
  height?: string | number;
}

const PDFViewer: React.FC<PDFJSViewerProps> = ({
  pdfUrl,
  width = "100%",
  height = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load PDF.js from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      loadPDF();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [pdfUrl]);

  const loadPDF = async () => {
    try {
      // @ts-ignore
      const pdfjsLib = window.pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setLoading(false);
      renderPage(1, pdf);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setLoading(false);
    }
  };

  const renderPage = async (pageNum: number, pdf = pdfDoc) => {
    if (!pdf || !canvasRef.current) return;

    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const viewport = page.getViewport({ scale, rotation });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      renderPage(pageNum);
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.2, 3);
    setScale(newScale);
    renderPage(currentPage);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 0.5);
    setScale(newScale);
    renderPage(currentPage);
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    renderPage(currentPage);
  };

  const handleFitToWidth = () => {
    setScale(1.0);
    renderPage(currentPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background" style={{ width, height }}>
      {/* Toolbar */}
      <div className="flex justify-between items-center p-4 bg-muted/30 sticky top-0 z-10">
        {isMobile ? (
          // Mobile Layout - Dropdown Menu
          <>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                size="icon"
                variant="default"
              >
                <ChevronLeft />
              </Button>

              <div className="px-2 py-1 bg-background rounded-lg border border-border text-xs">
                <span className="text-foreground font-medium">
                  {currentPage}/{totalPages}
                </span>
              </div>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                size="icon"
                variant="default"
              >
                <ChevronRight />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                  <Menu size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleZoomOut}>
                  <ZoomOut size={16} />
                  Zoom Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleZoomIn}>
                  <ZoomIn size={16} />
                  Zoom In
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRotate}>
                  <RotateCw size={16} />
                  Rotate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  Zoom: {Math.round(scale * 100)}%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          // Desktop Layout - Original
          <>
            {/* Navigation Controls */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                size="icon"
                variant="default"
              >
                <ChevronLeft />
              </Button>

              <div className="px-3 py-2 bg-background rounded-lg border border-border text-sm">
                <span className="text-foreground font-medium">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                size="icon"
                variant="default"
              >
                <ChevronRight />
              </Button>
            </div>

            {/* Zoom and Action Controls */}
            <div className="flex items-center space-x-2">
              <Button onClick={handleZoomOut} size="icon" variant="secondary">
                <ZoomOut size={16} />
              </Button>

              <div className="px-3 py-2 bg-background rounded-lg border border-border text-sm min-w-[60px] text-center">
                <span className="text-foreground font-medium">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <Button onClick={handleZoomIn} size="icon" variant="secondary">
                <ZoomIn size={16} />
              </Button>

              <Button
                onClick={handleRotate}
                size="icon"
                variant="secondary"
                title="Rotate"
              >
                <RotateCw size={16} />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* PDF Canvas */}
      <div
        className="overflow-auto flex justify-center bg-background p-4"
        style={{
          height:
            typeof height === "number" ? height - 72 : `calc(${height} - 72px)`,
        }}
      >
        <canvas ref={canvasRef} className="max-w-full h-fit shadow-sm" />
      </div>
    </div>
  );
};

export default PDFViewer;
