import { Suspense } from "react";
import { ContactView } from "@/modules/contact/view/contact.view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Contacto",
  description: "Contáctanos para cualquier pregunta o comentario",
};

function ContactSkeleton() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 h-[50vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />

      <div className="container mx-auto px-4 py-6 sm:py-10 relative">
        <Skeleton className="h-5 w-32 mb-8" />

        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-28 rounded-full mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border p-5">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-40" />
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-3">
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-xl border shadow-xl p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-11 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-32 w-full" />
                </div>

                <Skeleton className="h-11 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactView />
    </Suspense>
  );
}
