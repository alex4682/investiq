import type { AnyAction, Dispatch } from "redux";
import { getInvestIQRecordsByUser,  } from "./goods-api";
import type { InvestIQRecord } from "./goods-api";

export type GoodsState = {
  loading: boolean;
  records: InvestIQRecord[];
  error: string | null;
};

const initialState: GoodsState = {
  loading: false,
  records: [],
  error: null,
};

type GoodsAction =
  | AnyAction
  | { type: "goods/setLoading"; payload: boolean }
  | { type: "goods/setRecords"; payload: InvestIQRecord[] }
  | { type: "goods/setError"; payload: string | null };

export function goodsReducer(
  state: GoodsState = initialState,
  action: GoodsAction,
): GoodsState {
  switch (action.type) {
    case "goods/setLoading":
      return { ...state, loading: action.payload };
    case "goods/setRecords":
      return { ...state, records: action.payload };
    case "goods/setError":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export const setGoodsLoading = (payload: boolean) => ({
  type: "goods/setLoading",
  payload,
});

export const setGoodsRecords = (payload: InvestIQRecord[]) => ({
  type: "goods/setRecords",
  payload,
});

export const setGoodsError = (payload: string | null) => ({
  type: "goods/setError",
  payload,
});

export const fetchInvestIQByUser = (userId: string) => async (
  dispatch: Dispatch<GoodsAction>,
) => {
  dispatch(setGoodsLoading(true));
  dispatch(setGoodsError(null));

  console.log("fetchInvestIQByUser start", userId);

  try {
    const records = await getInvestIQRecordsByUser(userId);
    console.log("fetchInvestIQByUser result", records);
    dispatch(setGoodsRecords(records));
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === "object" && "message" in error
        ? String((error as any).message)
        : JSON.stringify(error);
    console.error("fetchInvestIQByUser error", error);
    dispatch(setGoodsError(message || "Unable to fetch InvestIQ data"));
  } finally {
    dispatch(setGoodsLoading(false));
  }
};
