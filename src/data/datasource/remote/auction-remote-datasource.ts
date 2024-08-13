import {BASE_URL_API} from '@/common/constants';
import {UnknownError} from '@/common/error/unknown-error';
import {AuctionListRequestDto} from "@/domain/definition/dto/auction-list-request-dto.definition";
import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import {AuctionDetailResponseDto} from "@/domain/definition/dto/auction-detail-response-dto.definition";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {IdResponseDto} from "@/domain/definition/dto/id-response-dto.definition";

const list = async (data: AuctionListRequestDto): Promise<PaginatedResponseDto<AuctionDetailResponseDto>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', data.page);
    if (data.name != null) {
        queryParams.append('name', data.name);
    }
    if (data.description != null) {
        queryParams.append('description', data.description);
    }
    if (data.priceOrder != null) {
        queryParams.append('price_order', data.priceOrder);
    }

    const response = await fetch(`${BASE_URL_API}auction?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (!response.ok) {
        throw new UnknownError();
    }

    return await response.json()
};

const deleteItem = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL_API}auction/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (response.status === 422) {
        const data: ValidationResponse<IdResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (!response.ok) {
        throw new UnknownError();
    }

    await response.json();
};

const auctionRemoteDataSource = {
    list,
    deleteItem,
};

export default auctionRemoteDataSource;

