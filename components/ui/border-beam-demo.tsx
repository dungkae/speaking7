import { ArrowUp, AtSign, ChevronDown } from "lucide-react";
import BorderBeam from "@/components/ui/border-beam";

const chip = "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-300";

export default function BorderBeamDemo() {
  return (
    <div className="mx-auto grid min-h-64 w-full max-w-[600px] place-items-center rounded-3xl bg-[#0d0d0f] p-4">
      <div className="w-full max-w-[348px] motion-reduce:[&_[data-beam]]:animate-none">
        <BorderBeam size="md" colorVariant="colorful" borderRadius={20} duration={4}>
          <div className="flex min-h-[122px] flex-col items-start gap-3 rounded-[20px] bg-[#1d1d1d] p-3">
            <span className={chip}><AtSign size={14} aria-hidden="true" /></span>
            <span className="text-sm text-zinc-400">Build anything…</span>
            <div className="mt-auto flex w-full items-center gap-2">
              <span className={chip}>Agent <ChevronDown size={14} aria-hidden="true" /></span>
              <span className={chip}>Auto <ChevronDown size={14} aria-hidden="true" /></span>
              <span className={`${chip} ml-auto`}><ArrowUp size={16} aria-hidden="true" /></span>
            </div>
          </div>
        </BorderBeam>
      </div>
    </div>
  );
}
