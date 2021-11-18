import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCourseInfo } from "../../../api/api-service";
import { Card, Col, Row, Badge, Tag, Steps, Collapse } from "antd";
import CourseCard from "../../../../components/CourseCard";
import styled from "styled-components";
import { CourseStatusBadge } from "../../../../constant";
import CourseTimetable from "../../../../components/CourseTimetable";

const { Step } = Steps;
const { Panel } = Collapse;

const H3 = styled.h3`
  margin: 16.5px 0px;
`;

export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: { courseId: id },
  };
}

const generateExtra = (item,current) => {
  if (item.id < current) {
    return(<Tag key = {item.id} color="default">finished</Tag>)
  } else if (item.id > current) {
    return(<Tag key = {item.id} color="orange">pending</Tag>)
  } else {
    return(<Tag key = {item.id} color="green">processing</Tag>)
  }
}

export default function CourseDetail(courseId) {
  const router = useRouter();
  const id = router.query.id || courseId;
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    getCourseInfo(id).then((res) => {
      res.isDetailPage = true;
      setCourseInfo(res);
    });
  }, [id]);

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={[6, 16]}>
          <Col span={8}>
            {courseInfo ? <CourseCard {...courseInfo} /> : null}
          </Col>

          <Col offset={1} span={15}>
            <Card>
              <h2 style={{ color: "rgb(115, 86, 241)" }}>Course Detail</h2>
              <H3>Create Time</H3>
              <Row>{courseInfo?.createdAt}</Row>
              <H3>Start Time</H3>
              <Row>{courseInfo?.startTime}</Row>
              <Badge
                status={CourseStatusBadge[courseInfo?.status]}
                dot={true}
                offset={[5, 24]}
              >
                <H3>Status</H3>
              </Badge>
              <Row style={{ overflowX: "hidden" }}>
                <Steps
                  size="small"
                  style={{ width: "auto" }}
                  current={courseInfo?.schedule.chapters.findIndex(
                    (item) => item.id === courseInfo.schedule.current
                  )}
                >
                  {courseInfo?.schedule.chapters.map((item, index) => {
                    return <Step key={index} title={item.name}></Step>;
                  })}
                </Steps>
              </Row>
              <H3>Course Code</H3>
              <Row>{courseInfo?.uid}</Row>
              <H3>Class Time</H3>
              <CourseTimetable>
                {courseInfo?.schedule.classTime}
              </CourseTimetable>
              <H3>Category</H3>
              <Row>
                {courseInfo?.type.map((item) => {
                  return (
                    <Tag key={item.id} color="geekblue">
                      {item.name}
                    </Tag>
                  );
                })}
              </Row>
              <H3>Description</H3>
              <Row>{courseInfo?.detail}</Row>
              <H3>Chapter</H3>
              <Collapse activeKey = {courseInfo?.schedule.current}>
                {courseInfo?.schedule.chapters.map((item) => {
                  return (
                    <Panel
                      header={item.name}
                      key={item.id}
                      extra={generateExtra(item,courseInfo.schedule.current)}
                    >
                      <div>{item.content}</div>
                    </Panel>
                  );
                })}
              </Collapse>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
