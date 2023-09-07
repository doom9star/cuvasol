import { Button, Form, Input, Typography } from "antd";
import { FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";

export default function Login() {
  useTitle("Login");
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <img
        src="/logo.png"
        alt="logo"
        className="w-32 self-center cursor-pointer h-16 object-contain rounded-full mb-10"
        onClick={() => navigate("/")}
      />
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
