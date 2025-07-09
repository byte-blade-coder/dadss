import { Button, Result } from 'antd';
import { useRouter } from "next/router";
import { LockOutlined } from "@ant-design/icons"; 
import Link from 'next/link';

const Forbidden = () => (
    <Result
        icon={<LockOutlined style={{ fontSize: 80, color: "#faad14" }} />}    
        status="403"
        title="401 Unauthorized"
        subTitle="You don't have permission to access this resource."

        extra={<Link href={'/'}>Back to Login</Link>}
    />
);
export default Forbidden;