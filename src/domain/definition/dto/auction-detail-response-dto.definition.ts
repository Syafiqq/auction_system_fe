import {
    AuctionListCurrentPriceResponseDto,
    AuctionListImageResponseDto
} from "@/domain/definition/dto/auction-list-response-dto.definition";

export interface AuctionDetailResponseDto {
    id: number | null;
    name: string | null;
    description: string | null;
    starting_price: number | null;
    end_time: string | null;
    images: AuctionListImageResponseDto[] | null;
    current_price: AuctionListCurrentPriceResponseDto | null;
    autobid: boolean | null;
    has_winner: boolean | null;
    winner_id: string | null;
    winner_user: AuctionDetailUserResponseDto | null;
}

export interface AuctionDetailUserResponseDto {
    id: number | null;
    username: string | null;
}
