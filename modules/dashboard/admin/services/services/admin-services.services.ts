import { AdminServicesRepository } from "../repository/admin-services.repository";
import type {
  GetCategoriesResult,
  GetItemsResult,
  AdminServicesActionResult,
  GetCategoriesParams,
  GetItemsParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateItemParams,
  UpdateItemParams,
  CategoryForSelect,
} from "../types/admin-services.types";

export class AdminServicesService {
  private repository: AdminServicesRepository;

  constructor() {
    this.repository = new AdminServicesRepository();
  }

  public async getCategories(params: GetCategoriesParams): Promise<AdminServicesActionResult> {
    try {
      const { page, limit, sorting, filters } = params;

      const [{ categories, total }, stats] = await Promise.all([
        this.repository.getCategories(page, limit, sorting, filters),
        this.repository.getStats(),
      ]);

      const totalPages = Math.ceil(total / limit);

      const result: GetCategoriesResult = {
        categories,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return { data: result };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { error: "Error al obtener categorías" };
    }
  }

  public async getItems(params: GetItemsParams): Promise<AdminServicesActionResult> {
    try {
      const { page, limit, sorting, filters, categoryId } = params;

      const { items, total } = await this.repository.getItems(
        page,
        limit,
        sorting,
        filters,
        categoryId
      );

      const totalPages = Math.ceil(total / limit);

      const result: GetItemsResult = {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return { data: result };
    } catch (error) {
      console.error("Error fetching items:", error);
      return { error: "Error al obtener servicios" };
    }
  }

  public async createCategory(params: CreateCategoryParams): Promise<AdminServicesActionResult> {
    try {
      const category = await this.repository.createCategory(params);
      return { success: "Categoría creada correctamente", data: { id: category.id } };
    } catch (error) {
      console.error("Error creating category:", error);
      return { error: "Error al crear categoría" };
    }
  }

  public async updateCategory(params: UpdateCategoryParams): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getCategoryById(params.id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.updateCategory(params);
      return { success: "Categoría actualizada correctamente" };
    } catch (error) {
      console.error("Error updating category:", error);
      return { error: "Error al actualizar categoría" };
    }
  }

  public async deleteCategory(id: string): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      if (existing._count && existing._count.items > 0) {
        return { error: "No se puede eliminar una categoría con servicios asociados" };
      }

      await this.repository.deleteCategory(id);
      return { success: "Categoría eliminada correctamente" };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { error: "Error al eliminar categoría" };
    }
  }

  public async createItem(params: CreateItemParams): Promise<AdminServicesActionResult> {
    try {
      if (params.categoryId) {
        const category = await this.repository.getCategoryById(params.categoryId);
        if (!category) {
          return { error: "Categoría no encontrada" };
        }
      }

      const item = await this.repository.createItem(params);
      return { success: "Servicio creado correctamente", data: { id: item.id } };
    } catch (error) {
      console.error("Error creating item:", error);
      return { error: "Error al crear servicio" };
    }
  }

  public async updateItem(params: UpdateItemParams): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getItemById(params.id);
      if (!existing) {
        return { error: "Servicio no encontrado" };
      }

      if (params.categoryId) {
        const category = await this.repository.getCategoryById(params.categoryId);
        if (!category) {
          return { error: "Categoría no encontrada" };
        }
      }

      await this.repository.updateItem(params);
      return { success: "Servicio actualizado correctamente" };
    } catch (error) {
      console.error("Error updating item:", error);
      return { error: "Error al actualizar servicio" };
    }
  }

  public async deleteItem(id: string): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getItemById(id);
      if (!existing) {
        return { error: "Servicio no encontrado" };
      }

      await this.repository.deleteItem(id);
      return { success: "Servicio eliminado correctamente" };
    } catch (error) {
      console.error("Error deleting item:", error);
      return { error: "Error al eliminar servicio" };
    }
  }

  public async toggleCategoryStatus(id: string, isActive: boolean): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.toggleCategoryStatus(id, isActive);
      return { success: isActive ? "Categoría activada" : "Categoría desactivada" };
    } catch (error) {
      console.error("Error toggling category status:", error);
      return { error: "Error al cambiar estado de categoría" };
    }
  }

  public async toggleItemStatus(id: string, isActive: boolean): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getItemById(id);
      if (!existing) {
        return { error: "Servicio no encontrado" };
      }

      await this.repository.toggleItemStatus(id, isActive);
      return { success: isActive ? "Servicio activado" : "Servicio desactivado" };
    } catch (error) {
      console.error("Error toggling item status:", error);
      return { error: "Error al cambiar estado de servicio" };
    }
  }

  public async toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<AdminServicesActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.toggleCategoryFeatured(id, isFeatured);
      return { success: isFeatured ? "Categoría destacada" : "Categoría no destacada" };
    } catch (error) {
      console.error("Error toggling category featured:", error);
      return { error: "Error al cambiar destacado de categoría" };
    }
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    try {
      return await this.repository.getCategoriesForSelect();
    } catch (error) {
      console.error("Error fetching categories for select:", error);
      return [];
    }
  }
}
