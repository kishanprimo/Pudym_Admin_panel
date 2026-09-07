import DashboardLayout from "@/layouts/DashboardLayout";
import ContentManagement from "@/screens/ContentManagement/ContentManagement";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <ContentManagement type="reel" />
        </DashboardLayout>
    );
}