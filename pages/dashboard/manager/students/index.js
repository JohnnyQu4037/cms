import { Table, Button, Space, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const { Search } = Input;
const StyledContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
const LongSearchBar = styled(Search)`
  width: 30%;
`;

const columns = [
  {
    title: "No.",
    key: "index",
    render: (_1, _2, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    render: (name) => <a>{name}</a>,
  },
  {
    title: "Area",
    dataIndex: "country",
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
  },
  {
    title: "Join Time",
    dataIndex: "createdAt",
    render: (value) =>
      formatDistanceToNow(new Date(value), { addSuffix: true }),
  },
  {
    title: "Action",

    render: (text, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export default function Students() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchData = () => {
    const token = localStorage.getItem("cms_token")
      ? JSON.parse(localStorage.getItem("cms_token")).token
      : null;
    if (!token) {
      router.push("/");
      return;
    }
    axios
      .get("https://cms.chtoma.com/api/students?page=1&limit=10", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setData(res.data.data.students);
        setTotal(res.data.data.total);
      })
      .catch((error) => {
        alert("Oops, there's something wrong.\n" + error.response.data.msg);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StyledContent>
        <Button type="primary" size="medium">
          <PlusOutlined /> Add
        </Button>
        <LongSearchBar placeholder="Search by name" allowClear />
      </StyledContent>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total,
        }}
      />
    </>
  );
}
