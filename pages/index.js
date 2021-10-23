import React from "react";
import styled from "styled-components";
import { Button, Checkbox, Form, Input, Radio, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { AES } from "crypto-js";

const { Title } = Typography;

const testAccount = {
  email: "123@abc.com",
  password: "12345678",
  user_group: "Student",
};

export const StyledTitle = styled(Title)`
  text-align: center;
  margin: 20px 0;
`;

export const FormContainer = styled.section`
  display: flex;
  margin-left: 25%;
  width: 50%;
  height: 100%;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
`;

export const CustomizedForm = styled(Form)`
  width: 100%;
`;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const baseURL = "https://cms.chtoma.com/api";
  const axios = require("axios");

  const submitForm = async (request) => {
    const { password, ...rest } = request;

    axios
      .post(baseURL + "/login", {
        ...rest,
        password: AES.encrypt(password, "cms").toString(),
      })
      .then((response) => {
        console.log(response);
        console.log("success");
        router.push("dashboard");
      })
      .catch((response) => {
        console.log(response);
      });
  };

  const userGroupChange = (event) => {
    form.resetFields();
    form.setFieldsValue({ user_group: event.target.value });
  };

  return (
    <>
      <StyledTitle>课程管理助手</StyledTitle>

      <FormContainer>
        <CustomizedForm
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={submitForm}
          form={form}
        >
          <Form.Item
            name="user_group"
            initialValue="Student"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={userGroupChange}>
              <Radio.Button value="Student">Student</Radio.Button>
              <Radio.Button value="Teacher">Teacher</Radio.Button>
              <Radio.Button value="Manager">Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入您的邮箱" },
              { type: "email" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="请输入邮箱"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入您的密码" },
              { min: 4, max: 16 },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <br />
          <br />
          <Form.Item>
            <SubmitButton type="primary" htmlType="submit">
              登录
            </SubmitButton>
          </Form.Item>
        </CustomizedForm>
      </FormContainer>
    </>
  );
}
