import {BASE_URL_API} from '@/common/constants';
import {ApiResponse} from '@/data/definition/response.definition';
import {FormValidationError} from '@/common/error/form-validation-error';
import {NotFoundException} from '@/common/error/not-found-exception';
import {ValidationResponse} from '@/data/definition/valiation-response';
import {UserResponseDto} from '@/domain/definition/dto/user-response-dto.definition';
import {User} from '@/domain/definition/entity/user.definition';
import {UnknownError} from '@/common/error/unknown-error';
import {SessionEndException} from "@/common/error/session-end-exception";

const login = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${BASE_URL_API}auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({username, password}),
    });

    if (response.status === 422) {
        const data: ValidationResponse<UserResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null || errors === undefined || message === undefined) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('User');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<User> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('User');
    }
    return responseData
};

const authRemoteDatasource = {
    login
};

export default authRemoteDatasource;
