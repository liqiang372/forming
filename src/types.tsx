export type FormInitialValues = Record<string, any>;
export interface FieldError {
  rule: string;
  message?: string;
}
export type ValidationLevel = 'first' | 'sync' | 'async';
