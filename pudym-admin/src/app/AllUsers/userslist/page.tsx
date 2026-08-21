import DashboardLayout from "@/layouts/DashboardLayout";
import AllUsers from "@/screens/AllUsers/AllUsers";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <DashboardLayout>
      <AllUsers />
    </DashboardLayout>
  );
}