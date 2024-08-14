export interface ValidationResponseWithData<T, D> {
    errors: T | null;
    message: string | null;
    data: D | null;
}
