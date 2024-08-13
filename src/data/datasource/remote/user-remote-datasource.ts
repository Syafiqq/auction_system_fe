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

const userRemoteDataSource = {
    getProfile,
    updateAutobidPreference: updateItem,
};

export default userRemoteDataSource;

