import { Provider } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import store from "../src/redux/store";
import Head from "next/head";
import { useSelector, useDispatch  } from "react-redux";
import axios from "../src/axios";
import { fetchAllPlatformData } from "../src/redux/thunks/platformData";

const Drawer = dynamic(() => import("../src/components/DrawerAlternate"), {
  // const Drawer = dynamic(() => import("../src/components/DrawerStyledDania"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    </div>
  ),
});

const DrawerMain = dynamic(() => import("../src/components/DrawerStyled"), {
  // const Drawer = dynamic(() => import("../src/components/DrawerStyledDania"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    </div>
  ),
});
import "../styles/globals.css";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refreshAccessToken } from "../src/redux/thunks/userAuth";

// Custom component to handle dispatch logic
const DataFetcher = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, accessToken, refreshToken } = useSelector((state) => state.loginAuth); // Include tokens
  const { data } = useSelector((state) => state.fetchPlatformData);
  const pagesRequiringData = ["/coireport"];
  // const pagesRequiringData = ["/fishingvessel", "/merchantvessel", "/coireport"];

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const isTokenValid = storedToken && !isTokenExpired(storedToken);
  
    // if (isLoggedIn && !isTokenValid && refreshToken) {
    //   console.log("Access token expired. Attempting refresh...");
    //   dispatch(refreshAccessToken(refreshToken)).then((newToken) => {
    //     if (newToken) {
    //       dispatch(fetchAllPlatformData()); // Fetch data after refreshing token
    //     }
    //   });
    //   return;
    // }
  
    if (isLoggedIn && pagesRequiringData.includes(router.pathname) && (!data || data.length === 0)) {
      dispatch(fetchAllPlatformData());
    }

  }, [dispatch, isLoggedIn, router.pathname, data, accessToken, refreshToken]);
  

  return children;
};

// Helper function to check token expiration
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.exp * 1000 < Date.now(); // Compare expiration time with current time
  } catch (error) {
    return true; // If decoding fails, consider the token invalid
  }
};


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const pagesWithoutDrawer = ["/"];
  const isPageWithoutDrawer = pagesWithoutDrawer.includes(router.pathname);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //    dispatch(fetchAllPlatformData());
  //  }, [dispatch]);

  return (
    <>
      <Head>
        <title>{pageProps?.title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
  
      <Provider store={store}>
        <ToastContainer /> {/* ToastContainer should be a child of Provider */}
        <DataFetcher>
          {!isPageWithoutDrawer ? (
            <>
              <DrawerMain>
                <Component {...pageProps} />
              </DrawerMain>
            </>
          ) : (
            <Component {...pageProps} />
          )}
        </DataFetcher>
      </Provider>
    </>
  );
}
