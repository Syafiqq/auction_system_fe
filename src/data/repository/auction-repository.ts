import {AuctionListRequestDto} from "@/domain/definition/dto/auction-list-request-dto.definition";
import auctionRemoteDataSource from "@/data/datasource/remote/auction-remote-datasource";
import {firstOrNull} from "@/common/extension/array-extension";
import {AuctionCreateRequestDto} from "@/domain/definition/dto/auction-create-request-dto.definition";
import {AuctionDetailResponseDto} from "@/domain/definition/dto/auction-detail-response-dto.definition";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";
import {AuctionUpdateRequestDto} from "@/domain/definition/dto/auction-update-request-dto.definition";
import {AuctionBillResponseDto} from "@/domain/definition/dto/auction-bill-response-dto.definition";
import {BidWithUserResponseDto} from "@/domain/definition/dto/bid-with-user-response-dto";

const fetchListFromRemote = async (data: AuctionListRequestDto): Promise<PaginatedResponseDto<AuctionListResponseDto>> => {
    const result = await auctionRemoteDataSource.list(data);
    return {
        data: result.data?.map((item) => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                starting_price: item.starting_price,
                end_time: item.end_time,
                image: firstOrNull(item.images),
                current_price: item.current_price,
                autobid: item.autobid,
                has_winner: item.has_winner,
                winner_id: item.winner_id,
            }
        }) ?? null,
        links: result.links,
        meta: result.meta,
    };
}

const deleteFromRemote = async (id: string): Promise<void> => {
    await auctionRemoteDataSource.deleteItem(id);
}

const createItemToRemote = async (data: AuctionCreateRequestDto): Promise<AuctionDetailResponseDto> => {
    return auctionRemoteDataSource.createItem(data);
}

const getItemFromRemote = async (id: string): Promise<AuctionDetailResponseDto> => {
    return auctionRemoteDataSource.getItem(id);
}

const updateItemToRemote = async (data: AuctionUpdateRequestDto): Promise<AuctionDetailResponseDto> => {
    return auctionRemoteDataSource.updateItem(data);
}

const changeAutobidStatusToRemote = async (id: string, autobid: boolean): Promise<AuctionDetailResponseDto> => {
    return auctionRemoteDataSource.changeAutobidStatus(id, autobid);
}

const getBillFromRemote = async (id: string): Promise<AuctionBillResponseDto> => {
    return auctionRemoteDataSource.getBill(id);
}

const payBillToRemote = async (id: string, bid: string): Promise<AuctionBillResponseDto> => {
    return auctionRemoteDataSource.payBill(id, bid);
}

const participantsToRemote = async (id: string, page: string): Promise<PaginatedResponseDto<BidWithUserResponseDto>> => {
    return auctionRemoteDataSource.participants(id, page);
}

const auctionRepository = {
    fetchListFromRemote,
    deleteFromRemote,
    createItemToRemote,
    getItemFromRemote,
    updateItemToRemote,
    changeAutobidStatusToRemote,
    getBillFromRemote,
    payBillToRemote,
    participantsToRemote,
}

export default auctionRepository;
