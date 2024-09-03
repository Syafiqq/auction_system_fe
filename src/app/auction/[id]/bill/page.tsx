import AuctionBillLayout from "@/app/auction/[id]/bill/components/layout";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <AuctionBillLayout
            id={params.id}
        >
        </AuctionBillLayout>
    );
}
