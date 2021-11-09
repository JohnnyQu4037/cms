import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React from "react";

const overview = {
  path: "",
  label: "Overview",
  icon: <DashboardOutlined />,
};

const students = {
  path: "students",
  label: "Student",
  icon: <SolutionOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [{ path: "", label: "Student List", icon: <TeamOutlined /> }],
};

const teachers = {
  path: "teachers",
  label: "Teacher",
  icon: <DeploymentUnitOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    {
      path: "",
      label: "Teacher List",
      icon: <TeamOutlined />,
    },
  ],
};

const courses = {
  path: "courses",
  label: "Course",
  icon: <ReadOutlined />,
  hideLinkInBreadcrumb: true,
  subNav: [
    { path: "", label: "All Courses", icon: <ProjectOutlined /> },
    {
      path: "add-course",
      label: "Add Course",
      icon: <FileAddOutlined />,
    },
    {
      path: "edit-course",
      label: "Edit Course",
      icon: <EditOutlined />,
    },
  ],
};

const messages = {
  path: "message",
  label: "Message",
  icon: <MessageOutlined />,
};

export const routes = {
  manager: [overview, students, teachers, courses, messages],
  teacher: [],
  student: [],
};
