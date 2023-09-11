import { Button, Form, Input, Radio, Typography } from "antd";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { UserType } from "../../types/models";
import { useMemo } from "react";

export default function Register() {
  useTitle("Register");

  const options = useMemo(() => {
    const values = Object.values(UserType) as string[];
    const result = [];
    for (let i = 0; i < values.length / 2; i++) {
      result.push({
        label: `${values[i][0]}${values[i].slice(1).toLowerCase()}`,
        value: i + 1,
      });
    }
    return result;
  }, []);

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
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            defaultValue={options[0].value}
          >
            {options.map((option) => (
              <Radio value={option.value}>{option.label}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Typography.Text className="text-xs">
            Already a staff?{" "}
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
      </Form>
    </div>
  );
}
