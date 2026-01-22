import { Suspense } from "react";
import { getUsersAction } from "../actions/admin-users.actions";
import { AdminUsersClient } from "./admin-users.client";
import { AdminUsersSkeleton } from "../components/admin-users.skeleton";
import type { AdminUsersFilters, AdminUsersSorting } from "../types/admin-users.types";
import type { Role } from "@/app/prisma/enums";

interface AdminUsersViewProps {
  searchParams?: {
    users_page?: string;
    users_pageSize?: string;
    users_sort?: string;
    users_sortDir?: string;
    users_search?: string;
    users_role?: string;
    users_status?: string;
  };
}

/**
 * Server Component que hace el fetch inicial.
 * Los datos se pasan al Client Component para la interactividad.
 */
export async function AdminUsersView({ searchParams }: AdminUsersViewProps) {
  const params = await Promise.resolve(searchParams || {});

  const page = params.users_page ? parseInt(params.users_page, 10) : 1;
  const pageSize = params.users_pageSize ? parseInt(params.users_pageSize, 10) : 10;
  const sort = params.users_sort || "createdAt";
  const sortDir = (params.users_sortDir || "desc") as "asc" | "desc";
  const search = params.users_search || "";
  const role = (params.users_role || "all") as Role | "all";
  const status = (params.users_status || "all") as "all" | "active" | "blocked" | "deleted";

  const sorting: AdminUsersSorting[] = sort
    ? [{ id: sort, desc: sortDir === "desc" }]
    : [];

  const filters: AdminUsersFilters = {
    search,
    role,
    status,
  };

  // Fetch inicial en el servidor (solo 1 llamada)
  const result = await getUsersAction({
    page,
    limit: pageSize,
    sorting,
    filters,
  });

  const initialData = {
    users: result.data?.users || [],
    stats: result.data?.stats || null,
    pagination: {
      pageIndex: page - 1,
      pageSize,
      totalRows: result.data?.pagination.total || 0,
      totalPages: result.data?.pagination.totalPages || 0,
    },
    sorting,
    filters,
    error: result.error || null,
  };

  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersClient initialData={initialData} />
    </Suspense>
  );
}
