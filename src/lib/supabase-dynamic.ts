import { supabase } from "@/integrations/supabase/client";

export interface QueryError {
  message: string;
}

export interface DynamicQueryBuilder<T>
  extends PromiseLike<{ data: T[] | null; error: QueryError | null }> {
  select(columns: string): DynamicQueryBuilder<T>;
  eq(column: string, value: unknown): DynamicQueryBuilder<T>;
  order(column: string, options: { ascending: boolean }): DynamicQueryBuilder<T>;
  insert(payload: Partial<T> | Partial<T>[]): DynamicQueryBuilder<T>;
  update(payload: Partial<T>): DynamicQueryBuilder<T>;
  delete(): DynamicQueryBuilder<T>;
  single(): PromiseLike<{ data: T | null; error: QueryError | null }>;
}

export interface DynamicSupabaseClient {
  from<T>(table: string): DynamicQueryBuilder<T>;
}

export const dynamicSupabase = supabase as unknown as DynamicSupabaseClient;

export const getQueryErrorMessage = (error: QueryError | null) =>
  error?.message ?? "Erreur inconnue";
