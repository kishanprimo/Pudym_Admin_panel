import DashboardLayout from "@/layouts/DashboardLayout";
import CreatorGrowth from "@/screens/RevenueGrowth/CreatorGrowth";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <CreatorGrowth />
        </DashboardLayout>
    );
}