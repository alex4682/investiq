import {
  getCurrentUser,
  sendMagicLink,
  signInUser,
  signOutUser,
  signUpNewUser,
  verifyMagicLink,
} from "./users-api";

type UserData = {
  id?: string;
  email?: string | null;
  name?: string | null;
};

export type AuthState = {
  loading: boolean;
  isLoggedIn: boolean;
  userData: UserData | null;
  authError: string | null;
  authSuccess: boolean;
  verifying: boolean;
};

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  userData: null,
  authError: null,
  authSuccess: false,
  verifying: false,
};

const mapUser = (user: any): UserData => ({
  id: user?.id,
  email: user?.email ?? null,
  name: user?.user_metadata?.name ?? null,
});

type UserAction =
  | AnyAction
  | { type: "user/setLoading"; payload: boolean }
  | { type: "user/setUser"; payload: UserData | null }
  | { type: "user/setError"; payload: string | null }
  | { type: "user/setSuccess"; payload: boolean }
  | { type: "user/setVerifying"; payload: boolean };

export function usersReducer(
  state: AuthState = initialState,
  action: UserAction,
): AuthState {
  switch (action.type) {
    case "user/setLoading":
      return { ...state, loading: action.payload };
    case "user/setUser":
      return {
        ...state,
        userData: action.payload,
        isLoggedIn: Boolean(action.payload),
      };
    case "user/setError":
      return { ...state, authError: action.payload };
    case "user/setSuccess":
      return { ...state, authSuccess: action.payload };
    case "user/setVerifying":
      return { ...state, verifying: action.payload };
    default:
      return state;
  }
}

export const setLoading = (payload: boolean): UserAction => ({
  type: "user/setLoading",
  payload,
});

export const setUser = (payload: UserData | null): UserAction => ({
  type: "user/setUser",
  payload,
});

export const setError = (payload: string | null): UserAction => ({
  type: "user/setError",
  payload,
});

export const setSuccess = (payload: boolean): UserAction => ({
  type: "user/setSuccess",
  payload,
});

export const setVerifying = (payload: boolean): UserAction => ({
  type: "user/setVerifying",
  payload,
});

export const clearError = () => setError(null);
export const clearSuccess = () => setSuccess(false);

export const fetchCurrentUser = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    const user = await getCurrentUser();
    dispatch(setUser(user ? mapUser(user) : null));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Unable to fetch user"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  dispatch(setSuccess(false));

  try {
    const { user } = await signInUser(email, password);
    dispatch(setUser(user ? mapUser(user) : null));
    dispatch(setSuccess(Boolean(user)));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Login failed"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (name: string, email: string, password: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(clearError());
  dispatch(setSuccess(false));

  try {
    const { user } = await signUpNewUser(name, email, password);
    dispatch(setUser(user ? mapUser(user) : null));
    dispatch(setSuccess(Boolean(user)));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Registration failed"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const requestMagicLink = (email: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    await sendMagicLink(email);
    dispatch(setSuccess(true));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Unable to send magic link"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const verifyToken = (token_hash: string, type?: string) => async (dispatch: any) => {
  dispatch(setVerifying(true));
  dispatch(clearError());

  try {
    const user = await verifyMagicLink(token_hash, type);
    dispatch(setUser(user ? mapUser(user) : null));
    dispatch(setSuccess(Boolean(user)));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Verification failed"));
  } finally {
    dispatch(setVerifying(false));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    await signOutUser();
    dispatch(setUser(null));
    dispatch(setSuccess(false));
  } catch (error: any) {
    dispatch(setError(error.message ?? "Logout failed"));
  } finally {
    dispatch(setLoading(false));
  }
};
