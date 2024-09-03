import {BASE_URL_API} from '@/common/constants';
import {UnknownError} from '@/common/error/unknown-error';
import {AuctionListRequestDto} from "@/domain/definition/dto/auction-list-request-dto.definition";
import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import {AuctionDetailResponseDto} from "@/domain/definition/dto/auction-detail-response-dto.definition";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {IdResponseDto} from "@/domain/definition/dto/id-response-dto.definition";
import {AuctionCreateRequestDto} from "@/domain/definition/dto/auction-create-request-dto.definition";
import {ApiResponse} from "@/data/definition/response.definition";
import {ValidationResponse} from "@/data/definition/valiation-response";
import {FormValidationError} from "@/common/error/form-validation-error";
import {NotFoundException} from "@/common/error/not-found-exception";
import {AuctionCreateResponseDto} from "@/domain/definition/dto/auction-create-response-dto.definition";
import {AuctionUpdateRequestDto} from "@/domain/definition/dto/auction-update-request-dto.definition";
import {AuctionUpdateResponseDto} from "@/domain/definition/dto/auction-update-response-dto.definition";
import {SessionEndException} from "@/common/error/session-end-exception";
import {AuctionBillResponseDto} from "@/domain/definition/dto/auction-bill-response-dto.definition";

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

    if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
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
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    await response.json();
};

const createItem = async (data: AuctionCreateRequestDto): Promise<AuctionDetailResponseDto> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('starting_price', data.starting_price.toString());
    formData.append('end_time', data.end_time);
    for (const file of data.images) {
        formData.append('images[]', file);
    }

    const response = await fetch(`${BASE_URL_API}auction`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: formData
    });

    if (response.status === 422) {
        const data: ValidationResponse<AuctionCreateResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};

const getItem = async (id: string): Promise<AuctionDetailResponseDto> => {
    const response = await fetch(`${BASE_URL_API}auction/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};


const updateItem = async (data: AuctionUpdateRequestDto): Promise<AuctionDetailResponseDto> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('starting_price', data.starting_price.toString());
    formData.append('end_time', data.end_time);
    for (const id of data.retained_old_images) {
        formData.append('retained_old_images[]', id);
    }
    for (const file of data.images) {
        formData.append('images[]', file);
    }

    const response = await fetch(`${BASE_URL_API}auction/${data.id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: formData
    });

    if (response.status === 422) {
        const data: ValidationResponse<AuctionUpdateResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};

const changeAutobidStatus = async (id: string, autobid: boolean): Promise<AuctionDetailResponseDto> => {
    const response = await fetch(`${BASE_URL_API}auction/${id}/autobid`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: JSON.stringify({
            is_autobid: autobid,
        })
    });

    if (response.status === 422) {
        const data: ValidationResponse<AuctionUpdateResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null) {
            throw new UnknownError();
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionDetailResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};

const getBill = async (id: string): Promise<AuctionBillResponseDto> => {
    const response = await fetch(`${BASE_URL_API}auction/${id}/bill`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
    });

    if (response.status === 422) {
        const data: ValidationResponse<IdResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null || errors === undefined || message === undefined) {
            throw new NotFoundException('Auction');
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionBillResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};

const payBill = async (id: string, bid: string): Promise<AuctionBillResponseDto> => {
    const formData = new FormData();
    formData.append('bid', bid);

    const response = await fetch(`${BASE_URL_API}auction/${id}/bill`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: formData
    });

    if (response.status === 422) {
        const data: ValidationResponse<IdResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        if (errors === null || message === null || errors === undefined || message === undefined) {
            throw new NotFoundException('Auction');
        } else {
            throw new FormValidationError(errors, message);
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Auction');
    } else if (response.status === 401) {
        throw new SessionEndException();
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<AuctionBillResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Auction');
    }
    return responseData
};

const auctionRemoteDataSource = {
    list,
    deleteItem,
    createItem,
    getItem,
    updateItem,
    changeAutobidStatus,
    getBill,
    payBill
};

export default auctionRemoteDataSource;

