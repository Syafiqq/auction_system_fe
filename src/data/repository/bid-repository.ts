import {BidRequestDto} from "@/domain/definition/dto/bid-request-dto.definition";
import {BidResponseDto} from "@/domain/definition/dto/bid-response-dto.definition";
import bidRemoteDataSource from "@/data/datasource/remote/bid-remote-datasource";

const placeBidToRemote = async (data: BidRequestDto): Promise<BidResponseDto> => {
    return bidRemoteDataSource.placeBid(data);
}

const bidRepository = {
    placeBidToRemote,
}

export default bidRepository;
