import { Button, Form, Input, Typography } from "antd";
import {
  AiFillFacebook,
  AiFillGoogleSquare,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";

export default function Register() {
  useTitle("Register");
  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <AiOutlineUserAdd className="mr-2" /> Register
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
          <Typography.Text className="text-xs">
            Already a user?{" "}
            <Link to={"/auth/login"}>
              <span className="underline font-bold">login</span>
            </Link>
          </Typography.Text>
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<AiOutlineUserAdd size={10} />}
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
        <div className="flex">
          <div className="w-1/2 p-2 m-2 rounded-lg flex items-center justify-center bg-red-500 text-white cursor-pointer transition-all duration-500 hover:opacity-70">
            <AiFillGoogleSquare className="mr-2" />
            <span className="text-xs">Google</span>
          </div>
          <div className="w-1/2 p-2 m-2 rounded-lg flex items-center justify-center bg-blue-500 text-white cursor-pointer transition-all duration-500 hover:opacity-70">
            <AiFillFacebook className="mr-2" />
            <span className="text-xs">Facebook</span>
          </div>
        </div>
      </Form>
    </div>
  );
}
