import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  /** Use the app's existing native button, preserving its ID and listeners. */
  hostButton?: HTMLButtonElement;
  width?: number | "fill";
}

type Ripple = { x: number; y: number; id: number };

export function LiquidMetalButton({
  label = "Get Started", onClick, viewMode = "text", disabled = false,
  className, icon, hostButton, width,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hostDisabled, setHostDisabled] = useState(hostButton?.disabled ?? false);
  const shaderRef = useRef<HTMLSpanElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const hovered = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const isDisabled = hostButton ? hostDisabled : disabled;
  const motion = useRef({ reducedMotion, isDisabled });
  motion.current = { reducedMotion, isDisabled };

  const dimensions = useMemo(() => ({
    width: width === "fill" ? "100%" : width ?? (viewMode === "icon" ? 46 : 142),
    height: 46,
  }), [viewMode, width]);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => { timers.current.delete(timer); callback(); }, delay);
    timers.current.add(timer);
  }, []);

  const setSpeed = useCallback((speed: number) => {
    shaderMount.current?.setSpeed(motion.current.reducedMotion || motion.current.isDisabled ? 0 : speed);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!hostButton) return;
    const sync = () => setHostDisabled(hostButton.disabled);
    const observer = new MutationObserver(sync);
    observer.observe(hostButton, { attributes: true, attributeFilter: ["disabled"] });
    sync();
    return () => observer.disconnect();
  }, [hostButton]);

  useEffect(() => {
    const container = shaderRef.current;
    if (!container) return;
    // Silver gradient remains usable when WebGL 2 is unavailable.
    let disposed = false;
    try {
      const mount = new ShaderMount(container, liquidMetalFragmentShader, {
        u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
        u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1,
        u_offsetX: 0.1, u_offsetY: -0.1,
        u_fit: 1, u_rotation: 0, u_originX: 0.5, u_originY: 0.5,
        u_worldWidth: 0, u_worldHeight: 0,
        u_isImage: false, u_colorBack: [0, 0, 0, 0], u_colorTint: [1, 1, 1, 0],
      }, undefined, motion.current.reducedMotion || motion.current.isDisabled ? 0 : 0.6);
      shaderMount.current = mount;
      container.dataset.renderer = "webgl";
      // Context loss affects decoration only, never the underlying action.
      const lost = () => { if (!disposed) container.dataset.renderer = "fallback"; };
      const restored = () => { if (!disposed) container.dataset.renderer = "webgl"; };
      mount.canvasElement.addEventListener("webglcontextlost", lost);
      mount.canvasElement.addEventListener("webglcontextrestored", restored);
      return () => {
        disposed = true;
        mount.canvasElement.removeEventListener("webglcontextlost", lost);
        mount.canvasElement.removeEventListener("webglcontextrestored", restored);
        mount.dispose();
        shaderMount.current = null;
      };
    } catch {
      container.replaceChildren();
      container.dataset.renderer = "fallback";
    }
  }, []);

  useEffect(() => { setSpeed(isHovered ? 1 : 0.6); }, [isHovered, isDisabled, reducedMotion, setSpeed]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  const enter = useCallback(() => { hovered.current = true; setIsHovered(true); setSpeed(1); }, [setSpeed]);
  const leave = useCallback(() => { hovered.current = false; setIsHovered(false); setIsPressed(false); setSpeed(0.6); }, [setSpeed]);
  const press = useCallback(() => setIsPressed(true), []);
  const release = useCallback(() => setIsPressed(false), []);
  const click = useCallback((event: globalThis.MouseEvent | MouseEvent<HTMLButtonElement>) => {
    const button = hostButton ?? buttonRef.current;
    if (!button || button.disabled) return;
    if (!motion.current.reducedMotion) {
      setSpeed(2.4);
      schedule(() => setSpeed(hovered.current ? 1 : 0.6), 300);
      const bounds = button.getBoundingClientRect();
      const keyboard = event.detail === 0;
      const ripple = {
        x: keyboard ? bounds.width / 2 : event.clientX - bounds.left,
        y: keyboard ? bounds.height / 2 : event.clientY - bounds.top,
        id: rippleId.current++,
      };
      setRipples(items => [...items, ripple]);
      schedule(() => setRipples(items => items.filter(item => item.id !== ripple.id)), 600);
    }
    onClick?.();
  }, [hostButton, onClick, schedule, setSpeed]);

  useEffect(() => {
    if (!hostButton) return;
    const listeners = { pointerenter: enter, pointerleave: leave, pointerdown: press, pointerup: release, pointercancel: release, blur: leave, click };
    for (const [name, callback] of Object.entries(listeners)) hostButton.addEventListener(name, callback as EventListener, name === "click");
    return () => { for (const [name, callback] of Object.entries(listeners)) hostButton.removeEventListener(name, callback as EventListener, name === "click"); };
  }, [hostButton, enter, leave, press, release, click]);

  const layers = (
    <span className={cn("lm-stage relative inline-block", className)} style={{ width: dimensions.width, height: dimensions.height }} data-hovered={isHovered} data-pressed={isPressed} data-disabled={isDisabled}>
      <span className="lm-shape lm-metal" aria-hidden="true"><span ref={shaderRef} className="lm-shader" /></span>
      <span className="lm-shape lm-inset" aria-hidden="true" />
      <span className="lm-label flex items-center justify-center gap-1.5" aria-hidden={hostButton ? true : undefined}>
        {viewMode === "icon" ? icon ?? <Sparkles size={16} aria-hidden="true" /> : label}
      </span>
      <span className="lm-ripples" aria-hidden="true">
        {ripples.map(ripple => <span key={ripple.id} className="lm-ripple" style={{ left: ripple.x, top: ripple.y } as CSSProperties} />)}
      </span>
    </span>
  );
  if (hostButton) return layers;
  return (
    <button ref={buttonRef} type="button" className="lm-button" disabled={disabled} aria-label={label}
      onClick={click} onPointerEnter={enter} onPointerLeave={leave} onPointerDown={press} onPointerUp={release} onPointerCancel={release} onBlur={leave}>
      {layers}
    </button>
  );
}
