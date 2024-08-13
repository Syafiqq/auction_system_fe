import EditAuction from "@/app/auction/[id]/edit/components/edit";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <EditAuction
            id={params.id}
        >
        </EditAuction>
    );
}
