export interface AuctionUpdateRequestDto {
    id: string;
    name: string;
    description: string;
    starting_price: number;
    end_time: string;
    retained_old_images: string[]
    images: File[]
}
