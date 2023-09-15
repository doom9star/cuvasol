import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./slices/global";
import homeReducer from "./slices/home";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    home: homeReducer,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
