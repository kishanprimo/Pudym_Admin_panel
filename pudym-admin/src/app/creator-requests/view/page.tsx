import { Suspense } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import CreatorRequestView from "@/screens/CreatorRequests/CreatorRequestView";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <DashboardLayout>
            <Suspense
                fallback={
                    <div className="px-5 py-5 md:px-6 lg:px-7">
                        <div className="animate-pulse">

                            <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

                            <div className="mb-6 h-7 w-52 rounded bg-gray-200" />

                            <div className="h-32 rounded-[16px] bg-gray-200" />

                        </div>
                    </div>
                }
            >
                <CreatorRequestView />
            </Suspense>
        </DashboardLayout>
    );
}