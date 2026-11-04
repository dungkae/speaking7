import { createRoot } from "react-dom/client";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import "./styles/ui.css";

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
if (import.meta.hot) import.meta.hot.dispose(() => { roots.forEach(root => root.unmount()); roots.clear(); });
