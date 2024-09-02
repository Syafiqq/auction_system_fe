import userRemoteDataSource from "@/data/datasource/remote/user-remote-datasource";
import {UserDetailResponseDto} from "@/domain/definition/dto/user-detail-response-dto.definition";
import {UserAutobidRequestDto} from "@/domain/definition/dto/user-autobid-request-dto.definition";
import {AuctionWinnerRequestDto} from "@/domain/definition/dto/auction-winner-request-dto.definition";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionWinnerResponseDto} from "@/domain/definition/dto/auction-winner-response-dto.definition";


const getProfileFromRemote = async (): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.getProfile();
}

const updateAutobidPreferenceToRemote = async (data: UserAutobidRequestDto): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.updateAutobidPreference(data);
}

const winningBidsFromRemote = async (data: AuctionWinnerRequestDto): Promise<PaginatedResponseDto<AuctionWinnerResponseDto>> => {
    return userRemoteDataSource.winningBids(data);
}

const userRepository = {
    getProfileFromRemote,
    updateAutobidPreferenceToRemote,
    winningBidsFromRemote
}

export default userRepository;
