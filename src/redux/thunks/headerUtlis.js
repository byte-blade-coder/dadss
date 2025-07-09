// File: headerUtils.js

// Function to generate headers with token dynamically
export const generateHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `JWT ${token}`,
  };
};
