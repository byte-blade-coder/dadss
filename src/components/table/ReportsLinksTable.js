import React from "react";
import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import {
  type_list,
  movement_list,
  machineryDefects,
} from "../../helper/dropdown";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function ReportsLinksTable(props) {
  const { reportLinks, setReportLinks } = props;
  const [reportLinkForm] = useForm();
  const [reporLinkKey, setReportLinkKey] = useState("");
  const [showInputs, setShowInputs] = useState({
    reportLinkColumns: false,
  });

  const Columns = [
    {
      title: "Query Special Report Link",
      dataIndex: "xc",
    },
    {
      title: "Boarding Special Report Link",
      dataIndex: "xc",
    },
  ];

  return (
    <Form form={reportLinkForm} className="mb-8">
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading
            level={5}
            text="Report Links"
            className="  whitespace-nowrap ml-5"
          />
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={Columns}
          dataSource={[reportLinks]}
          //   dataSource={showInputs.limitOpsColumns ? [{}, ...limitOps] : limitOps}

          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default ReportsLinksTable;

const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;
