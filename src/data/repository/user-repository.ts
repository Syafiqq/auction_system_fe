import userRemoteDataSource from "@/data/datasource/remote/user-remote-datasource";
import {UserDetailResponseDto} from "@/domain/definition/dto/user-detail-response-dto.definition";
import {UserAutobidRequestDto} from "@/domain/definition/dto/user-autobid-request-dto.definition";
import {AuctionWinnerRequestDto} from "@/domain/definition/dto/auction-winner-request-dto.definition";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionWinnerResponseDto} from "@/domain/definition/dto/auction-winner-response-dto.definition";
import {AuctionParticipationRequestDto} from "@/domain/definition/dto/auction-participation-request-dto.definition";
import {AuctionParticipationResponseDto} from "@/domain/definition/dto/auction-participation-response-dto.definition";


const getProfileFromRemote = async (): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.getProfile();
}

const updateAutobidPreferenceToRemote = async (data: UserAutobidRequestDto): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.updateAutobidPreference(data);
}

const winningBidsFromRemote = async (data: AuctionWinnerRequestDto): Promise<PaginatedResponseDto<AuctionWinnerResponseDto>> => {
    return userRemoteDataSource.winningBids(data);
}

const auctionParticipationFromRemote = async (data: AuctionParticipationRequestDto): Promise<PaginatedResponseDto<AuctionParticipationResponseDto>> => {
    return userRemoteDataSource.auctionParticipation(data);
}

const userRepository = {
    getProfileFromRemote,
    updateAutobidPreferenceToRemote,
    winningBidsFromRemote,
    auctionParticipationFromRemote
}

export default userRepository;
