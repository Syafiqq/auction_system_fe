import {BidResponseDto} from "@/domain/definition/dto/bid-response-dto.definition";

export class NewerBidPlacedException extends Error {
    newerBid: BidResponseDto;

    constructor(message: string, newerBid: BidResponseDto) {
        super(message);
        this.newerBid = newerBid;
        this.name = "NewerBidPlacedException";
    }
}
