import React from "react";
import styled from "styled-components";
import { Button, Checkbox, Form, Input, Radio, Typography } from "antd";
import { useRouter } from "next/router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { AES } from "crypto-js";
import { login } from "./api/api-service";

const { Title } = Typography;

export const StyledTitle = styled(Title)`
  text-align: center;
  margin: 20px 0;
`;

export const FormContainer = styled.section`
  display: flex;
  margin-left: 33.3%;
  width: 33.3%;
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

  const submitForm = async (request) => {
    const { password, ...rest } = request;
    login({ ...rest, password: AES.encrypt(password, "cms").toString() }).then(
      (response) => {
        if (response.code === 201) {
          localStorage.setItem("cms_token", JSON.stringify(response.data));
          router.push("dashboard");
        }
      }
    );
  };

  const userGroupChange = (event) => {
    form.resetFields();
    form.setFieldsValue({ role: event.target.value });
  };

  return (
    <>
      <StyledTitle>Course Management Assistant</StyledTitle>

      <FormContainer>
        <CustomizedForm
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={submitForm}
          form={form}
        >
          <Form.Item
            name="role"
            initialValue="manager"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={userGroupChange}>
              <Radio.Button value="student">Student</Radio.Button>
              <Radio.Button value="teacher">Teacher</Radio.Button>
              <Radio.Button value="manager">Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="Please input email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password" },
              { min: 4, max: 16 },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Please input password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <SubmitButton type="primary" htmlType="submit">
              Sign in
            </SubmitButton>
          </Form.Item>
        </CustomizedForm>
      </FormContainer>
    </>
  );
}
