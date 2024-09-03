import AuctionPlaceBid from "@/app/auction/[id]/place-bid/components/place-bid";
import ParticipantsPreview from "@/app/auction/[id]/place-bid/components/participants";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <>
            <AuctionPlaceBid
                id={params.id}
            >
            </AuctionPlaceBid>
            <ParticipantsPreview
                id={params.id}
            >
            </ParticipantsPreview>
        </>
    );
}
