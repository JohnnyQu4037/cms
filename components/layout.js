import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import axios from "axios";
import {
  DashboardOutlined,
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  ProjectOutlined,
  FileAddOutlined,
  EditOutlined,
  MessageOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const Logo = styled.div`
  height: 60px;
  display: inline-flex;
  width: 100%;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  font-size: 24px;
  color: rgb(255, 255, 255);
  text-shadow: 5px 1px 5px;
  transform: rotateX(45deg);
  font-family: monospace;
`;

const StyledContent = styled.div`
  margin: 16px;
  background-color: rgb(255, 255, 255);
  padding: 16px;
  min-height: auto;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const StyledHeader = styled(Header)`
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  position: sticky;
  padding: 0 50px;
  z-index: 10;
`;

export default function ManagerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const baseURL = "/dashboard/manager";
  const router = useRouter();

  const logoutPopup = (
    <Menu>
      <Menu.Item key="logout_0" onClick={logOut}>
        <a>Logout</a>
      </Menu.Item>
    </Menu>
  );

  function logOut() {
    const token = localStorage.getItem("cms_token")
      ? JSON.parse(localStorage.getItem("cms_token")).token
      : null;
    if (!token) {
      router.push("/");
      return;
    }

    axios
      .post(
        "https://cms.chtoma.com/api/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        alert("Oops, there's something wrong.\n" + error.response.data.msg);
      });
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => {
          setCollapsed(!collapsed);
        }}
      >
        <Logo>CMS</Logo>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link href={baseURL}>Overview</Link>
          </Menu.Item>

          <SubMenu key="sub1" icon={<SolutionOutlined />} title="Student">
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link href={baseURL + "/students"}>Student List</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="sub2" icon={<DeploymentUnitOutlined />} title="Teacher">
            <Menu.Item key="3" icon={<TeamOutlined />}>
              <Link href={baseURL + "/teachers"}>Teacher List</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="sub3" icon={<ReadOutlined />} title="Course">
            <Menu.Item key="4" icon={<ProjectOutlined />}>
              <Link href={baseURL + "/courses"}>All Courses</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<FileAddOutlined />}>
              <Link href={baseURL + "/courses/add-course"}>Add Course</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<EditOutlined />}>
              <Link href={baseURL + "/courses/edit-course"}>
                <a>Edit Course</a>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="7" icon={<MessageOutlined />}>
            <Link href={baseURL + "/message"}>Message</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <StyledHeader className="site-layout-background">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => {
                setCollapsed(!collapsed);
              },
              style: { color: "white" },
            }
          )}
          <AvatarContainer>
            <Dropdown overlay={logoutPopup}>
              <Avatar icon={<UserOutlined />} />
            </Dropdown>
          </AvatarContainer>
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </Layout>
    </Layout>
  );
}
