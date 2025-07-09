import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Col, Form, Row, Checkbox, Result, Button } from "antd";
import React, { useEffect, useState } from "react";
import InputBox from "../../src/components/form/InputBox";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";
import SelectBox from "../../src/components/form/SelectBox";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import Heading from "../../src/components/title/Heading";
import { showToastSuccess } from "../../src/helper/MyToast";
import Visualpageheader from "../../src/components/pageheader/visualpageheader";

function UserResponsibility() {
  const router = useRouter();
  const { id, username } = router.query;

  const [form] = useForm();
  const [groupList, setGroupList] = useState([]);
  const [groupTrue, setGroupTrue] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [groupSelect, setGroupSelect] = useState([]);

  const handleGroupRoles = async () => {
    try {
      const data = {
        username: username,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user_perm`,
        data,
    
      );
      if (response.status === 200) {
        const userGroups = response.data.user_groups;
        setGroupList(userGroups);
        setGroupSelect(userGroups.filter((group) => !group.added));
        setGroupTrue(userGroups.filter((group) => group.added));
        setAccessDenied(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage = error.response.data.detail;
        console.log(errorMessage)
        setAccessDenied(true);
      }
    }
  };

  const handleUserPermission = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      try {
        const updatedGroupSelect = groupSelect.map((group) => {
          const existingGroup = groupTrue.find(
            (trueGroup) => trueGroup.name === group.name
          );
          return existingGroup ? existingGroup : group;
        });

        const data = {
          username: username,
          user_groups: updatedGroupSelect,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user_perm`,
          data,
       
        );
        if (response.status === 200 || response.status === 201) {
          showToastSuccess(`Data Saved Successfully`);
          router.push("/user");
        }
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    handleGroupRoles();
  }, []);

  const handleCheckboxToggle = (groupName) => {
    const updatedGroupTrue = groupTrue.map((group) => {
      if (group.name === groupName) {
        return { ...group, added: !group.added };
      }
      return group;
    });
    setGroupTrue(updatedGroupTrue);
    

    const updatedGroupList = groupList.map((group) => {
      if (group.name === groupName) {
        return { ...group, added: !group.added };
      }
      return group;
    });
    setGroupList(updatedGroupList);

    // Update groupSelect
    const updatedGroupSelect = updatedGroupList.filter((group) => !group.added);
    setGroupSelect(updatedGroupSelect);
  };

  const handleSelectChange = (selectedGroups) => {
    const updatedGroupSelect = groupList.map((group) => ({
      ...group,
      added: selectedGroups.includes(group.name),
    }));
    setGroupSelect(updatedGroupSelect);

    // Update groupList
    const updatedGroupList = groupList.map((group) => ({
      ...group,
      added: selectedGroups.includes(group.name),
    }));
    setGroupList(updatedGroupList);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <StyledDiv>
      {accessDenied ? (
       <>
         <Visualpageheader/>
         <Result
          status="403"
          title="403 Forbidden"
          subTitle="You can not view/change permissions for this user."
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
         />
       </>
      ) : (
        <>
          <div className="mb-5">
            <PageHeader
              title="Permission List"
              btnTitleMedia="+ Add"
              placeholder="Search"
              btnTitle="user responsibility"
              showSearchBox={false}
              showButton={false}
            />
          </div>
          <Form
            form={form}
            onFinish={handleUserPermission}
            layout="vertical"
            autoComplete="off"
            className="shadow mx-5 px-3 py-10 bg-white mb-4"
          >
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={8} lg={8} xl={7} className="ml-2 mr-2">
                <InputBox
                  label="Username"
                  className="input mb-4"
                  defaultValue={username}
                  disabled={true}
                />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={7} className="ml-2 mr-2">
                <SelectBox
                  mode="multiple"
                  allowClear
                  autoComplete="off"
                  name="roles"
                  className="input mb-4"
                  placeholder="Select Roles"
                  label="Group Roles"
                  value={groupSelect.map((group) => group.name)}
                  onChange={handleSelectChange}
                  options={groupList
                    .filter((group) => !group.added)
                    .map((group) => ({
                      value: group.name,
                      label: group.name,
                      disabled: group.added,
                    }))}
                  disabled={groupSelect.length === 0}
                />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={7}></Col>
            </Row>
            <Row className="flex justify-center">
              <Col xs={24} sm={24} md={8} lg={8} xl={7} className="ml-2 mr-2">
                <Heading text="Access Granted" level={4} />
                {groupTrue.map((group) => (
                  <Checkbox
                    key={group.name}
                    value={group.name}
                    checked={group.added}
                    disabled={groupList.length === 0}
                    onChange={() => handleCheckboxToggle(group.name)}
                  >
                    {group.name}
                  </Checkbox>
                ))}
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={7}></Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={7}></Col>
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
        </>
      )}
    </StyledDiv>
  );
}

export default UserResponsibility;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
