import React from "react";
import { Col, Form, Modal, Row } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import OutlineButton from "../button/OutlineButton";
import InputBox from "../form/InputBox";

function AddGoodsDetailsModal({ open, setIsGDmodalOpen }) {
  const handleOk = () => setIsGDmodalOpen(false);
  const handleCancel = () => setIsGDmodalOpen(false);
  return (
    <>
      <Modal
        width={750}
        centered
        open={open}
        onCancel={handleCancel}
        okType="default"
        footer={null}
      >
        <Heading
          level={4}
          className="whitespace-nowrap p-2 mb-8 border-b-2"
          text="Add Goods Details"
        />
        <Form layout="vertical">
          <Row className="flex justify-center ">
            <Col span={11}>
              <InputBox placeholder="1230AQS" label="Items" />
              <InputBox placeholder="Jhon Smith" label="Denomination" />
              <InputBox placeholder="0,000" label="Value" />
            </Col>
            <Col span={11} offset={1}>
              <InputBox placeholder="Select ID" label="Quantity" />
              <InputBox placeholder="Commander" label="Category" />
              <InputBox placeholder="lorem lorem lorem lorem" label="Source" />
            </Col>
          </Row>
          <Row className="flex justify-center">
            <Col span={23} className="flex justify-end mt-6 mb-6">
              <div>
                <FilledButton
                  onClick={handleCancel}
                  text="Cancel"
                  className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white"
                />
                <OutlineButton
                  onClick={handleOk}
                  text="Save"
                  className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3"
                />
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddGoodsDetailsModal;
