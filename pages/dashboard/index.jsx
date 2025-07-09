import Heading from "../../src/components/title/Heading";
import { Button} from "antd";
import Dashboard from "../../src/components/dashboard/Index";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  // const facerecogpage = () => {
  //   router.push("/face_detection");
  // }

  return (
    <div className=" flex items-center justify-center "  style={{marginTop: "8rem",}}>
      <Heading level={2} className="p-0 ml-5 mb-5" />
      <div className="max-h-screen ">
        <Dashboard />
      </div>
    </div>
  );
};
export default Home;
