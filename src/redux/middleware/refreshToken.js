// auth.js (actions file)

// Assuming you have Redux Thunk middleware set up, these action creators can be async functions that dispatch actions asynchronously.

// Action creator to fetch a new access token using the refresh token
export const fetchRefreshToken = () => {
  return async (dispatch) => {
    try {
      // Make an API call to refresh the token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/token/refresh`,
        { refresh: localStorage.getItem("refreshToken") }
      );

      if (response.status === 200) {
        // Dispatch an action to update the access token in the Redux store
        dispatch(updateAccessToken(response.data.access));
      } else {
        // Handle error scenarios, if needed
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      // Handle error scenarios, if needed
      throw error;
    }
  };
};

// Example action creators for updating the Redux store with the new access token and logging out the user
const updateAccessToken = (accessToken) => ({
  type: "UPDATE_ACCESS_TOKEN",
  payload: accessToken,
});