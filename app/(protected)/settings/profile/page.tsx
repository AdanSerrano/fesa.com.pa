import { Suspense } from "react";
import { UserProfileView } from "@/modules/user/view/user.view";
import { UserProfileSkeleton } from "@/modules/user/components/user.skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Configuración",
  description: "Administra tu información de usuario",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[200px] w-[200px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

          <div className="container px-4 py-12 md:px-6 md:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Settings className="mr-1 h-3 w-3" />
                Configuración
              </Badge>

              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Tu perfil
              </h1>

              <p className="text-muted-foreground">
                Administra tu información personal y preferencias de cuenta.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfileView />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
