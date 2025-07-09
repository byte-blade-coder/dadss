import React from "react";
import { Col, Form, Modal, Row } from "antd";
import Heading from "../title/Heading";
import InputBox from "../form/InputBox";
import FilledButton from "../button/FilledButton";
import OutlineButton from "../button/OutlineButton";

function AddFDModal({ open, setIsFDmodalOpen }) {
  const handleOk = () => setIsFDmodalOpen(false);
  const handleCancel = () => setIsFDmodalOpen(false);

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
          className=" whitespace-nowrap p-2 mb-8 border-b-2"
          text="Add Fishing Densities"
        />
        <Form layout="vertical">
          <Row className="flex justify-center items-center">
            <Col span={7}>
              <InputBox placeholder="Min" label="Latitude" />
              <InputBox placeholder="Min" label="Longitude" />
              <InputBox placeholder="0" label="Number of Vessels" />
            </Col>
            <Col span={7} offset={1}>
              <InputBox placeholder="Max" label="Max" />
              <InputBox placeholder="Max" label="Max" />
              <InputBox placeholder="Trawlers" label="Type of Vessels" />
            </Col>
            <Col span={7} offset={1}>
              <InputBox placeholder="North/South" label="Select" />
              <InputBox placeholder="East/West" label="Select" />
              <InputBox
                placeholder="Movement of Vessels"
                label="Vessel Movement"
              />
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
export default AddFDModal;
