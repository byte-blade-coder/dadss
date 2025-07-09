// import jwtDecode from "jwt-decode";
// import moment from "moment";
// import { fetchRefreshToken } from "./refreshToken"  ;

// const jwtRefreshMiddleware = (store) => (next) => (action) => {
//   if (typeof action === "function") {
//     const state = store.getState();
//     const access_token = state.auth.access_token;

//     if (access_token) {
//       const decoded = jwtDecode(access_token);

//       // Check if token is about to expire (e.g., within 10 seconds)
//       if (decoded.exp && decoded.exp - moment().unix() < 10) {
//         const isStillRefreshing = state.auth.refreshingToken;

//         if (!isStillRefreshing) {
//           // Dispatch action to fetch new token
//           store
//             .dispatch(fetchRefreshToken())
//             .then(() => next(action))
//             .catch(() => store.dispatch(logout()));
//           return;
//         }
//       }
//     }
//   }
//   return next(action);
// };

// export default jwtRefreshMiddleware;
// authMiddleware.js
import jwtDecode from 'jwt-decode';
import { fetchRefreshToken } from './authThunk';
import { setTokens } from './authSlice';

const authMiddleware = store => next => action => {
  const { accessToken, refreshToken } = store.getState().auth;

  if (accessToken) {
    const { exp } = jwtDecode(accessToken);

    if (exp * 1000 < Date.now()) {
      if (!store.getState().auth.loading) {
        store.dispatch(fetchRefreshToken(refreshToken))
          .then((response) => {
            store.dispatch(setTokens(response.payload));
          })
          .catch((error) => {
            console.error('Token refresh failed:', error);
            // Handle token refresh failure (e.g., log out the user)
          });
      }
    }
  }

  return next(action);
};

export default authMiddleware;
