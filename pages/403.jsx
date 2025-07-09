import { Button, Result } from 'antd';
import Link from 'next/link';

const Forbidden = () => {
    <Result
        status="403"
        title="403 Forbidden"
        subTitle="You don't have permission to access this resource."
        // extra={
        //     <Button type="primary" onClick={() => router.push("/dashboard")}>
        //         Back Home
        //     </Button>
        // }
        extra={<Link href={'/'}>Back to Login</Link>}
    />
}
export default Forbidden;