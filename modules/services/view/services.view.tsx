import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserSessionAction } from "../actions/services.actions";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Settings,
  Mail,
  User,
  Hash,
  Crown,
  ArrowRight,
  Key,
  Activity,
} from "lucide-react";

export async function ServicesView() {
  const result = await getUserSessionAction();

  if (result.error || !result.user) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const { user } = result;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl bg-linear-to-br from-card via-card to-muted/20">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5" />
        <CardHeader className="relative pb-0">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary/50 to-primary/20 blur-sm" />
              <Avatar className="relative h-20 w-20 border-4 border-background shadow-xl">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                <AvatarFallback className="text-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              {user.isTwoFactorEnabled && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold">{user.name ?? "Usuario"}</h2>
            {user.userName && (
              <p className="text-sm text-muted-foreground">@{user.userName}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                {user.role}
              </Badge>
              <Badge
                variant={user.isTwoFactorEnabled ? "default" : "outline"}
                className={user.isTwoFactorEnabled ? "bg-green-500 hover:bg-green-500/90" : ""}
              >
                {user.isTwoFactorEnabled ? (
                  <>
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    2FA Activo
                  </>
                ) : (
                  <>
                    <ShieldOff className="mr-1 h-3 w-3" />
                    2FA Inactivo
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <InfoRow
              icon={<Hash className="h-4 w-4" />}
              label="ID"
              value={
                <span className="font-mono text-xs">
                  {user.id.slice(0, 8)}...
                </span>
              }
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="Nombre"
              value={user.name ?? "-"}
            />
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email ?? "-"}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        <QuickActionCard
          href="/settings/profile"
          icon={<Settings className="h-5 w-5" />}
          title="Configuración"
          description="Edita tu perfil y preferencias"
          color="primary"
        />
        <QuickActionCard
          href="/settings/security"
          icon={<Shield className="h-5 w-5" />}
          title="Seguridad"
          description="2FA y actividad de tu cuenta"
          color="green"
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color = "primary",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "primary" | "green" | "blue";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    green: "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white",
    blue: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
  };

  return (
    <Link href={href} className="group">
      <Card className="border-border/50 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${colorClasses[color]}`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
