import {AuctionListCurrentPriceResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";

export interface AuctionBillResponseDto {
    id: number | null;
    name: string | null;
    description: string | null;
    starting_price: number | null;
    end_time: string | null;
    current_price: AuctionListCurrentPriceResponseDto | null;
    bill: AuctionBillDetail | null;
}

export interface AuctionBillDetail {
    id: number | null;
    no: string | null;
    issued_at: string | null;
    due_at: string | null;
    paid_at: string | null;
    status: string | null;
}
