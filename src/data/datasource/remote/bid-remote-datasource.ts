import {BASE_URL_API} from '@/common/constants';
import {UnknownError} from '@/common/error/unknown-error';
import authCacheDatasource from "@/data/datasource/cache/auth-cache-datasource";
import {ApiResponse} from "@/data/definition/response.definition";
import {FormValidationError} from "@/common/error/form-validation-error";
import {NotFoundException} from "@/common/error/not-found-exception";
import {BidRequestDto} from "@/domain/definition/dto/bid-request-dto.definition";
import {BidResponseDto} from "@/domain/definition/dto/bid-response-dto.definition";
import {NewerBidPlacedException} from "@/common/error/newer-bid-placed-exception";
import {ValidationResponseWithData} from "@/data/definition/valiation-response-with-data";
import {BidValidationRequestDto} from "@/domain/definition/dto/bid-validation-request-dto.definition";

const placeBid = async (data: BidRequestDto): Promise<BidResponseDto> => {
    const response = await fetch(`${BASE_URL_API}auction/${data.id.toString()}/bid`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCacheDatasource.loadToken() ?? ''}`
        },
        body: JSON.stringify({
            amount: data.amount,
            last_bid_reference: data.last_bid_reference
        }),
    });

    if (response.status === 422) {
        const data: ValidationResponseWithData<BidValidationRequestDto, BidResponseDto> = await response.json();
        const message = data.message;
        const errors = data.errors;
        const bid = data.data;
        if (bid !== null && message !== null) {
            throw new NewerBidPlacedException(message, bid);
        } else if (errors !== null && message !== null) {
            throw new FormValidationError(errors, message);
        } else {
            throw new UnknownError();
        }
    } else if (response.status === 404) {
        throw new NotFoundException('Bid');
    } else if (!response.ok) {
        throw new UnknownError();
    }

    const responseObject: ApiResponse<BidResponseDto> = await response.json();
    const responseData = responseObject.data;
    if (responseData === null) {
        throw new NotFoundException('Bid');
    }
    return responseData
};

const bidRemoteDataSource = {
    placeBid,
};

export default bidRemoteDataSource;

