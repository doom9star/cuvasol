import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { IUser } from "../../lib/types/models";
import { AlertProps } from "antd";

type TGlobalState = {
  loading: boolean;
  user: IUser | null;
  alert: { type?: AlertProps["type"]; message?: string; description?: string };
};

const globalSlice = createSlice({
  name: "global",
  initialState: {
    loading: true,
    user: null,
    alert: {},
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
    setAlert: (state, action: PayloadAction<TGlobalState["alert"]>) => {
      state.alert = action.payload;
    },
  },
});

export const useGlobalState = (): TGlobalState =>
  useSelector((state: TRootState) => state.global);
export const { setGlobalLoading, setUser, setAlert } = globalSlice.actions;
export default globalSlice.reducer;
