export interface AuctionListImageResponseDto {
    id: number | null;
    url: string | null;
}

export interface AuctionListCurrentPriceResponseDto {
    id: number | null;
    amount: number | null;
    bid_at: string | null;
}

export interface AuctionListResponseDto {
    id: number | null;
    name: string | null;
    description: string | null;
    starting_price: number | null;
    end_time: string | null;
    image: AuctionListImageResponseDto | null;
    current_price: AuctionListCurrentPriceResponseDto | null;
    autobid: boolean | null;
    has_winner: boolean | null;
    winner_id: string | null;
}
