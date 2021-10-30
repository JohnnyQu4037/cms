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
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { debounce } from "lodash";

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
  const baseURL = "https://cms.chtoma.com/api/students";
  const countryOptions = ["China", "Australia", "Canada", "New Zealand"];
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
      render: (name) => <a>{name}</a>,
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

      render: (_1, _2, index) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsEditing(true);
              setIsShown(true);
              setCurrentIndex(index);
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              deleteRecord(data[index].id, index);
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

  const debouncedFetchData = useMemo(
    () =>
      debounce((e) => {
        fetchData(1, pageLimit, e.target.value);
      }, 1000),
    []
  );

  const fetchData = (updatePage, updateLimit, updateQuery) => {
    setIsLoading(true);
    const token = localStorage.getItem("cms_token")
      ? JSON.parse(localStorage.getItem("cms_token")).token
      : null;
    if (!token) {
      router.push("/");
      return;
    }
    axios
      .get(
        baseURL +
          `?page=${updatePage}&limit=${updateLimit}` +
          (updateQuery !== "" ? `&query=${updateQuery}` : ""),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        setData(res.data.data.students);
        setCurrentPage(updatePage);
        setPageLimit(updateLimit);
        setTotalRecords(res.data.data.total);
        setIsLoading(false);
        setCurrentQuery(updateQuery);
      })
      .catch((error) => {
        alert("Oops, there's something wrong.\n" + error.response.data.msg);
      });
  };

  useEffect(() => {
    fetchData(currentPage, pageLimit, currentQuery);
    return () => {
      debouncedFetchData.cancel();
    };
  }, []);

  const reset = () => {
    setIsEditing(false);
    setIsShown(false);
    setCurrentIndex(null);
  };

  function deleteRecord(id, index) {
    setIsLoading(true);
    const token = localStorage.getItem("cms_token")
      ? JSON.parse(localStorage.getItem("cms_token")).token
      : null;
    if (!token) {
      router.push("/");
      return;
    }
    axios
      .delete(baseURL + `/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const copiedData = JSON.parse(JSON.stringify(data));
        copiedData.splice(index, 1);
        setData(copiedData);
        setIsLoading(false);
      })
      .catch((error) => {
        alert("Oops, there's something wrong.\n" + error.response.data.msg);
      });
  }

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
          onChange={debouncedFetchData}
        />
      </StyledContent>
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          onChange={({ current, pageSize }) => {
            fetchData(
              pageSize !== pageLimit ? 1 : current,
              pageSize,
              currentQuery
            );
          }}
          pagination={{
            pageSize: pageLimit,
            current: currentPage,
            total: totalRecords,
          }}
        />
      </Spin>
      <Modal
        visible={isShown}
        onCancel={reset}
        centered
        destroyOnClose={true}
        maskClosable={false}
        title={isEditing ? "Edit Student" : "Add Student"}
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

            values.type =
              values.type === "tester"
                ? 1
                : values.type === "developer"
                ? 2
                : values.type;

            !isEditing
              ? axios
                  .post(baseURL, values, {
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                  })
                  .then(() => {
                    reset();
                    setIsLoading(false);
                    message.success("success");
                  })
                  .catch((error) => {
                    alert("Oops, there's something wrong.\n" + error.response);
                  })
              : axios
                  .put(
                    baseURL,
                    { ...values, id: data[currentIndex].id },
                    {
                      headers: {
                        Authorization: "Bearer " + token,
                      },
                    }
                  )
                  .then(() => {
                    reset();

                    const copiedData = JSON.parse(JSON.stringify(data));
                    copiedData[currentIndex].name = values.name;
                    copiedData[currentIndex].email = values.email;
                    copiedData[currentIndex].country = values.country;
                    copiedData[currentIndex].type.name =
                      values.type === 1 ? "tester" : "developer";

                    setData(copiedData);
                    setIsLoading(false);
                    message.success("success");
                  })
                  .catch((error) => {
                    alert("Oops, there's something wrong.\n" + error.response);
                  });
          }}
          initialValues={{
            name: data[currentIndex]?.name,
            email: data[currentIndex]?.email,
            country: data[currentIndex]?.country,
            type: data[currentIndex]?.type.name,
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
            {isEditing ? "Update" : "Add"}
          </SubmitButton>
        </Form>
      </Modal>
    </>
  );
}
