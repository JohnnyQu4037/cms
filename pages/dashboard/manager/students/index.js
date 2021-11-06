import {
  Table,
  Button,
  Space,
  Input,
  Spin,
  Popconfirm,
  Modal,
  Form,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { debounce } from "lodash";
import Link from 'next/link';
import {
  deleteRecord,
  editStudent,
  addStudent,
  dataEnquiry,
} from "../../../api/api-service";

const { Search } = Input;
const StyledContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
const LongSearchBar = styled(Search)`
  width: 30%;
`;

const SubmitButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  right: 100px;
`;

export default function Students() {
  const _ = require("lodash");
  const countryOptions = ["China", "Australia", "Canada", "New Zealand"];
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [isShown, setIsShown] = useState(false);

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_,record) =>{
        return <Link href={`/dashboard/manager/students/${record.id}`}>{record.name}</Link>
      } ,
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => {
        return a.name.charAt(0) > b.name.charAt(0)
          ? 1
          : a.name.charAt(0) === b.name.charAt(0)
          ? 0
          : -1;
      },
    },
    {
      title: "Area",
      dataIndex: "country",
      filters: [
        { text: "China", value: "China" },
        { text: "New Zealand", value: "New Zealand" },
        { text: "Canada", value: "Canada" },
        { text: "Australia", value: "Australia" },
      ],
      onFilter: (value, record) => record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      width: "25%",
      render: (courses) => courses?.map((course) => course.name).join(","),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      render: (type) => type?.name,
      filters: [
        { text: "developer", value: "developer" },
        { text: "tester", value: "tester" },
      ],
      onFilter: (value, record) => record.type?.name.includes(value),
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (value) =>
        formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: "Action",

      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditingStudent(record);
              setIsShown(true);
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              setIsLoading(true);
              deleteRecord(`students/${record.id}`).then((res) => {
                if (res) {
                  const filteredData = data.filter((item) => {
                    return item.id !== record.id;
                  });
                  setData(filteredData);
                }
              });
              setIsLoading(false);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchData = useCallback((updatedPage, updatedQuery) => {
    setIsLoading(true);
    dataEnquiry(updatedPage, updatedQuery).then((res) => {
      setData(res.students);
      setPageInfo({
        page: res.paginator.page,
        limit: res.paginator.limit,
        total: res.total,
      });
      setCurrentQuery(updatedQuery);
      setIsLoading(false);
    });
  }, []);

  const debouncedFetchData = useMemo(() => debounce(fetchData, 1000), []);

  useEffect(() => {
    fetchData(pageInfo, currentQuery);
  }, []);

  const reset = () => {
    setEditingStudent(null);
    setIsShown(false);
  };

  return (
    <>
      <StyledContent>
        <Button
          type="primary"
          size="medium"
          onClick={() => {
            setIsShown(true);
          }}
        >
          <PlusOutlined /> Add
        </Button>
        <LongSearchBar
          placeholder="Search by name"
          onChange={(e)=>{debouncedFetchData({
            page:pageInfo.page,
            limit: pageInfo.limit,
            total: pageInfo.total,
          },
          e.target.value)}}
        />
      </StyledContent>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          onChange={({ current, pageSize }) => {
            fetchData(
              {
                page: pageSize !== pageInfo.limit ? 1 : current,
                limit: pageSize,
                total: pageInfo.total,
              },
              currentQuery
            );
          }}
          pagination={{
            pageSize: pageInfo.limit,
            current: pageInfo.page,
            total: pageInfo.total,
          }}
        />
      </Spin>
      <Modal
        visible={isShown}
        onCancel={reset}
        centered
        destroyOnClose={true}
        maskClosable={false}
        title={editingStudent ? "Edit Student" : "Add Student"}
        footer={[
          <Button key="cancel" onClick={reset}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ offset: 1 }}
          onFinish={(values) => {
            setIsLoading(true);
            const token = localStorage.getItem("cms_token")
              ? JSON.parse(localStorage.getItem("cms_token")).token
              : null;
            if (!token) {
              router.push("/");
              return;
            }

            if (editingStudent) {
              values.id = editingStudent.id;
              editStudent("students", values).then((res) => {
                const index = data.findIndex((item) => item.id === res.id);
                data[index] = res;
                setData([...data]);
                reset();
                setIsLoading(false);
              });
            } else {
              addStudent("students", values).then(() => {
                reset();
                setIsLoading(false);
              });
            }
          }}
          initialValues={{
            name: editingStudent?.name,
            email: editingStudent?.email,
            country: editingStudent?.country,
            type: editingStudent?.type.name,
          }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input type="text" placeholder="student name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email" }, { required: true }]}
          >
            <Input type="email" placeholder="email" />
          </Form.Item>

          <Form.Item label="Area" name="country" rules={[{ required: true }]}>
            <Select>
              {countryOptions.map((item, index) => (
                <Select.Option value={item} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Student Type"
            name="type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={1}>Tester</Select.Option>
              <Select.Option value={2}>Developer</Select.Option>
            </Select>
          </Form.Item>
          <SubmitButton type="primary" htmlType="submit">
            {editingStudent ? "Update" : "Add"}
          </SubmitButton>
        </Form>
      </Modal>
    </>
  );
}
