import ParticipantsTable from "@/app/auction/[id]/participants/components/layout";

export default function CreateAuctionPage({params}: { params: { id: string } }) {
    return (
        <ParticipantsTable
            id={params.id}
        >
        </ParticipantsTable>
    );
}
