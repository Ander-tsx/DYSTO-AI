'use client';

import { Sparkles } from 'lucide-react';

export default function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#e0ff4f]/10 text-[#e0ff4f] border border-[#e0ff4f]/20 font-semibold">
      <Sparkles size={9} />
      Sugerido por IA
    </span>
  );
}