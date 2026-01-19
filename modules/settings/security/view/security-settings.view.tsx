import { SecuritySettingsForm } from "../components/security-settings.form";

export function SecuritySettingsView() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Configuración de Seguridad
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona la seguridad de tu cuenta
        </p>
      </div>
      <SecuritySettingsForm />
    </div>
  );
}
