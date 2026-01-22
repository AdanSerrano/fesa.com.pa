"use client";

import { memo, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserCog, Shield, ShieldCheck, AlertTriangle } from "lucide-react";
import { Role } from "@/app/prisma/enums";
import type { AdminUser } from "../../types/admin-users.types";

interface ChangeRoleDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onChangeRole: (userId: string, newRole: Role) => void;
}

export const ChangeRoleDialog = memo(function ChangeRoleDialog({
  user,
  open,
  isPending,
  onClose,
  onChangeRole,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleClose = useCallback(() => {
    setSelectedRole(null);
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!user || !selectedRole) return;
    onChangeRole(user.id, selectedRole);
  }, [user, selectedRole, onChangeRole]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen && user) {
        setSelectedRole(user.role);
      }
      if (!isOpen) {
        handleClose();
      }
    },
    [user, handleClose]
  );

  if (!user) return null;

  const isChangingToAdmin = selectedRole === Role.ADMIN && user.role !== Role.ADMIN;
  const hasChanges = selectedRole !== null && selectedRole !== user.role;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Cambiar Rol de Usuario
          </DialogTitle>
          <DialogDescription>
            Selecciona el nuevo rol para {user.name || user.email}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={selectedRole || user.role}
            onValueChange={(value) => setSelectedRole(value as Role)}
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value={Role.USER} id="role-user" />
              <Label
                htmlFor="role-user"
                className="flex flex-1 cursor-pointer items-center gap-3"
              >
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Usuario</p>
                  <p className="text-sm text-muted-foreground">
                    Acceso estándar a la plataforma
                  </p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value={Role.ADMIN} id="role-admin" />
              <Label
                htmlFor="role-admin"
                className="flex flex-1 cursor-pointer items-center gap-3"
              >
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-sm text-muted-foreground">
                    Acceso completo al panel de administración
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {isChangingToAdmin && (
            <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Al otorgar permisos de administrador, este usuario tendrá acceso
                a todas las funciones de gestión, incluyendo la administración
                de otros usuarios.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !hasChanges}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
