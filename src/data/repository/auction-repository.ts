import {AuctionListRequestDto} from "@/domain/definition/dto/auction-list-request-dto.definition";
import auctionRemoteDataSource from "@/data/datasource/remote/auction-remote-datasource";
import {firstOrNull} from "@/common/extension/array-extension";
import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {AuctionListResponseDto} from "@/domain/definition/dto/auction-list-response-dto.definition";

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

const auctionRepository = {
    fetchListFromRemote,
    deleteFromRemote,
}

export default auctionRepository;
