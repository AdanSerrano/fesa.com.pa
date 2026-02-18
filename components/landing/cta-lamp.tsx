"use client";

import { memo } from "react";
import { Lamp } from "@/components/ui/lamp";

interface CtaLampProps {
  title: string;
}

const CtaLampComponent = memo(function CtaLampInner({ title }: CtaLampProps) {
  return (
    <Lamp>
      <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">
        {title}
      </h2>
    </Lamp>
  );
});

CtaLampComponent.displayName = "CtaLamp";

export const CtaLamp = CtaLampComponent;
