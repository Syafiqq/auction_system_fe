export interface PaginatedResponseMetaLinkDto {
    url: string | null;
    label: string | null;
    active: boolean | null;
}

export interface PaginatedResponseMetaDto {
    current_page: number | null;
    from: number | null;
    last_page: number | null;
    links: PaginatedResponseMetaLinkDto[] | null;
    path: string | null;
    per_page: number | null;
    to: number | null;
    total: number | null;
}

export interface PaginatedResponseDto<T> {
    data: T[] | null;
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: PaginatedResponseMetaDto | null;
}
