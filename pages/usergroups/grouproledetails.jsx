import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import {
  Col,
  Form,
  Row,
  Divider,
  Checkbox,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import InputBox from "../../src/components/form/InputBox";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
import OutlineButton from "../../src/components/button/OutlineButton";

function Grouproledetails() {
  const router = useRouter();
  const { name } = router.query;
  const [form] = useForm();
  const [permissions, setPermissions] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState({});

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

  const handleGroupRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/group`
      );
      if (response.status === 200) {
        response.data.forEach((group) => {
          if (group.group_name === name) {
            const PermissionsList = {
              Permissions: group.Permissions,
            };
            setPermissions(PermissionsList);
            setSelectedPermissions(PermissionsList);
            setRoleId(group);
          }
        });
      }
    } catch (error) {}
  };

  const handleSave = async () => {
    try {
      const validatedValues = await form.validateFields();
      if (validatedValues) {
        const data = {
          group_name: name, // Assuming user_roles is the field for group name
          ...selectedPermissions,
        };
        const response = await axios.post(
          "http://127.0.0.1:8000/group",
          data // Send the data directly without wrapping it in an array
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
    handleGroupRoles();
  }, []);

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
        return "Mission Report";
      case "platforms":
        return "Platforms";
         case"sreports":
         return "Special Report (Fishing Vessel)";
         case "mersreports" :
           return "Special Report (Merchant Vessel)"; 
           case "shipbreaking":
            return "Ship Breaking Report"
      default:
        return key; // Return key as is if no specific formatting is defined
    }
  };
  return (
    <StyledDiv>
      <div className="mb-5">
        <PageHeader
          title="Permission List"
          btnTitleMedia="+ Add"
          placeholder="Search"
          btnTitle="user resposnibility"
          showButton={false}
          showSearchBox={false}
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
              defaultValue={name} // Use defaultValue instead of value
              value={userRole}
              disabled={true}
              label="User Roles"
              name="user_roles"
              autocomplete="off"
              className="input mb-4"
              placeholder="User Roles"
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
                                  value={permissions}
                                  checked={
                                    selectedPermissions.Permissions[key][
                                      permKey
                                    ].has_perm
                                  }
                                  //   checked={permission[permKey].has_perm} // Set checked based on the has_perm property
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
            className="flex justify-end  items-center text-center mb-3 lg:text-right lg:mb-2 "
          >
            <Form.Item>
              <OutlineButton
                text="Cancel"
                onClick={handleBack}
                className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white ml-3 mb-3 mr-4 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block"
              />
              <FilledButton
                text="Edit"
                htmlType="submit"
                className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </StyledDiv>
  );
}

export default Grouproledetails;
const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
