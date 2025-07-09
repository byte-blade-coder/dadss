// authMiddleware.js
import jwtDecode from "jwt-decode";
import { fetchRefreshToken } from "./authThunk";
import { setTokens, setLoading, setError, logout } from "./authSlice";

const authMiddleware = (store) => (next) => (action) => {
  const { accessToken, refreshToken } = store.getState().auth;

  if (accessToken) {
    const { exp } = jwtDecode(accessToken);

    if (exp * 1000 < Date.now()) {
      if (!store.getState().auth.loading) {
        store.dispatch(setLoading(true));
        store
          .dispatch(fetchRefreshToken(refreshToken))
          .then((response) => {
            store.dispatch(setTokens(response.payload));
          })
          .catch((error) => {
            store.dispatch(setError(error.payload));
            store.dispatch(logout());
          })
          .finally(() => {
            store.dispatch(setLoading(false));
          });
      }
    }
  }

  return next(action);
};

export default authMiddleware;
