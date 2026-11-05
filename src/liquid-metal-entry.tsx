import { createRoot } from "react-dom/client";
import BorderBeam from "@/components/ui/border-beam";
import Aurora from "@/components/ui/aurora";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import "./styles/ui.css";

const backdrop = document.getElementById("auroraBackdrop");
const backdropRoot = backdrop ? createRoot(backdrop) : null;
backdropRoot?.render(
  <Aurora
    className="size-full"
    colors={["var(--aurora-silver)", "var(--aurora-smoke)", "var(--aurora-ash)"]}
    duration={9}
    intensity={0.27}
  />,
);

const beamHost = document.getElementById("chatBeamHost");
const beamRoot = beamHost ? createRoot(beamHost) : null;
beamRoot?.render(
  <BorderBeam
    size="md"
    colorVariant="mono"
    borderRadius={18}
    duration={4}
    strength={0.48}
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    <span aria-hidden="true" />
  </BorderBeam>,
);

// Keep the native controls, their IDs, disabled/display state and legacy listeners.
const roots = new Map<HTMLButtonElement, ReturnType<typeof createRoot>>();
for (const [id, label] of [["sendToBotBtn", "Chấm Part hiện tại"], ["sendFullBtn", "Chấm cả bài"]]) {
  const button = document.getElementById(id);
  if (!(button instanceof HTMLButtonElement)) continue;
  button.setAttribute("aria-label", button.textContent?.trim() || label);
  button.classList.add("liquid-metal-host");
  const root = createRoot(button);
  roots.set(button, root);
  root.render(<LiquidMetalButton label={label} hostButton={button} width="fill" />);
}
if (import.meta.hot) import.meta.hot.dispose(() => { backdropRoot?.unmount(); beamRoot?.unmount(); roots.forEach(root => root.unmount()); roots.clear(); });
