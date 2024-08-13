export interface ValidationResponse<T> {
    errors: T | null;
    message: string | null;
}
