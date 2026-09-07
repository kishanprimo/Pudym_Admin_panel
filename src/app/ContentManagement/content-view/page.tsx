import DashboardLayout from "@/layouts/DashboardLayout";
import ContentView from "@/screens/ContentManagement/ContentView";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <ContentView />
        </DashboardLayout>
    );
}