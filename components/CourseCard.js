import { Card, Button, Row, Divider, Col } from "antd";
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { courseSalesInfo } from "../constant";

const StyledDivider = styled(Divider)`
  margin: 8px 0px;
`;

const StyledRow = styled(Row)`
  border-top: 1px solid #f0f0f0;
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
  :last-child {
    border-right: none;
  }
  padding: 8px 3px;
`;

export default function CourseCard(props) {
  const router = useRouter();
  const userRole = router.pathname.split("/")[2];
  return (
    <Card
      cover={<img src={props.cover} style={{ height: "260px" }} />}
      bodyStyle={props.isDetailPage ? { paddingBottom: "0px" } : {}}
    >
      <Row>
        <h3>{props.name}</h3>
      </Row>
      <Row justify="space-between">
        <div>{props.startTime}</div>
        <div>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          <b>{props.star}</b>
        </div>
      </Row>
      <StyledDivider />
      <Row justify="space-between">
        <div>Duration:</div>
        <div>
          <b>{`${props.duration} ${props.duration <= 1 ? "year" : "years"}`}</b>
        </div>
      </Row>
      <StyledDivider />
      <Row justify="space-between">
        <div>Teacher:</div>
        <div>
          <b>
            <Link href={`/dashboard/${userRole}`}>{props.teacherName}</Link>
          </b>
        </div>
      </Row>
      <StyledDivider />
      <Row justify="space-between" style={{ marginBottom: "16px" }}>
        <div>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
          />
          Student Limit:
        </div>
        <div>
          <b>{props.maxStudents}</b>
        </div>
      </Row>
      {props.isDetailPage ? (
        <StyledRow justify="space-between">
          {Object.keys(courseSalesInfo).map((item) => {
            return (
              <StyledCol span={6} key={item}>
                <b style={{ color: "rgb(115, 86, 241)", fontSize: "24px" }}>
                  {props.sales[item]}
                </b>
                <div>{courseSalesInfo[item]}</div>
              </StyledCol>
            );
          })}
        </StyledRow>
      ) : (
        <Button type="primary">
          <Link href={`/dashboard/${userRole}/courses/${props.id}`}>
            Read More
          </Link>
        </Button>
      )}
    </Card>
  );
}
