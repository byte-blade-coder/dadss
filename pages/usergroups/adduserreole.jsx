import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Col, Form, Row, Divider, Checkbox, Card, Result, Button } from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
export default function UserRole() {
  const router = useRouter();

  const [form] = useForm();
  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [accessDenied, setAccessDenied] = useState(false);

  const permissionList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/perm_list`,
       
      );
      if (response.status === 200 || response.status === 201) {
        setPermissions(response.data);
        setSelectedPermissions(response.data);
      }
    } 
    catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        setAccessDenied(true);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.detail ===
          "You do not have permission to perform this action."
      ) {
        setAccessDenied(true);
      }
    }
  };

  const handlePermissionChange = (
    category,
    main_name,
    permissionKey,
    isChecked
  ) => {
    setSelectedPermissions((prevSelectedPermissions) => ({
      ...prevSelectedPermissions,
      Permissions: {
        ...prevSelectedPermissions.Permissions,
        [category]: {
          ...prevSelectedPermissions.Permissions[category],
          [main_name]: {
            ...prevSelectedPermissions.Permissions[category][main_name],
            has_perm: isChecked,
          },
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      const validatedValues = await form.validateFields();
      if (validatedValues) {
        const data = {
          group_name: validatedValues.user_roles, // Assuming user_roles is the field for group name
          ...selectedPermissions,
        };
        const response = await axios.post(
          "http://127.0.0.1:8001/group",
          data, // Send the data directly without wrapping it in an array
       
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
          router.push("/usergroups");
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

  useEffect(() => {
    permissionList();
  }, []);
  useEffect(() => {
    // Check if permissions is not an empty object
    if (Object.keys(permissions).length > 0) {
      // Proceed with the logic that requires permissions
      // For example:
      console.log(Object.keys(permissions.Permissions));
    }
  }, [permissions]);

     const handleBack = () => {
       router.back();
     };

// Function to format the title based on the key value
const formatTitle = (key) => {
  // Convert key to desired format
  switch (key) {
    case "intelreport":
      return "Intel Report";
    case "rvessels":
      return "Fishing Vessel";
    case "user":
      return "Users";
    case "missionreport":
      return "SITREP (By Aircraft)";
    case "platforms":
      return "Platforms";
    case "sreports":
      return "Special Report (Fishing Vessel)";
    case "mersreports":
      return "Special Report (Merchant Vessel)";
    case "shipbreaking":
      return "Ship Breaking Report";
    case "greports":
      return "SITREP (By Ship)";
    case "merchant_vessel":
      return "Merchant Vessel";
    default:
      return key; // Return key as is if no specific formatting is defined
  }
};
  return (
    <StyledDiv>
      <PageHeader showSearchBox={false} title="User Role" />
      {accessDenied ? (
        <Result
          status="403"
          title="403 Forbidden"
          subTitle="You don't have permission to access this resource."
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      ) : (
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
                label="User Roles"
                name="user_roles"
                autocomplete="off"
                className="input mb-4"
                placeholder="User Roles"
                pattern="^[a-zA-Z0-9]+$"
                rules={[
                  { required: true, message: "Please input the User Role!" },
                  {
                    pattern: "^[a-zA-Z0-9]+$",
                    message: "User Role can only contain letters and numbers.",
                  },
                ]}
              />
            </Col>
          </Row>

          <Divider className="mt-0" />

          {/* Mapping through permissionsData.Permissions */}

          {permissions && permissions.Permissions && (
            <Row className="flex justify-center items-center gap-x-8 gap-y-10">
              <Form.Item>
                <Row gutter={25}>
                  {Object.keys(permissions.Permissions).map((key) => {
                    const permission = permissions.Permissions[key];
                    return (
                      <Col
                        className="whitespace-normal mb-2"
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={8}
                        key={key}
                      >
                        <Card
                          // title={key} // Using key as card title
                          title={formatTitle(key)}
                          bordered={false}
                          className="p-0 w-12/12 bg-white cursor-pointer rounded-lg shadow-xl border-2 border-slate-100 h-full"
                        >
                          <Row>
                            {/* Mapping through permissions.Permissions[key] */}
                            {Object.keys(permission).map((permKey) => (
                              <React.Fragment key={permKey}>
                                <Col span={24} className="mt-2 mb-2">
                                  <Checkbox
                                    className="whitespace-nowrap "
                                    value={permissions}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        key, // Group name
                                        permKey,
                                        permission[permKey].name, // Permission name
                                        e.target.checked // Checked state
                                      )
                                    }
                                  >
                                    {permission[permKey].name}
                                  </Checkbox>
                                </Col>
                              </React.Fragment>
                            ))}
                          </Row>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Form.Item>
            </Row>
          )}

          <Row className="mt-5 flex justify-center">
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={24}
              xl={24}
              className="flex justify-end  text-center mb-3 lg:text-right lg:mb-2 "
            >
              <Form.Item>
                <OutlineButton
                  text="Cancel"
                  onClick={handleBack}
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
        </Form>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .input {
    margin-bottom: 10px;
  }
  .ant-card-body {
    padding: 12px !important;
  }
  //   .ant-card-head{
  //     padding: 0px !important
  //   }
`;
