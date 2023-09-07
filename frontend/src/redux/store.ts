import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./slices/global";

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
