import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {InAppNotificationResponseDto} from "@/domain/definition/dto/in-app-notification-response-dto.definition";
import {BASE_URL_API} from "@/common/constants";
import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import {UnknownError} from "@/common/error/unknown-error";
import {SessionEndException} from "@/common/error/session-end-exception";

const list = async (page: number): Promise<PaginatedResponseDto<InAppNotificationResponseDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());

    const response = await fetch(`${BASE_URL_API}notification?${queryParams.toString()}`, {
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

const inAppNotificationRemoteDataSource = {
    list,
};

export default inAppNotificationRemoteDataSource;

