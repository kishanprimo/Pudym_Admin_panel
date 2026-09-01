import DashboardLayout from "@/layouts/DashboardLayout";
import Revenue from "@/screens/RevenueGrowth/Revenue";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Revenue />
        </DashboardLayout>
    );
}