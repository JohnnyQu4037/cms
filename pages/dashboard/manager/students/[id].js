import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getStudentInfo } from "../../../api/api-service";
import { Card, Col, Row, Tag, Table, Avatar } from "antd";
import styled from "styled-components";
import { programLanguageColors } from "../../../../constant";

const H3 = styled.h3`
  color: rgb(115, 86, 241);
  margin: 20 px 0 px;
  font-size: 24px;
`;

export const B = styled.b`
  margin-right: 16px;
  min-width: 150px;
  display: inline-block;
`;

const tabListNoTitle = [
  {
    key: "About",
    tab: "About",
  },
  {
    key: "Courses",
    tab: "Courses",
  },
];

export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: { studentId: id },
  };
}

export default function StudentDetail(studentId) {
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState("About");
  const router = useRouter();
  const id = router.query.id || studentId;

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value) => <a>{value}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => type.map((item) => item.name).join(","),
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
  ];

  const contentList = {
    About: (
      <>
        <H3>Information</H3>

        <Row gutter={[6, 16]}>
          <Col span={24} key="Education">
            <B>Education:</B>
            <span>{studentInfo?.education}</span>
          </Col>
          <Col span={24} key="Area">
            <B>Area:</B>
            <span>{studentInfo?.country}</span>
          </Col>
          <Col span={24} key="Gender">
            <B>Gender:</B>
            <span>{studentInfo?.gender === 1 ? "Male" : "Female"}</span>
          </Col>
          <Col span={24} key="Member Period">
            <B>Member Period:</B>
            <span>
              {studentInfo?.memberStartAt + " - " + studentInfo?.memberEndAt}
            </span>
          </Col>
          <Col span={24} key="Type">
            <B>Type:</B>
            <span>{studentInfo?.type.name}</span>
          </Col>
          <Col span={24} key="Create Time">
            <B>Create Time:</B>
            <span>{studentInfo?.createdAt}</span>
          </Col>
          <Col span={24} key="Update Time">
            <B>Update Time:</B>
            <span>{studentInfo?.updatedAt}</span>
          </Col>
        </Row>

        <H3>Interesting</H3>

        <Row gutter={[6, 16]}>
          <Col>
            {studentInfo?.interest.map((item, index) => (
              <Tag
                color={programLanguageColors[index]}
                key={item}
                style={{ padding: "5px 10px" }}
              >
                {item}
              </Tag>
            ))}
          </Col>
        </Row>

        <H3>Description</H3>

        <p>{studentInfo?.description}</p>
      </>
    ),
    Courses: (
      <>
        <Table
          dataSource={studentInfo?.courses}
          columns={columns}
          rowKey="id"
        />
      </>
    ),
  };

  useEffect(() => {
    getStudentInfo(id).then((res) => {
      setStudentInfo(res);
    });
  }, [id]);

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Card
              title={
                <Avatar
                  src={studentInfo?.avatar}
                  style={{
                    width: 100,
                    height: 100,
                    display: "block",
                    margin: "auto",
                  }}
                />
              }
            >
              <Row gutter={[6, 16]}>
                {["Name", "Age", "Email", "Phone"].map((item) => (
                  <Col
                    span={12}
                    key={item}
                    style={{ textAlign: "center" }}
                  >
                    <b>{item}</b>
                    <p>
                      {studentInfo ? studentInfo[item.toLowerCase()] : null}
                    </p>
                  </Col>
                ))}
              </Row>
              <Row gutter={[6, 16]}>
                <Col span={24} style={{ textAlign: "center" }}>
                  <b>Address</b>
                  <p>{studentInfo?.address}</p>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col offset={1} span={15}>
            <Card
              tabList={tabListNoTitle}
              activeTabKey={activeTabKey}
              onTabChange={(key) => {
                setActiveTabKey(key);
              }}
            >
              {contentList[activeTabKey]}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
