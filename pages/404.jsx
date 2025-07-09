import { Result } from 'antd';
import Link from 'next/link';

const Error = () => (
  <Result
    status="404"
    title="404 Not Found"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link href={'/dashboard'}>Back Home</Link>}
  />
);
export default Error;