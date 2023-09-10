import { Button, Form, Input, Typography } from "antd";
import { AiOutlineLogin } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";

export default function Login() {
  useTitle("Login");
  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <AiOutlineLogin className="mr-2" /> Login
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Typography.Text className="text-xs">
            Forgot password?{" "}
            <Link to={"/auth/forgot-password"}>
              <span className="underline font-bold">reset</span>
            </Link>
          </Typography.Text>
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<FiLogIn size={10} />}
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
