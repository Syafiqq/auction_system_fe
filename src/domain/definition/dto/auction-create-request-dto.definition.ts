export interface AuctionCreateRequestDto {
    name: string;
    description: string;
    starting_price: number;
    end_time: string;
    images: File[]
}
