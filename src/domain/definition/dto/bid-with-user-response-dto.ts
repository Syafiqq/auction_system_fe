export interface BidWithUserResponseDto {
    id: number | null;
    amount: number | null;
    bid_at: string | null;
    user: BidUserResponseDto | null;
}

export interface BidUserResponseDto {
    id: number | null;
    username: string | null;
}
