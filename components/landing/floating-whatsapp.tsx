"use client";

import { memo } from "react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
}

function FloatingWhatsAppComponent({ phoneNumber, message }: FloatingWhatsAppProps) {
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const whatsappUrl = `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#128C7E]" />
      </span>
    </a>
  );
}

export const FloatingWhatsApp = memo(FloatingWhatsAppComponent);
FloatingWhatsApp.displayName = "FloatingWhatsApp";
