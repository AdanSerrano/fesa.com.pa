import { AdminNewsRepository } from "../repository/admin-news.repository";
import type {
  GetCategoriesResult,
  GetArticlesResult,
  AdminNewsActionResult,
  GetCategoriesParams,
  GetArticlesParams,
  CreateCategoryParams,
  UpdateCategoryParams,
  CreateArticleParams,
  UpdateArticleParams,
  CategoryForSelect,
} from "../types/admin-news.types";

export class AdminNewsService {
  private repository: AdminNewsRepository;

  constructor() {
    this.repository = new AdminNewsRepository();
  }

  public async getCategories(params: GetCategoriesParams): Promise<AdminNewsActionResult> {
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
    } catch {
      return { error: "Error al obtener categorías" };
    }
  }

  public async getArticles(params: GetArticlesParams): Promise<AdminNewsActionResult> {
    try {
      const { page, limit, sorting, filters, categoryId } = params;

      const { articles, total } = await this.repository.getArticles(
        page,
        limit,
        sorting,
        filters,
        categoryId
      );

      const totalPages = Math.ceil(total / limit);

      const result: GetArticlesResult = {
        articles,
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
    } catch {
      return { error: "Error al obtener artículos" };
    }
  }

  public async createCategory(params: CreateCategoryParams): Promise<AdminNewsActionResult> {
    try {
      const category = await this.repository.createCategory(params);
      return { success: "Categoría creada correctamente", data: { id: category.id } };
    } catch {
      return { error: "Error al crear categoría" };
    }
  }

  public async updateCategory(params: UpdateCategoryParams): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getCategoryById(params.id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.updateCategory(params);
      return { success: "Categoría actualizada correctamente" };
    } catch {
      return { error: "Error al actualizar categoría" };
    }
  }

  public async deleteCategory(id: string): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      if (existing._count && existing._count.news > 0) {
        return { error: "No se puede eliminar una categoría con artículos asociados" };
      }

      await this.repository.deleteCategory(id);
      return { success: "Categoría eliminada correctamente" };
    } catch {
      return { error: "Error al eliminar categoría" };
    }
  }

  public async createArticle(params: CreateArticleParams): Promise<AdminNewsActionResult> {
    try {
      if (params.categoryId) {
        const category = await this.repository.getCategoryById(params.categoryId);
        if (!category) {
          return { error: "Categoría no encontrada" };
        }
      }

      const article = await this.repository.createArticle(params);
      return { success: "Artículo creado correctamente", data: { id: article.id } };
    } catch {
      return { error: "Error al crear artículo" };
    }
  }

  public async updateArticle(params: UpdateArticleParams): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getArticleById(params.id);
      if (!existing) {
        return { error: "Artículo no encontrado" };
      }

      if (params.categoryId) {
        const category = await this.repository.getCategoryById(params.categoryId);
        if (!category) {
          return { error: "Categoría no encontrada" };
        }
      }

      await this.repository.updateArticle(params);
      return { success: "Artículo actualizado correctamente" };
    } catch {
      return { error: "Error al actualizar artículo" };
    }
  }

  public async deleteArticle(id: string): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getArticleById(id);
      if (!existing) {
        return { error: "Artículo no encontrado" };
      }

      await this.repository.deleteArticle(id);
      return { success: "Artículo eliminado correctamente" };
    } catch {
      return { error: "Error al eliminar artículo" };
    }
  }

  public async toggleCategoryStatus(id: string, isActive: boolean): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.toggleCategoryStatus(id, isActive);
      return { success: isActive ? "Categoría activada" : "Categoría desactivada" };
    } catch {
      return { error: "Error al cambiar estado de categoría" };
    }
  }

  public async toggleArticleStatus(id: string, isActive: boolean): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getArticleById(id);
      if (!existing) {
        return { error: "Artículo no encontrado" };
      }

      await this.repository.toggleArticleStatus(id, isActive);
      return { success: isActive ? "Artículo activado" : "Artículo desactivado" };
    } catch {
      return { error: "Error al cambiar estado de artículo" };
    }
  }

  public async toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getCategoryById(id);
      if (!existing) {
        return { error: "Categoría no encontrada" };
      }

      await this.repository.toggleCategoryFeatured(id, isFeatured);
      return { success: isFeatured ? "Categoría destacada" : "Categoría no destacada" };
    } catch {
      return { error: "Error al cambiar destacado de categoría" };
    }
  }

  public async toggleArticleFeatured(id: string, isFeatured: boolean): Promise<AdminNewsActionResult> {
    try {
      const existing = await this.repository.getArticleById(id);
      if (!existing) {
        return { error: "Artículo no encontrado" };
      }

      await this.repository.toggleArticleFeatured(id, isFeatured);
      return { success: isFeatured ? "Artículo destacado" : "Artículo no destacado" };
    } catch {
      return { error: "Error al cambiar destacado de artículo" };
    }
  }

  public async getCategoriesForSelect(): Promise<CategoryForSelect[]> {
    try {
      return await this.repository.getCategoriesForSelect();
    } catch {
      return [];
    }
  }
}
