import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IReport } from "../../types/models";
import { useSelector } from "react-redux";
import { TRootState } from "../store";

type THomeState = {
  report: IReport | null;
};

const homeSlice = createSlice({
  name: "home",
  initialState: {
    report: null,
  } as THomeState,
  reducers: {
    setReport: (state, action: PayloadAction<THomeState["report"]>) => {
      state.report = action.payload;
    },
  },
});

export const useHomeState = (): THomeState =>
  useSelector((state: TRootState) => state.home);
export const { setReport } = homeSlice.actions;
export default homeSlice.reducer;
