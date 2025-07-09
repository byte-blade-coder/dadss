import { Button, Result } from 'antd';
import { useRouter } from "next/router";
import Link from 'next/link';

const Forbidden = () => (
    <Result
        status="500"
        title="500 Internal server error"
        subTitle="Something went wrong on the server."
        extra={<Link href={'/dashboard'}>Back Home</Link>}
    />
);
export default Forbidden;