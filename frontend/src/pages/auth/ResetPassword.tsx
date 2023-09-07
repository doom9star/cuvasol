import { Button, Form, Input, Typography } from "antd";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { useTitle } from "../../hooks/useTitle";

export default function ResetPassword() {
  useTitle("Reset Password");
  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <AiOutlineLock className="mr-2" /> Reset Password
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left">
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoFocus />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please input your password again!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<AiOutlineMail size={10} />}
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
