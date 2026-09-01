import DashboardLayout from "@/layouts/DashboardLayout";
import UserGrowth from "@/screens/RevenueGrowth/UserGrowth";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <UserGrowth />
        </DashboardLayout>
    );
}