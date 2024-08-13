import userRemoteDataSource from "@/data/datasource/remote/user-remote-datasource";
import {UserDetailResponseDto} from "@/domain/definition/dto/user-detail-response-dto.definition";
import {UserAutobidRequestDto} from "@/domain/definition/dto/user-autobid-request-dto.definition";


const getProfileFromRemote = async (): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.getProfile();
}

const updateAutobidPreferenceToRemote = async (data: UserAutobidRequestDto): Promise<UserDetailResponseDto> => {
    return userRemoteDataSource.updateAutobidPreference(data);
}

const userRepository = {
    getProfileFromRemote,
    updateAutobidPreferenceToRemote,
}

export default userRepository;
