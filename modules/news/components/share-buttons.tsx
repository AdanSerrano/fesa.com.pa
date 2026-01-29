"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  labels: {
    share: string;
    linkCopied: string;
    shareError: string;
  };
}

export const ShareButton = memo(function ShareButton({
  url,
  title,
  text,
  labels,
}: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    const shareData = {
      title,
      text: text || title,
      url,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await fallbackCopyToClipboard(url, labels.linkCopied);
        }
      }
    } else {
      await fallbackCopyToClipboard(url, labels.linkCopied);
    }
  }, [url, title, text, labels.linkCopied]);

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleShare}
      className="group relative gap-2.5 w-full overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      <Share2 className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
      <span className="font-medium">{labels.share}</span>
    </Button>
  );
});

async function fallbackCopyToClipboard(url: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success(successMessage);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toast.success(successMessage);
  }
}
