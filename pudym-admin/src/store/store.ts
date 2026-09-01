import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import allUsersReducer from "@/store/slices/AllUsersSlices/allUsersSlice";
import creatorRequestsReducer from "@/store/slices/CreatorRequestsSlices/creatorRequestsSlice";
import creatorsReducer from "@/store/slices/CreatorsSlices/creatorsSlice";
import feesReducer from "@/store/slices/FeesSlices/feesSlice";
import creatorFeesReducer from "@/store/slices/CreatorFeesSlices/creatorFeesSlice";
import withdrawalReducer from "@/store/slices/WithdrawalSlices/withdrawalSlice";
import contentReportsReducer from "@/store/slices/ModerationSlices/contentReportsSlice";
import userReportsReducer from "@/store/slices/ModerationSlices/userReportsSlice";
import notificationReducer from "@/store/slices/NotificationSlices/notificationSlice";
import reactivationRequestsReducer from "@/store/slices/AccountManagement/reactivationRequestsSlice";
import dashboardReducer from "@/store/slices/DashboardSlices/dashboardSlice";
import revenueReportReducer from "@/store/slices/RevenueGrowthSlices/revenueReportSlice";
import userGrowthReducer from "@/store/slices/RevenueGrowthSlices/userGrowthSlice";
import creatorGrowthReducer from "@/store/slices/RevenueGrowthSlices/creatorGrowthSlice";
import creatorSubscriptionReducer from "@/store/slices/RevenueGrowthSlices/creatorSubscriptionSlice";
import creatorPlansReducer from "@/store/slices/CreatorPlansSlices/creatorPlansSlice";
import contentManagementReducer
    from "@/store/slices/ContentManagementSlices/contentManagementSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        allUsers: allUsersReducer,
        dashboard: dashboardReducer,
        creatorRequests: creatorRequestsReducer,
        contentManagement: contentManagementReducer,
        creators: creatorsReducer,
        fees: feesReducer,
        creatorFees: creatorFeesReducer,
        withdrawal: withdrawalReducer,
        contentReports: contentReportsReducer,
        userReports: userReportsReducer,
        notification: notificationReducer,
        reactivationRequests: reactivationRequestsReducer,
        revenueReport: revenueReportReducer,
        userGrowth: userGrowthReducer,
        creatorGrowth: creatorGrowthReducer,
        creatorSubscription: creatorSubscriptionReducer,
        creatorPlans: creatorPlansReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;