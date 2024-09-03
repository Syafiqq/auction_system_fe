import EditProfile from "@/app/profile/components/profile";
import WinningBidsPreview from "@/app/profile/components/winning_bids";
import AuctionParticipationPreview from "@/app/profile/components/auction_participation";

export default function DashboardPage() {
    return (
        <>
            <EditProfile></EditProfile>
            <WinningBidsPreview></WinningBidsPreview>
            <AuctionParticipationPreview></AuctionParticipationPreview>
        </>
    );
}
