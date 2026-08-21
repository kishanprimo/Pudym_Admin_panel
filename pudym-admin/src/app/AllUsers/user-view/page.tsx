import { Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserView from "@/screens/AllUsers/UserView";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Suspense
                fallback={
                    <div className="px-5 py-5 md:px-6 lg:px-7">
                        <div className="animate-pulse">
                            <div className="mb-6 h-5 w-32 rounded bg-gray-200" />

                            <div className="rounded-[12px] border border-gray-200 bg-white p-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-24 w-24 rounded-full bg-gray-200" />

                                    <div>
                                        <div className="h-6 w-48 rounded bg-gray-200" />
                                        <div className="mt-3 h-4 w-32 rounded bg-gray-100" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                <UserView />
            </Suspense>
        </DashboardLayout>
    );
}