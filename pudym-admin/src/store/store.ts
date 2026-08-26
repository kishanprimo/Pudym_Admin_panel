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

export const store = configureStore({
    reducer: {
        auth: authReducer,
        allUsers: allUsersReducer,
        creatorRequests: creatorRequestsReducer,
        creators: creatorsReducer,
        fees: feesReducer,
        creatorFees: creatorFeesReducer,
        withdrawal: withdrawalReducer,
        contentReports: contentReportsReducer,
        userReports: userReportsReducer,
        notification: notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;