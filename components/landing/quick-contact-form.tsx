"use client";

import { memo, useCallback } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface QuickContactFormProps {
  labels: {
    placeholder: string;
    button: string;
    sending: string;
    success: string;
  };
}

type FormState = {
  success: boolean;
  message: string;
};

async function submitForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email" };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: "Success" };
}

function QuickContactFormComponent({ labels }: QuickContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitForm, {
    success: false,
    message: "",
  });

  if (state.success) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
        <CheckCircle2 className="h-5 w-5" />
        {labels.success}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <Input
        type="email"
        name="email"
        placeholder={labels.placeholder}
        required
        className="h-12 px-5 rounded-full bg-background/80 backdrop-blur border-muted-foreground/20 focus:border-primary"
        disabled={isPending}
      />
      <Button
        type="submit"
        size="lg"
        className="h-12 px-8 rounded-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {labels.sending}
          </>
        ) : (
          <>
            {labels.button}
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export const QuickContactForm = memo(QuickContactFormComponent);
QuickContactForm.displayName = "QuickContactForm";
