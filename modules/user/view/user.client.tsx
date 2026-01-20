"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Key, Trash2, Shield, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { ProfileForm } from "../components/form/profile.form";
import { EmailForm } from "../components/form/email.form";
import { PasswordForm } from "../components/form/password.form";
import { DeleteAccountForm } from "../components/form/delete-account.form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileClientProps {
  user: {
    name: string | null;
    userName: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
    isTwoFactorEnabled: boolean;
    createdAt: Date;
  };
}

export function UserProfileClient({ user }: UserProfileClientProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="relative h-24 bg-linear-to-r from-primary/80 via-primary to-primary/80">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[20px_20px]" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative -mt-12">
              <div className="absolute -inset-1 rounded-full bg-background" />
              <Avatar className="relative h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                <AvatarFallback className="text-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center sm:text-left flex-1 sm:mt-2">
              <h2 className="text-2xl font-bold">{user.name || "Sin nombre"}</h2>
              {user.userName && (
                <p className="text-muted-foreground">@{user.userName}</p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                {user.emailVerified ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-500/90">
                    <CheckCircle2 className="h-3 w-3" />
                    Email verificado
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Email sin verificar
                  </Badge>
                )}
                {user.isTwoFactorEnabled && (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    2FA Activo
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(user.createdAt)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1.5 bg-muted/50">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Contraseña</span>
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile" className="m-0">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Información del perfil</h3>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu información personal
                    </p>
                  </div>
                </div>
                <ProfileForm
                  defaultValues={{
                    name: user.name,
                    userName: user.userName,
                    image: user.image,
                    email: user.email,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="m-0">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Correo electrónico</h3>
                    <p className="text-sm text-muted-foreground">
                      Cambia tu dirección de correo electrónico
                    </p>
                  </div>
                </div>
                <EmailForm
                  currentEmail={user.email}
                  isVerified={!!user.emailVerified}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="m-0">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cambiar contraseña</h3>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </p>
                  </div>
                </div>
                <PasswordForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="m-0">
            <Card className="border-destructive/30 shadow-lg bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-destructive">
                      Eliminar cuenta
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>
                <DeleteAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
