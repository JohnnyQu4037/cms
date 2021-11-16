import { Card, Button, Row, Divider } from "antd";
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
const StyledDivider = styled(Divider)`
  margin: 8px 0px;
`;
export default function CourseCard(props) {
  const router = useRouter();
  const userRole = router.pathname.split("/")[2];

  return (
    <Card cover={<img src={props.cover} style={{ height: "260px" }} />}>
      <Row>
        <h3>{props.name}</h3>
      </Row>
      <Row justify="space-between">
        <div>{props.startTime}</div>
        <div>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          {props.star}
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
      <Row justify="space-between">
        <div>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
          />
          Student Limit
        </div>
        <div>
          <b>{props.maxStudents}</b>
        </div>
      </Row>
      <Button type="primary" style={{ marginTop: "10px" }}>
        <Link href={`/dashboard/${userRole}/courses/${props.id}`}>
          Read More
        </Link>
      </Button>
    </Card>
  );
}
