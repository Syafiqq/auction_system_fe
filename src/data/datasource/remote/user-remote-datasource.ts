import {BASE_URL_API} from '@/common/constants';
import {UnknownError} from '@/common/error/unknown-error';
import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import {UserDetailResponseDto} from "@/domain/definition/dto/user-detail-response-dto.definition";
import {UserAutobidValidationRequestDto} from "@/domain/definition/dto/user-autobid-validation-request-dto.definition";
import {ValidationResponse} from "@/data/definition/valiation-response";
import {FormValidationError} from "@/common/error/form-validation-error";
import {NotFoundException} from "@/common/error/not-found-exception";
import {ApiResponse} from "@/data/definition/response.definition";
import {UserAutobidRequestDto} from "@/domain/definition/dto/user-autobid-request-dto.definition";
import {SessionEndException} from "@/common/error/session-end-exception";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionWinnerRequestDto} from "@/domain/definition/dto/auction-winner-request-dto.definition";
import {AuctionWinnerResponseDto} from "@/domain/definition/dto/auction-winner-response-dto.definition";
import {AuctionParticipationRequestDto} from "@/domain/definition/dto/auction-participation-request-dto.definition";
import {AuctionParticipationResponseDto} from "@/domain/definition/dto/auction-participation-response-dto.definition";

const getProfile = async (): Promise<UserDetailResponseDto> => {
    const response = await fetch(`${BASE_URL_API}profile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (response.status === 404) {
        throw new NotFoundException('Profile');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<UserDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Profile');
    }
    return responseData
};


const updateItem = async (data: UserAutobidRequestDto): Promise<UserDetailResponseDto> => {
    const response = await fetch(`${BASE_URL_API}profile/autobid`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: JSON.stringify({
            amount: data.amount,
            percentage: data.percentage
        })
    });

    if (response.status === 422) {
        const data: ValidationResponse<UserAutobidValidationRequestDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Autobid');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<UserDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Autobid');
    }
    return responseData
};

const winningBids = async (data: AuctionWinnerRequestDto): Promise<PaginatedResponseDto<AuctionWinnerResponseDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', data.page);
    if (data.name != null) {
        queryParams.append('name', data.name);
    }
    if (data.description != null) {
        queryParams.append('description', data.description);
    }

    const response = await fetch(`${BASE_URL_API}profile/winner?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    return await response.json()
};

const auctionParticipation = async (data: AuctionParticipationRequestDto): Promise<PaginatedResponseDto<AuctionParticipationResponseDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', data.page);
    if (data.name != null) {
        queryParams.append('name', data.name);
    }
    if (data.description != null) {
        queryParams.append('description', data.description);
    }
    if (data.types != null) {
        data.types.forEach(type => {
            queryParams.append('types[]', type);
        });
    }

    const response = await fetch(`${BASE_URL_API}profile/auctions?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    return await response.json()
};

const userRemoteDataSource = {
    getProfile,
    updateAutobidPreference: updateItem,
    winningBids,
    auctionParticipation,
};

export default userRemoteDataSource;

