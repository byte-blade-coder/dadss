import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Col, Input, Modal, Row } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { FaCheck, FaEdit } from "react-icons/fa";
import { MdDelete, MdOutlineResetTv } from "react-icons/md";

function PageHeader(props) {
  const {
    title,
    btnTitle,
    onNavigate,
    showButton,
    btnTitleMedia = "Save",
    deleteButton,
    onDelete,
    UpdateButton,
    onUpdate,
    isEditing,
    setIsEditing,
    handleBack,
    handleReset,
  } = props;
  const router = useRouter();

  const handleDelete = () => {
    Modal.confirm({
      title: `Are you sure, you want to delete this report?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        onDelete();
      },
    });
  };

  return (
    <React.Fragment>
      <Row className="flex items-center mt-4">
        <RxArrowLeft
          onClick={handleBack ? handleBack : () => router.back()}
          cursor={"pointer"}
          className="ml-5"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className="text-sm font-medium cursor-pointer"
        >
          Back
        </span>
      </Row>
      <Row className="flex flex-wrap mt-5 mb-4">
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={12}
          xxl={12}
          className="flex justify-start "
        >
          <Heading className="ml-5" level={3} text={title} />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={10}
          xl={12}
          xxl={12}
          className="flex justify-end"
        >
          <div className="flex justify-end mr-5">
            {handleReset && (
              <>
                <Button
                  onClick={handleReset}
                  className="rounded bg-metal inline-flex items-center text-white ml-2 custom-css-pageheaderButton"
                >
                  <MdOutlineResetTv size={15} /> CLEAR
                </Button>
              </>
            )}
            {showButton && (
              <>
                <FilledButton
                  text={
                    <>
                      <FaCheck
                        size={15}
                        className="inline-flex font-bold items-center mr-2"
                      />
                      {btnTitle}
                    </>
                  }
                  className="rounded border-lightgreen bg-lightgreen text-white ml-2 custom-css-pageheaderButton"
                  onClick={onNavigate}
                />
                <FilledButton
                  text={
                    <>
                      <FaCheck
                        size={15}
                        className="inline-flex font-bold items-center mr-2"
                      />
                      {btnTitleMedia}
                    </>
                  }
                  className="rounded border-lightgreen bg-lightgreen text-white ml-2 custom-css-pageheaderButtonMedia"
                  onClick={onNavigate}
                />
              </>
            )}
            {deleteButton && (
              <>
                <Button
                  onClick={handleDelete}
                  className="rounded bg-red inline-flex items-center text-white ml-2 custom-css-pageheaderButton"
                >
                  <MdDelete size={15} />
                  DELETE
                </Button>
              </>
            )}
            {UpdateButton &&
              (isEditing ? (
                <>
                  <Button
                    onClick={onUpdate}
                    className="rounded border-lightgreen bg-lightgreen text-white inline-flex items-center ml-2 custom-css-pageheaderButton"
                  >
                    <FaCheck size={15} />
                    Save Changes
                  </Button>
                </>
              ) : (
                setIsEditing && (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="rounded bg-saffron inline-flex items-center text-black ml-2 custom-css-pageheaderButton"
                    >
                      <FaEdit size={15} />
                      UPDATE
                    </Button>
                  </>
                )
              ))}
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PageHeader;
