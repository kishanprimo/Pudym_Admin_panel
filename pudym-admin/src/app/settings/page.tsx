import DashboardLayout from "@/layouts/DashboardLayout";
import Settings from "@/screens/Settings/Settings";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Settings />
        </DashboardLayout>
    );
}