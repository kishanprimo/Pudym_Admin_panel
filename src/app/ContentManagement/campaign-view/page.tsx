import { Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import CampaignView from "@/screens/ContentManagement/CampaignView";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Suspense>
                <CampaignView />
            </Suspense>
        </DashboardLayout>
    );
}
