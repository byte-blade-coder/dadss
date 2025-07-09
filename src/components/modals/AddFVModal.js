import React from "react";
import { Col, Form, Modal, Row } from "antd";
import Heading from "../title/Heading";
import InputBox from "../form/InputBox";
import FilledButton from "../button/FilledButton";
import OutlineButton from "../button/OutlineButton";

function AddFVModal({ open, setIsFVmodalOpen }) {
  const handleOk = () => setIsFVmodalOpen(false);
  const handleCancel = () => setIsFVmodalOpen(false);

  return (
    <>
      <Modal
        width={750}
        centered
        open={open}
        okType="default"
        onCancel={handleCancel}
        footer={null}
      >
        <Heading
          level={4}
          className="whitespace-nowrap p-2 mb-8 border-b-2"
          text="Add Crew"
        />
        <Form layout="vertical">
          <Row className="flex justify-center ">
            <Col span={11}>
              <InputBox placeholder="1230AQS" label="ID number" />
              <InputBox placeholder="Jhon Smith" label="Full Name" />
              <InputBox placeholder="Srinlankan Malays" label="Nationality" />
            </Col>
            <Col span={11} offset={1}>
              <InputBox placeholder="Select ID" label="Type of ID" />
              <InputBox placeholder="Commander" label="Position" />
              <InputBox placeholder="Insert the number" label="Mobile Number" />
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
export default AddFVModal;
