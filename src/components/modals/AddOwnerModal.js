import { Col, Form, Modal, Row } from "antd";
import React from "react";
import FilledButton from "../button/FilledButton";
import OutlineButton from "../button/OutlineButton";
import InputBox from "../form/InputBox";
import Heading from "../title/Heading";

function AddOwnerModal({ open, setIsOmodalOpen }) {
  const handleOk = () => setIsOmodalOpen(false);
  const handleCancel = () => setIsOmodalOpen(false);

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
          className="p-2 mb-8 whitespace-nowrap border-b-2"
          text="Add Owner"
        />
        <Form layout="vertical">
          <Row className="flex justify-center ">
            <Col span={11}>
              <InputBox placeholder="Jhon Smith" label="Owner Name" />
              <InputBox placeholder="1234-567890-1" label="CNIC" />
              <InputBox placeholder="Srilankan Malays" label="Ethinicity" />
              <InputBox placeholder="+92-344 123 3654" label="Mobile Number" />
            </Col>
            <Col span={11} offset={1}>
              <InputBox placeholder="Srilankan" label="Nationality" />
              <InputBox placeholder="dd/mm/yyy" label="CNIC Date" />
              <InputBox placeholder="0123" label="Share" />
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

export default AddOwnerModal;
