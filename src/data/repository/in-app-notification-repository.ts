import {PaginatedResponseDto} from "@/domain/definition/common/paginated-list-response-dto.definition";
import {InAppNotificationResponseDto} from "@/domain/definition/dto/in-app-notification-response-dto.definition";
import inAppNotificationRemoteDataSource from "@/data/datasource/remote/in-app-notification-remote-datasource";

const fetchListFromRemote = async (page: number): Promise<PaginatedResponseDto<InAppNotificationResponseDto>> => {
    return await inAppNotificationRemoteDataSource.list(page);
}

const inAppNotificationRepository = {
    fetchListFromRemote,
}

export default inAppNotificationRepository;
