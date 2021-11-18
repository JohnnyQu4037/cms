import React, { useState, useEffect } from "react";
import { List, Spin,BackTop } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { getAllCourse } from "../../../api/api-service";
import CourseCard from "../../../../components/CourseCard";
import BackToTop from "../../../../components/BackToTop";

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const style = {
  height: 40,
  width: 40,
  lineHeight: "40px",
  borderRadius: 4,
  backgroundColor: "#1088e9",
  color: "#fff",
  textAlign: "center",
  fontSize: 14,
};

export default function Courses() {
  const [data, setData] = useState({
    courses: [],
    page: 0,
    total: 0,
  });

  const loadMoreData = () => {
    getAllCourse(data.page)
      .then((res) => {
        const newData = {
          courses: [...data?.courses, ...res?.courses],
          page: res?.paginator?.page,
          total: res?.total,
        };
        setData(newData);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={data.courses.length}
        next={loadMoreData}
        hasMore={data.courses.length < data.total}
        loader={
          <CenteredDiv>
            <Spin />
          </CenteredDiv>
        }
        endMessage={<CenteredDiv>No More Course!</CenteredDiv>}
        scrollableTarget="contentLayout"
        style={{ overflow: "hidden" }}
      >
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data.courses}
          renderItem={(item) => {
            return (
              <List.Item key={item.id}>
                <CourseCard {...item} />
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
      {/* <BackTop target ={()=>{return document.getElementById("contentLayout")}} /> */}
      <BackToTop />
    </>
  );
}
