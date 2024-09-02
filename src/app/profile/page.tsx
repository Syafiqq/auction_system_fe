import EditProfile from "@/app/profile/components/profile";
import WinningBidsPreview from "@/app/profile/components/winning_bids";

export default function DashboardPage() {
    return (
        <>
            <EditProfile></EditProfile>
            <WinningBidsPreview></WinningBidsPreview>
        </>
    );
}
