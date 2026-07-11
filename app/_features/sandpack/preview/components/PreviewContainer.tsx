import { useEffect, useRef } from "react";

const ZOOM_FACTOR = 1;

export default function PreviewContainer({
  children,
  viewportWidth = 390,
  viewportBehavior = "fixed",
}: {
  children: React.ReactNode;
  viewportWidth?: number;
  viewportBehavior?: "auto" | "fixed";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateZoom = () => {
      if (ref.current) {
        const windowHeight = window.innerHeight;
        const clientHeight = ref.current.clientHeight;
        const idealZoom = windowHeight / clientHeight;
        const scale = Math.round(Math.min(Math.max(idealZoom, 0.15), 1) * ZOOM_FACTOR * 100) / 100;
        ref.current.style.transform = `scale(${scale.toString()})`;
      }
    };

    const initialZoom = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateZoom();
      }, 200);
    };

    initialZoom();

    const resizeObserver = new ResizeObserver(() => {
      updateZoom();
    });

    resizeObserver.observe(ref.current);

    const handleWindowResize = () => {
      updateZoom();
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div ref={ref} data-role="preview-container" className="preview-container">
      <div
        className="preview-inner"
        style={
          viewportBehavior === "auto"
            ? { containerType: "normal" }
            : { width: `${viewportWidth}px`, containerType: "inline-size" }
        }
      >
        {children}
      </div>
    </div>
  );
}
