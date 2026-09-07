import DashboardLayout from "@/layouts/DashboardLayout";
import Gifts from "@/screens/Gifts/Gifts";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Gifts />
        </DashboardLayout>
    );
}