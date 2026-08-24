import DashboardLayout from "@/layouts/DashboardLayout";
import CreatorRequests from "@/screens/CreatorRequests/CreatorRequests";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <CreatorRequests />
        </DashboardLayout>
    );
}