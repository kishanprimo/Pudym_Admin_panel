import DashboardLayout from "@/layouts/DashboardLayout";
import CreatorPlans from "@/screens/CreatorPlans/CreatorPlans";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <CreatorPlans />
        </DashboardLayout>
    );
}