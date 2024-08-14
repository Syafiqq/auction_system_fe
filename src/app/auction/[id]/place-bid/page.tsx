import AuctionPlaceBid from "@/app/auction/[id]/place-bid/components/place-bid";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <AuctionPlaceBid
            id={params.id}
        >
        </AuctionPlaceBid>
    );
}
