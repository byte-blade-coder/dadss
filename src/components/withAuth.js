import { useSelector } from "react-redux";
import { Result } from "antd";
import { LockOutlined } from "@ant-design/icons"; 
import Link from "next/link";

export const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { isLoggedIn } = useSelector((store) => store.loginAuth);
    if (isLoggedIn) {
      return <WrappedComponent {...props} />;
    } else {
      return (
        <div className="h-screen flex justify-center items-center">
          <Result
            icon={<LockOutlined style={{ fontSize: 80, color: "#faad14" }} />}
            status="404"
            title="Access Denied"
            subTitle="Please log in again to continue."
            extra={<Link href={"/"} onClick={() => window.location.href = '/'}>Back to Login</Link>}
          />
        </div>
      );
    }
  };

  return Wrapper;
};
