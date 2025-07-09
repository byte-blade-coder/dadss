import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import dayjs from "dayjs";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import TableItemRenderer from "../../src/components/table/RenderTable";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVesselID } from "../../src/redux/thunks/registeredVesselData";
import { useRouter } from "next/router";
import { getUserID } from "../../src/redux/thunks/userAuth";
import { toast } from "react-toastify";

import {
  Col,
  Form,
  Row,
  Space,
  Typography,
  Radio,
  Select,
  Divider,
  Checkbox,
  Card,
  Result,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
import { getAllUsers } from "../../src/redux/thunks/userAuth";
import Heading from "../../src/components/title/Heading";
export default function Userresponsibility() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, username } = router.query;
  const { data, isLoading, error } = useSelector((state) => state.fetchUserID);

  useEffect(() => {
    if (id) {
      dispatch(getUserID(id));
    }
  }, [id]);

  const [form] = useForm();
  const { data: users } = useSelector((state) => state.getUsers);
  const [permissions, setPermissions] = useState({});
  const [permissionlists, setPermissionlist] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [accessDenied, setAccessDenied] = useState(false);

  const permissionList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/perm_list`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        setPermissions(response.data);
      }
    } catch (error) {}
  };

  console.log(permissions);

  const handleSave = async () => {
    try {
      const validatedValues = await form.validateFields();
      const token = localStorage.getItem("accessToken");
      if (validatedValues) {
        // Extract the selected permissions
        const selectedAddPermissions = Object.keys(selectedPermissions).reduce(
          (acc, category) => {
            return acc.concat(
              Object.entries(selectedPermissions[category])
                .filter(([permission, checked]) => checked)
                .map(([permission]) => permission)
            );
          },
          []
        );
        // Construct the data object in the desired format
        const data = {
          username: username,
          add: selectedAddPermissions,
        };
        // Send the formatted data in the POST request
        const response = await axios.post(
          "http://127.0.0.1:8000/user_perm",
          data,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          toast.success(`Data Save Successfully`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          router.push("/user");

          return response.data;
        }
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleGetPermissions = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!username) {
        console.error("Username is required");
        return;
      }

      const data = {
        username: username,
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/user_perm",
        data,
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json", // Specify the content type as JSON
          },
        }
      );

      if (response.status === 200) {

        setPermissionlist(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error("You don't have permission to access this resource.");
        setAccessDenied(true);
      } else {
        console.error("Error fetching permissions:", error);
      }
    }
  };

  //Ye function selectedPermissions state ko update karega jab koi permission select ya deselect ki jati hai.
  const handlePermissionChange = (category, permission, checked) => {
    setSelectedPermissions((prevState) => ({
      ...prevState,
      [category]: {
        ...(prevState[category] || {}),
        [permission]: checked,
      },
    }));
  };

  useEffect(() => {
    permissionList();
    handleGetPermissions();
  }, []);

  const handleClick = () => {
    router.push("/user/userresponsibility");
  };
  return (
    <div>
      <StyledDiv>
        <div className="mb-5">
          <PageHeader
            onNavigate={handleClick}
            title="User Details"
            btnTitleMedia="+ Add"
            placeholder="Search"
            btnTitle="user responsibility"
            showButton={true}
          />
        </div>

        <Form
          form={form}
          onFinish={handleSave} // Use onFinish to trigger form submission and validation
          layout="vertical"
          autoComplete="off"
          className="shadow mx-5 px-3 py-10 bg-white mb-4"
        >
          <Row className="flex justify-start">
            <Col xs={24} sm={24} md={7} lg={7} xl={7}>
              <InputBox
                label="Username"
                name="username"
                className="input"
                defaultValue={username} // Use defaultValue instead of value
                disabled={true}
              />
            </Col>
          </Row>

          <Divider className="mt-0" />

          {accessDenied ? (
            <Result
              status="403"
              title="403 Forbidden"
              subTitle="You don't have permission to access this resource."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard")}
                >
                  Back Home
                </Button>
              }
            />
          ) : (
            <div>
              <Row className="flex justify-between">
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mt-0">
                  <Heading text="Permission" className="ml-5" level={4} />
                </Col>
                <Form.Item>
                  <Row gutter={[16, 16]} className="mt-5 flex justify-between">
                    {Object.keys(permissions).map((key) => (
                      <Col xs={24} sm={24} md={7} lg={7} xl={7} key={key}>
                        <Card
                          title={key}
                          bordered={false}
                          className="w-dvw bg-white  cursor-pointer rounded-lg shadow-xl border-2 border-slate-100 p-5 h-full"
                        >
                          <Row>
                            {Object.keys(permissions[key]).map((permission) => (
                              <Col
                                span={24}
                                className="mt-2 mb-2"
                                key={permission}
                              >
                                <Checkbox
                                  onChange={(e) =>
                                    handlePermissionChange(
                                      key,
                                      permission,
                                      e.target.checked
                                    )
                                  }

                                  // checked={selectAll}
                                >
                                  {permissions[key][permission]}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
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
                  <Form.Item>
                    <OutlineButton
                      text="Cancel"
                      className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white ml-3 mb-3 mr-4 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block"
                    />
                    <FilledButton
                      text="Save"
                      htmlType="submit"
                      className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </StyledDiv>
    </div>
  );
}

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
