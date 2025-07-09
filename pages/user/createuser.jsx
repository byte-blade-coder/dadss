import { Col, Form, Row} from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import PasswordBox from "../../src/components/form/PasswordBox";
import { useRouter } from "next/router";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import PageHeader from "../../src/components/pageheader/pageHeader";

function CreateUser() {
  const router = useRouter();
  const [groupList, setGroupList] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [form] = useForm();

  const handlePlatformList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_list`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    // dispatch(fetchAllPlatformData());
    handlePlatformList();
    handleGroupRoles();

    form.resetFields();
  }, []);

  const handleGroupRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/group_list`,
     
      );
      if (response.status === 200) {
        const group_name = response.data;
        const groupNames = group_name.Groups.map((item) => item.name);
        setGroupList(groupNames);
      }
    } catch (error) {}
  };

  const onFinish = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      const { username, password, u_pf_id } = validatedValues;
      // Creating user_groups array with only selected values
      const user_groups = value.map((groupName) => ({
        name: groupName,
        added: true,
      }));
      // Constructing the data object
      const postData = {
        username,
        password,
        u_pf_id,
        user_groups,
      };
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/register`,
          postData
        );

        if (response.status === 201) {
          toast.success("User Created", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          router.push("/user");
        }
      } catch (error) {
        toast.error("User already exists", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error(errorInfo, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };


    const handleBack = () => {

      router.back();
    };
  return (
    <StyledDiv>
      <div>
        <PageHeader title="Create New User" showSearchBox={false} />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autocomplete="off"
        className="shadow mx-5 px-3 py-10 bg-white"
      >
        <Row className="flex justify-center">
          <Col xs={24} sm={24} md={11} lg={11} xl={11}>
            <InputBox
              autocomplete="off"
              label="Username"
              name="username"
              className="input mb-4"
              placeholder="Username"
              pattern="^[a-zA-Z0-9]+$"
              rules={[
                { required: true, message: "Please input the User ID!" },
                {
                  pattern: "^[a-zA-Z0-9]+$",
                  message: "User ID can only contain letters and numbers.",
                },
                {
                  min: 6,
                  message: "User ID must be at least 6 characters long.",
                },
                {
                  max: 12,
                  message: "User ID cannot be more than 12 characters long.",
                },
              ]}
            />
            <SelectBox
              autocomplete="off"
              name="u_pf_id"
              className="input mb-4"
              placeholder="Select Platform"
              label="Select Platform"
              options={data.map((item) => ({
                value: item.pf_id,
                label: item.pf_name,
              }))}
              rules={[{ required: true, message: "Please select a platform!" }]}
            />
          </Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
            <PasswordBox
              className="input mb-4"
              autocomplete="off"
              label="Password"
              name="password"
              placeholder="*****"
              minLength={8}
              maxLength={16}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  pattern:
                    "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$",
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
              ]}
            />
            <SelectBox
              mode="multiple"
              allowClear
              autocomplete="off"
              name="roles"
              className="input mb-4"
              placeholder="Select Roles"
              label="Group Roles"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              rules={[{ required: true, message: "Please select" }]}
              options={groupList.map((groupName, index) => ({
                value: groupName,
                label: groupName,
              }))}
              disabled={groupList.length === 0} // Disable the SelectBox until groupList is populated
            />
          </Col>
        </Row>

        <Row className="mt-5 flex justify-center">
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            className="flex justify-end  text-center mb-3 lg:text-right lg:mb-2 "
          >
            {/* This Col contains the buttons and is aligned to the right on large screens */}
            <Form.Item>
              <OutlineButton
                text="Cancel"
                onClick={handleBack}
                className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white ml-3 mb-3 mr-4 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block"
              />
              <FilledButton
                htmlType="submit"
                text="Save"
                className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </StyledDiv>
  );
}

export default CreateUser;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Create User",
      },
    },
  };
}
