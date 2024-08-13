export interface User {
    id: number | null;
    username: string | null;
    role: string | null;
    autobid_capacity: number | null;
    autobid_percentage_warning: number | null;
    access_token: string | null;
}
