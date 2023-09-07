import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { IUser } from "../../types/models";

type TGlobalState = {
  loading: boolean;
  user: IUser | null;
};

const globalSlice = createSlice({
  name: "global",
  initialState: {
    loading: true,
    user: null,
  } as TGlobalState,
  reducers: {
    setGlobalLoading: (
      state,
      action: PayloadAction<TGlobalState["loading"]>
    ) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<TGlobalState["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const useGlobalState = (): TGlobalState =>
  useSelector((state: TRootState) => state.global);
export const { setGlobalLoading, setUser } = globalSlice.actions;
export default globalSlice.reducer;
