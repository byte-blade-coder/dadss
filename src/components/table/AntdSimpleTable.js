import React, { useEffect } from "react";
import { Table, Input, Icon, Row, Col, Space, Select, Modal } from "antd";
import { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import styled from "styled-components";
import { RxArrowLeft } from "react-icons/rx";
import Heading from "../title/Heading";
// import Search from "antd/es/input/Search";
import FilledButton from "../button/FilledButton";
import SimpleButton from "../button/SimpleButton";

const { Search } = Input;

const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;
function AntdSimpleTable() {
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      platformId: "2651",
      name: "John Doe",
      squadron: "Osron 26 SQN",
      co: "......",
      otherInfo: "lorem ipsum is a",
      age: 32,
    },
    {
      key: "2",
      platformId: "2652",
      name: "Jane Doe",
      squadron: "Osron 26 SQN",
      co: "......",
      otherInfo: "lorem ipsum is a",
      age: 42,
    },
    {
      key: "3",
      platformId: "2653",
      name: "Jim Brown",
      squadron: "Osron 26 SQN",
      co: "......",
      otherInfo: "lorem ipsum is a",
      age: 22,
    },
  ]);
  const [editingKey, setEditingKey] = useState("");
  const [count, setCount] = useState(dataSource.length);
  const isEditing = (record) => record.key === editingKey;
  const edit = (key) => {
    setEditingKey(key);
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((platform) => platform.key !== record.key);
        });
      },
    });
  };
  const save = (record) => {
    // setCount((prev) => prev + 1);
    // setCount(count + 1);
    setDataSource((prev) => [...prev, newData]);
    setDataSource((pre) => {
      return pre.filter((platform) => platform.key !== 0);
    });
    // setDataSource((prev) => //console.log([...prev]));
  };
  // const save = (form, key) => {
  //   form.validateFields((error, row) => {
  //     if (error) {
  //       return;
  //     }
  //     const newData = [...dataSource];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setDataSource(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setDataSource(newData);
  //       setEditingKey("");
  //     }
  //   });
  // };
  const edited = (key) => {
    setDataSource((prevState) => {
      const newState = prevState.map((item) => {
        if (item.key === key) {
          return { ...item, ...editedData };
        }
        return item;
      });

      return newState;
    });
    setEditingKey("");
  };
  const handleCancel = () => {
    setEditingKey("");
  };

  const handleEditChange = (e) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddChange = (e) => {
    setNewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      key: count + 1,
    }));
  };


  const columns = [
    {
      title: "Platform ID",
      dataIndex: "platformId",
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            style={{ width: "130px" }}
            placeholder="123squ"
            defaultValue={text}
            name="platformId"
            onChange={handleEditChange}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Full Name",
      dataIndex: "name",
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            style={{ width: "130px" }}
            placeholder="Rienks Willson"
            defaultValue={text}
            name="name"
            onChange={handleEditChange}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Type",
      dataIndex: "vessels",
      render: (text, record) => {
        return isEditing(record) ? (
          <Select
            defaultValue={text}
            style={{ width: "130px" }}
            name="age"
            onChange={handleEditChange}
            options={[
              {
                value: "cargo",
                label: "Cargo Vessels",
              },
              {
                value: "container",
                label: "Container Vessels",
              },
              {
                value: "reefer",
                label: "Reefer Vessels",
              },
            ]}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Squadron",
      dataIndex: "squadron",
      render: (text, record) => {
        return isEditing(record) ? (
          <Select
            defaultValue={text}
            name="squadron"
            style={{ width: "130px" }}
            onChange={handleEditChange}
            options={[
              {
                value: "osronold",
                label: "OSRON 25 SQN",
              },
              {
                value: "osronnew",
                label: "OSRON 27 SQN",
              },
              {
                value: "osronmiddle",
                label: "OSRON 28 SQN",
              },
            ]}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "CO",
      dataIndex: "co",
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            defaultValue={text}
            style={{ width: "130px" }}
            placeholder="...."
            name="co"
            onChange={handleEditChange}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Other Info",
      dataIndex: "otherInfo",
      render: (text, record) => {
        return isEditing(record) ? (
          <Input
            style={{ width: "130px" }}
            placeholder=""
            defaultValue={text}
            name="otherInfo"
            onChange={handleEditChange}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (record.key <= 0) {
          return (
            <div style={{ display: "flex" }}>
              <SimpleButton
                onClick={() => handleDelete(record)}
                style={{
                  fontWeight: "bold",
                }}
                text="Cancel"
              />
              <SimpleButton
                onClick={() => save(record)}
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#008000",
                }}
                text="Save"
              />
            </div>
          );
        } else {
          return isEditing(record) ? (
            <div style={{ display: "flex" }}>
              <SimpleButton
                onClick={handleCancel}
                style={{
                  fontWeight: "bold",
                }}
                text="Cancel"
              />
              <SimpleButton
                onClick={() => edited(record.key)}
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#ffbf00",
                }}
                text="Edit"
              />
            </div>
          ) : (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() => edit(record.key)}
              />
              <MdDelete
                onClick={() => handleDelete(record)}
                className="deleteIcon"
              />
            </IconsStylingWrap>
          );
        }
      },
    },
  ];
  const handleShowInput = () => {
    // setCount(count + 1);
    setCount((prev) => prev + 1);

    setDataSource([
      {
        key: 0,
        platformId: (
          <Input
            placeholder="Platform ID"
            onChange={handleAddChange}
            name="platformId"
          />
        ),
        name: (
          <Input placeholder="Name" onChange={handleAddChange} name="name" />
        ),
        age: <Input placeholder="Age" onChange={handleAddChange} name="age" />,
        squadron: (
          <Input
            placeholder="Squadron"
            onChange={handleAddChange}
            name="squadron"
          />
        ),
        co: <Input placeholder="CO" onChange={handleAddChange} name="co" />,
        otherInfo: (
          <Input
            placeholder="Other Info"
            onChange={handleAddChange}
            name="otherInfo"
          />
        ),
      },
      ...dataSource,
    ]);
  };
  return (
    <>
      <div className="flex flex-column pt-5">
        <RxArrowLeft className="ml-8 mr-5" fontSize={25} />
        <p>Back</p>
      </div>
      <Row className="p-8 flex">
        <Col span={11}>
          <Heading
            level={4}
            className="whitespace-nowrap "
            text="Platform Data (View/Add)"
          />
        </Col>
        <Col span={8}>
          <Search size="large" placeholder="Search" allowClear />
        </Col>
        <Col className="flex justify-center items-center" span={4} offset={1}>
          <FilledButton
            text="+Add Platform"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleShowInput}
          />
        </Col>
      </Row>
      <Row className="flex justify-center">
        <Col span={23}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 5,
              position: ["bottomCenter"],
            }}
            rowClassName="editable-row"
          />
        </Col>
      </Row>
    </>
  );
}

export default AntdSimpleTable;
