import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IReport, ITask } from "../../lib/types/models";
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
    addTask: (state, action: PayloadAction<ITask>) => {
      if (state.report) {
        state.report.tasks.push(action.payload);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      if (state.report) {
        state.report.tasks = state.report.tasks.filter(
          (t) => t.id !== action.payload
        );
      }
    },
    setTask: (state, action: PayloadAction<{ tid: string; task: ITask }>) => {
      if (state.report) {
        const tidx = state.report.tasks.findIndex(
          (t) => t.id === action.payload.tid
        );
        if (tidx !== -1)
          state.report.tasks[tidx] = {
            ...state.report.tasks[tidx],
            ...action.payload.task,
          };
      }
    },
  },
});

export const useHomeState = (): THomeState =>
  useSelector((state: TRootState) => state.home);
export const { setReport, addTask, deleteTask, setTask } = homeSlice.actions;
export default homeSlice.reducer;
