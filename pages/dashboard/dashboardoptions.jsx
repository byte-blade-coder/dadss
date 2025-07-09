import Heading from "../../src/components/title/Heading";
import Options from "../../src/components/dashboard/Options";
import Visualpageheader from "../../src/components/pageheader/visualpageheader";
import { useRouter } from "next/router";
import styled from "styled-components";

// const header_style = {
//   margin: "25px 0 0 20px"
// };

const Dashboard = () => {
    const router = useRouter();
    const { title } = router.query;
  return (
    <>
        <Visualpageheader/>
        
        <div className="" style={{marginTop: "2rem",}}>
        <Heading level={3} className="p-0 ml-5 mb-5 mt-5" text={title || ""} />
         {/* flex  items-center justify-center  */}
        <div className="max-h-screen ">
            <Options title={title}/>
        </div>
        </div>
    </>
  );
};
export default Dashboard;