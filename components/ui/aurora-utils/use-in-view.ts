"use client";

import { useEffect, useState } from "react";

export function useInView<T extends Element>({ rootMargin = "0px" } = {}) {
  const [node, observe] = useState<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin]);

  return [observe, inView] as const;
}
