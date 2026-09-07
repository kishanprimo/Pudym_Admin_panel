import DashboardLayout from "@/layouts/DashboardLayout";
import GiftCategories from "@/screens/Gifts/GiftCategories";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <GiftCategories />
        </DashboardLayout>
    );
}