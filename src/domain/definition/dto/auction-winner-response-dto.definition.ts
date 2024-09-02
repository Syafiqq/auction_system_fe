import {
    AuctionListCurrentPriceResponseDto,
    AuctionListImageResponseDto
} from "@/domain/definition/dto/auction-list-response-dto.definition";

export interface AuctionWinnerResponseDto {
    id: number | null;
    name: string | null;
    description: string | null;
    starting_price: number | null;
    end_time: string | null;
    images: AuctionListImageResponseDto[] | null;
    current_price: AuctionListCurrentPriceResponseDto | null;
    payment_status: string | null;
}
