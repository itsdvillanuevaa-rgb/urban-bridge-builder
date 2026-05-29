import { useRef, useEffect } from "react";

export function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // Only scroll horizontally if container is overflowing (meaning scrollWidth > clientWidth)
      if (el.scrollWidth <= el.clientWidth) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = elRef.current;
    if (!el) return;

    // Only allow drag scroll if container is overflowing
    if (el.scrollWidth <= el.clientWidth) return;

    el.style.cursor = "grabbing";
    el.style.userSelect = "none";

    const startX = e.pageX - el.offsetLeft;
    const scrollLeft = el.scrollLeft;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      el.style.cursor = "";
      el.style.removeProperty("user-select");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return { ref: elRef, onMouseDown };
}
