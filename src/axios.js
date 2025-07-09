import axios from 'axios';
import { showToastError } from './helper/MyToast';
import { useRouter } from 'next/router';
import Router from "next/router";

const baseURL = `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}`;
const axiosInstance = axios.create({baseURL});

// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     console.log("request ", config.url);
//     config.url = config.url;
//     // Do something before request is sent
//     const token = localStorage ? localStorage.getItem('accessToken') : null;
//     if (token) {
//         config.headers['Authorization'] = 'JWT ' + token }
//     return config;
// }, function (error) {
//     // Do something with request error
//     console.log("Request error", error);
//     return Promise.reject(error);
// });


// export function createAxiosInstanceWithToken(token) {
//     const instance = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_MSA_BACKEND_API,
//       headers: {
//         Authorization: `JWT ${token}`,
//       },
//     });
  
//     return instance;
//   }

axios.interceptors.response.use(
    (response) => {
        // console.log(response)
        return response;
    },
    async (error) => {
        console.log(error, "ERr res",error.response,  "data",error.response.data, )
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config;

        if (status === 404) {
          console.log(error)
          const errorData = error.response?.data;

                let errorText = 'An unknown error occurred.';

                if (typeof errorData === 'string') {
                    // If backend sends plain string message
                    errorText = errorData;
                } else if (typeof errorData?.error === 'string') {
                    // If backend sends { error: "message" }
                    errorText = errorData.error;
                } else if (typeof errorData === 'object') {
                    // If backend sends field-level errors like { field: ["error"] }
                    const messages = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('\n');
                    errorText = messages;
                }

                showToastError(`${errorText}`);
        //   showToastError(`Error : ${error.response}.`);
        //   Router.push("/404");
        } else if (status === 403) {
            console.log(error)
            if (!originalRequest.url.includes('/user_perm'))
           { showToastError(`Error : ${error}.`);
            Router.push("/403");}
        }
        else if (error.response?.data?.code === 'token_not_valid' && error.response.status === 401 && error.response.statusText === 'Unauthorized')
        {
            // console.log(error.response)
            const refreshToken = localStorage.getItem('refreshToken');

            // Check if the request was already a refresh attempt
            if (originalRequest.url.includes('/token/refresh')) {
                // console.log('Refresh token expired.');
                showToastError(`Session expired. Please login again.`);
                
                setTimeout(async () => {
                    // OPTIONAL: Call logout API if needed
                    try {
                        await axios.post(baseURL + '/logout', {
                        refresh: refreshToken,
                        });
                    } catch (logoutError) {
                        console.error('Logout API failed:', logoutError);
                    }
                }, 1500);

                localStorage.clear();
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
                return Promise.reject(error);
            }

            if (refreshToken) {
                try {
                    const response = await axios
                        .post(baseURL + '/token/refresh', { refresh: refreshToken });
                    localStorage.setItem('accessToken', response.data?.access);

                    originalRequest.headers.Authorization = 'JWT ' + localStorage.getItem('accessToken');
                    return await axios(originalRequest);

                    // error.config.headers.Authorization = 'JWT ' + localStorage.getItem('accessToken');
                    // return axios(error.config);
                } catch (err) {
                    console.log(err);
                    showToastError(`Error : ${err}.`);
                    return Promise.reject(err);
                }
            }
            else {
                console.log('Refresh token not available.');
                showToastError(`Error : ${error}.`);
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return Promise.reject(error);
            }
        }
        else if (status === 401) {
            console.log(error)
            showToastError(`Error : ${error}.`);
            if (!originalRequest.url.includes('/login'))
            { Router.push("/401"); }
        }
        else if (status === 400) {
            if (!originalRequest.url.includes('/logout')) {
                const errorData = error.response?.data;

                let errorText = 'An unknown error occurred.';

                const extractMessages = (data) => {
                    if (typeof data === 'string') {
                         // If backend sends plain string message
                        return data;
                    }

                    if (typeof data?.error === 'string') {
                        // If backend sends { error: "message" }
                        return data.error;
                    }

                    if (Array.isArray(data)) {
                        // Recursively extract messages from an array
                        return data.map(extractMessages).join('\n');
                    }

                    if (typeof data === 'object' && data !== null) {
                         // If backend sends field-level errors like { field: ["error"] }
                        return Object.entries(data)
                            .map(([key, value]) => `${key}: ${extractMessages(value)}`)
                            .join('\n');
                    }

                    return String(data);
                };

                errorText = extractMessages(errorData);
                // if (typeof errorData === 'string') {
                //     // If backend sends plain string message
                //     errorText = errorData;
                // } else if (typeof errorData?.error === 'string') {
                //     // If backend sends { error: "message" }
                //     errorText = errorData.error;
                // } else if (typeof errorData === 'object') {
                //     // If backend sends field-level errors like { field: ["error"] }
                //     const messages = Object.entries(errorData)
                //         .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                //         .join('\n');
                //     errorText = messages;
                // }

                showToastError(`${errorText}`);
            }
        }
        else if (status == 500)
        {
            console.log(error)
            showToastError(`Error : ${error}.`);
            Router.push("/500");
        }
        else {
            alert(
                'A server/network error occurred. ' +
                    'Looks like server is not running. ' +
                    'Please check your server and refresh.'
            );

          console.log(error)
          window.location.href = '/';
        }

        // return error;
        return Promise.reject(error);
      }

);

// export default axiosInstance;
export default axios;