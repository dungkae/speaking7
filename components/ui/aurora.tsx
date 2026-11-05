"use client";

import { useMemo, type ComponentProps, type Ref } from "react";

import { useInView } from "@/components/ui/aurora-utils/use-in-view";
import { cn } from "@/lib/utils";

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map(ref => {
      if (typeof ref === "function") return ref(node);
      if (ref) ref.current = node;
    });
    return () => refs.forEach((ref, index) => {
      const cleanup = cleanups[index];
      if (typeof cleanup === "function") cleanup();
      else if (typeof ref === "function") ref(null);
      else if (ref) ref.current = null;
    });
  };
}

const LIGHTS = [
  { left: "-9%", top: "-14%", pace: 1, start: 0 },
  { left: "37%", top: "-7%", pace: 1.35, start: -0.3 },
  { left: "15%", top: "32%", pace: 1.7, start: -0.65 },
];

interface AuroraProps extends ComponentProps<"div"> {
  /** Three CSS colors, one per light. */
  colors?: [string, string, string];
  /** Seconds for the fastest light to finish one drift. */
  duration?: number;
  /** Opacity of the lights, from 0 to 1. */
  intensity?: number;
}

function Aurora({
  colors = [
    "var(--primary, var(--color-primary))",
    "var(--muted-foreground, var(--color-muted-foreground))",
    "var(--accent-foreground, var(--color-accent-foreground))",
  ],
  duration = 20,
  intensity = 0.3,
  className,
  children,
  ref,
  ...props
}: AuroraProps) {
  const [observe, inView] = useInView<HTMLDivElement>({ rootMargin: "200px" });
  const mergedRef = useMemo(() => mergeRefs(ref, observe), [ref, observe]);

  return (
    <div
      ref={mergedRef}
      data-slot="aurora"
      className={cn("relative isolate overflow-hidden", className)}
      {...props}
    >
      <div aria-hidden="true" data-slot="aurora-lights" className="pointer-events-none absolute inset-0 -z-10">
        {LIGHTS.map((light, index) => (
          <span
            key={index}
            className="animate-aurora absolute size-[75%] rounded-full motion-reduce:animate-none"
            style={{
              left: light.left,
              top: light.top,
              background: `radial-gradient(closest-side, ${colors[index]}, transparent)`,
              opacity: intensity,
              animationDuration: `${duration * light.pace}s`,
              animationDelay: `${duration * light.start}s`,
              animationPlayState: inView ? "running" : "paused",
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

export default Aurora;
export { type AuroraProps };
