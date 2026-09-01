import { Suspense } from "react";
import WithdrawalView from "@/screens/Withdrawal/WithdrawalView";
import DashboardLayout from "@/layouts/DashboardLayout";
export default function WithdrawalViewPage() {
    return (
        <DashboardLayout>
            <Suspense>
                <WithdrawalView />
            </Suspense>
        </DashboardLayout>
    );

}
