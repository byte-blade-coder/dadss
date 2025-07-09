import * as React from "react";
import { Checkbox } from "antd";
import { Slider } from "antd";
import { BiPieChart } from "react-icons/bi";
function ControlPanel(props) {
  const { setHeat, heat } = props;
  const marks = {
    0: "0°C",
    26: "26°C",
    37: "37°C",
    100: {
      style: {
        color: "#f50",
      },
      label: <strong>100°C</strong>,
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        // top: 90,
        left: 20,
        top: 50,
        // right: 30,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "300px",
      }}
    >
      <h3 className="p-2" style={{ fontSize: 20 }}>
        Layer 1
      </h3>
      <hr />
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="blue" fontSize="20" />
        <p className="px-2">HASHISH</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="orange" fontSize="20" />
        <p className="px-2">BROWN CRYSTAL</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="purple" fontSize="20" />
        <p className="px-2">COCAIN WHITE CRYSTAL CRYS</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="#8B8000" fontSize="20" />
        <p className="px-2">COCAIN TABLETS ICE</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="green" fontSize="20" />
        <p className="px-2">CRYSTAL OPIUM</p>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}
      >
        <BiPieChart color="black" fontSize="20" />
        <p className="px-2">LSD</p>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
