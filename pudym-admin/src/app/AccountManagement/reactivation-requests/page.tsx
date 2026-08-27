import ReactivationRequests
    from "@/screens/AccountManagement/ReactivationRequests/ReactivationRequests";

import DashboardLayout
    from "@/layouts/DashboardLayout";

export default function ReactivationRequestsPage() {
    return (
        <DashboardLayout>
            <ReactivationRequests />
        </DashboardLayout>
    );
}