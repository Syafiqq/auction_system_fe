export interface AuctionParticipationRequestDto {
    page: string;
    name: string | null;
    description: string | null;
    types: AuctionParticipationRequestStatus[] | null;
}

export enum AuctionParticipationRequestStatus {
    WIN = "1",
    LOSE = "2",
    IN_PROGRESS = "3",
    IN_PROGRESS_LEADING = "4"
}
