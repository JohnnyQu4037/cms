import { Row, Col, Card, Progress } from "antd";
import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { getOverview } from "../../api/api-service";
import { cloneDeep } from "lodash";

const CardIcon = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
`;

const CardInfo = styled(Col)`
  h3 {
    color: white;
  }
  h2 {
    color: white;
    font-size: 32px;
    margin-bottom: 0;
  }
  color: white;
`;

export default function Manager() {
  const [Overview, setOverview] = useState({
    student: {
      backgroundColor: "rgb(24, 144, 255)",
      icon: <SolutionOutlined />,
      title: "TOTAL STUDENTS",
      total: null,
      lastThirtyDay: null,
    },
    teacher: {
      backgroundColor: "rgb(103, 59, 183)",
      icon: <DeploymentUnitOutlined />,
      title: "TOTAL TEACHERS",
      total: null,
      lastThirtyDay: null,
    },
    course: {
      backgroundColor: "rgb(255, 170, 22)",
      icon: <ReadOutlined />,
      title: "TOTAL COURSES",
      total: null,
      lastThirtyDay: null,
    },
  });

  useEffect(() => {
    const clone = cloneDeep(Overview);
    getOverview().then((data) => {
      Object.keys(data).map((item) => {
        clone[item].total = data[item].total;
        clone[item].lastThirtyDay =
          Math.round((data[item].lastMonthAdded / data[item].total) * 1000) /
          10;
      });
      setOverview(clone);
    });
  }, []);
  return (
    <div>
      <Row gutter={16}>
        {Object.values(Overview).map((item, index) => {
          return (
            <Col key={index} span={8}>
              <Card
                style={{
                  borderRadius: "5px",
                  background: item.backgroundColor,
                }}
              >
                <Row>
                  <CardIcon span={6}>{item.icon}</CardIcon>
                  <CardInfo span={18}>
                    <h3>{item.title}</h3>
                    <h2>{item.total}</h2>
                    <Progress
                      percent={100 - item.lastThirtyDay}
                      size="small"
                      showInfo={false}
                      strokeColor="white"
                      trailColor="lightgreen"
                    />
                    <p>{item.lastThirtyDay}% Increase in 30 Days</p>
                  </CardInfo>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
