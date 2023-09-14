import { Button, Form, Input } from "antd";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../hooks/useTitle";
import { useCallback } from "react";
import { cAxios } from "../../library/constants";
import { useDispatch } from "react-redux";
import { setAlert } from "../../redux/slices/global";

type INFO = {
  email: string;
};

export default function ForgotPassword() {
  useTitle("Forgot Password");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (values: INFO) => {
      cAxios.post("auth/forgot-password", values).then((res) => {
        if (res.data.status === 200) {
          navigate("/auth/login");
          dispatch(
            setAlert({
              type: "success",
              message: "Password request success",
              description:
                "The reset password url has been emailed to you. Visit that url to reset password!",
            })
          );
        } else {
          dispatch(
            setAlert({
              type: "error",
              message: "Password request failed",
              description: res.data.body || res.data.message,
            })
          );
        }
      });
    },
    [navigate, dispatch]
  );

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <img
        src="/logo.png"
        alt="logo"
        className="w-32 self-center cursor-pointer h-16 object-contain rounded-full mb-10"
        onClick={() => navigate("/")}
      />
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<AiOutlineMail size={10} />}
            htmlType="submit"
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
