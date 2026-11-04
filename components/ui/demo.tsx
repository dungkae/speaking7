import { useState } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export default function LiquidMetalButtonDemo() {
  const [clicks, setClicks] = useState(0);
  const [visible, setVisible] = useState(true);
  return (
    <main className="ui-demo flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1>Liquid metal</h1>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <LiquidMetalButton label="Get Started" onClick={() => setClicks(value => value + 1)} />
        <LiquidMetalButton label="Hiệu ứng liquid metal" viewMode="icon" onClick={() => setClicks(value => value + 1)} />
        <LiquidMetalButton label="Disabled" disabled />
      </div>
      <p role="status">Đã nhấn: {clicks}</p>
      <button className="demo-toggle" onClick={() => setVisible(value => !value)}>Ẩn / hiện component</button>
      {visible && <LiquidMetalButton label="Lifecycle test" />}
      <a href="index.html">← Về Speaking7</a>
    </main>
  );
}
