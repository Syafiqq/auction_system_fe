import ViewAuction from "@/app/auction/[id]/components/view";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <ViewAuction
            id={params.id}
        >
        </ViewAuction>
    );
}
