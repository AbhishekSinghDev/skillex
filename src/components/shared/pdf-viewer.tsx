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

    const viewport = page.getViewport({ scale: 1.5 });
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

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading PDF...</div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width,
        height,
      }}
    >
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: currentPage <= 1 ? "#ccc" : "#007bff",
            color: "white",
            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            padding: "8px 16px",
            marginLeft: "10px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: currentPage >= totalPages ? "#ccc" : "#007bff",
            color: "white",
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>

      {/* PDF Canvas */}
      <div
        style={{
          height:
            typeof height === "number" ? height - 60 : `calc(${height} - 60px)`,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            height: "fit-content",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
