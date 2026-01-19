import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserSessionAction } from "../actions/services.actions";

export async function ServicesView() {
  const result = await getUserSessionAction();

  if (result.error || !result.user) {
    return (
      <Card className="w-full border-border/40 shadow-lg">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const { user } = result;

  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.name ?? "Usuario"}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <InfoRow label="ID" value={user.id} />
          <InfoRow label="Username" value={user.userName ?? "-"} />
          <InfoRow label="Nombre" value={user.name ?? "-"} />
          <InfoRow label="Email" value={user.email ?? "-"} />
          <InfoRow
            label="Rol"
            value={<Badge variant="secondary">{user.role}</Badge>}
          />
          <InfoRow
            label="2FA"
            value={
              <Badge variant={user.isTwoFactorEnabled ? "default" : "outline"}>
                {user.isTwoFactorEnabled ? "Activado" : "Desactivado"}
              </Badge>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
