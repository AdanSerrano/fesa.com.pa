"use client";

import { useCallback, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface DataTableUrlState {
  page: number;
  pageSize: number;
  sort?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  [key: string]: string | number | undefined;
}

export interface UseDataTableUrlStateOptions {
  prefix?: string;
  defaults?: {
    page?: number;
    pageSize?: number;
    sort?: string;
    sortDir?: "asc" | "desc";
  };
  shallow?: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function useDataTableUrlState(options: UseDataTableUrlStateOptions = {}) {
  const { prefix = "", defaults = {}, shallow = true } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  const getParamKey = useCallback(
    (key: string) => (prefix ? `${prefix}_${key}` : key),
    [prefix]
  );

  const state = useMemo((): DataTableUrlState => {
    const pageParam = searchParams.get(getParamKey("page"));
    const pageSizeParam = searchParams.get(getParamKey("pageSize"));
    const sortParam = searchParams.get(getParamKey("sort"));
    const sortDirParam = searchParams.get(getParamKey("sortDir"));
    const searchParam = searchParams.get(getParamKey("search"));

    const d = defaultsRef.current;
    return {
      page: pageParam ? parseInt(pageParam, 10) : (d.page ?? DEFAULT_PAGE),
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE),
      sort: sortParam || d.sort,
      sortDir: (sortDirParam as "asc" | "desc") || d.sortDir,
      search: searchParam || undefined,
    };
  }, [searchParams, getParamKey]);

  const updateUrl = useCallback(
    (updates: Partial<DataTableUrlState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const d = defaultsRef.current;

      Object.entries(updates).forEach(([key, value]) => {
        const paramKey = getParamKey(key);

        if (value === undefined || value === null || value === "") {
          params.delete(paramKey);
        } else {
          const isDefaultValue =
            (key === "page" && value === (d.page ?? DEFAULT_PAGE)) ||
            (key === "pageSize" && value === (d.pageSize ?? DEFAULT_PAGE_SIZE)) ||
            (key === "sort" && value === d.sort) ||
            (key === "sortDir" && value === d.sortDir);

          if (isDefaultValue) {
            params.delete(paramKey);
          } else {
            params.set(paramKey, String(value));
          }
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      if (shallow) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [searchParams, pathname, router, shallow, getParamKey]
  );

  const setPage = useCallback(
    (page: number) => {
      const d = defaultsRef.current;
      const currentPageSize = searchParams.get(getParamKey("pageSize"));
      const currentSort = searchParams.get(getParamKey("sort"));
      const currentSortDir = searchParams.get(getParamKey("sortDir"));
      const currentSearch = searchParams.get(getParamKey("search"));

      updateUrl({
        page,
        pageSize: currentPageSize ? parseInt(currentPageSize, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE),
        sort: currentSort || d.sort,
        sortDir: (currentSortDir as "asc" | "desc") || d.sortDir,
        search: currentSearch || undefined,
      });
    },
    [searchParams, getParamKey, updateUrl]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      const d = defaultsRef.current;
      const currentSort = searchParams.get(getParamKey("sort"));
      const currentSortDir = searchParams.get(getParamKey("sortDir"));
      const currentSearch = searchParams.get(getParamKey("search"));

      updateUrl({
        page: 1,
        pageSize,
        sort: currentSort || d.sort,
        sortDir: (currentSortDir as "asc" | "desc") || d.sortDir,
        search: currentSearch || undefined,
      });
    },
    [searchParams, getParamKey, updateUrl]
  );

  const setSort = useCallback(
    (sort: string | undefined, sortDir?: "asc" | "desc") => {
      const d = defaultsRef.current;
      const currentPageSize = searchParams.get(getParamKey("pageSize"));
      const currentSearch = searchParams.get(getParamKey("search"));

      updateUrl({
        page: 1,
        pageSize: currentPageSize ? parseInt(currentPageSize, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE),
        sort,
        sortDir,
        search: currentSearch || undefined,
      });
    },
    [searchParams, getParamKey, updateUrl]
  );

  const setSearch = useCallback(
    (search: string | undefined) => {
      const d = defaultsRef.current;
      const currentPageSize = searchParams.get(getParamKey("pageSize"));
      const currentSort = searchParams.get(getParamKey("sort"));
      const currentSortDir = searchParams.get(getParamKey("sortDir"));

      updateUrl({
        page: 1,
        pageSize: currentPageSize ? parseInt(currentPageSize, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE),
        sort: currentSort || d.sort,
        sortDir: (currentSortDir as "asc" | "desc") || d.sortDir,
        search,
      });
    },
    [searchParams, getParamKey, updateUrl]
  );

  const setFilter = useCallback(
    (key: string, value: string | undefined) => {
      const d = defaultsRef.current;
      const currentPageSize = searchParams.get(getParamKey("pageSize"));
      const currentSort = searchParams.get(getParamKey("sort"));
      const currentSortDir = searchParams.get(getParamKey("sortDir"));
      const currentSearch = searchParams.get(getParamKey("search"));

      updateUrl({
        page: 1,
        pageSize: currentPageSize ? parseInt(currentPageSize, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE),
        sort: currentSort || d.sort,
        sortDir: (currentSortDir as "asc" | "desc") || d.sortDir,
        search: currentSearch || undefined,
        [key]: value,
      });
    },
    [searchParams, getParamKey, updateUrl]
  );

  const resetState = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const keysToDelete: string[] = [];
    params.forEach((_, key) => {
      if (prefix ? key.startsWith(`${prefix}_`) : true) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => params.delete(key));

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  }, [searchParams, pathname, router, prefix]);

  const paginationState = useMemo(
    () => ({
      pageIndex: state.page - 1,
      pageSize: state.pageSize,
    }),
    [state.page, state.pageSize]
  );

  const sortingState = useMemo(() => {
    if (!state.sort) return [];
    return [{ id: state.sort, desc: state.sortDir === "desc" }];
  }, [state.sort, state.sortDir]);
  
  const handlePaginationChange = useCallback(
    (pagination: { pageIndex: number; pageSize: number }) => {
      const d = defaultsRef.current;
      const currentPage = searchParams.get(getParamKey("page"));
      const currentPageSize = searchParams.get(getParamKey("pageSize"));

      const page = currentPage ? parseInt(currentPage, 10) : (d.page ?? DEFAULT_PAGE);
      const pageSize = currentPageSize ? parseInt(currentPageSize, 10) : (d.pageSize ?? DEFAULT_PAGE_SIZE);

      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
      } else if (pagination.pageIndex + 1 !== page) {
        setPage(pagination.pageIndex + 1);
      }
    },
    [searchParams, getParamKey, setPage, setPageSize]
  );

  const handleSortingChange = useCallback(
    (sorting: Array<{ id: string; desc: boolean }>) => {
      if (sorting.length === 0) {
        setSort(undefined, undefined);
      } else {
        const { id, desc } = sorting[0];
        setSort(id, desc ? "desc" : "asc");
      }
    },
    [setSort]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setSearch(search || undefined);
    },
    [setSearch]
  );

  return {
    state,
    paginationState,
    sortingState,
    searchState: state.search || "",
    setPage,
    setPageSize,
    setSort,
    setSearch,
    setFilter,
    handlePaginationChange,
    handleSortingChange,
    handleSearchChange,
    resetState,
    updateUrl,
  };
}
