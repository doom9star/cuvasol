import { Button, Form, Input, Spin, Typography } from "antd";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { useTitle } from "../../hooks/useTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { cAxios } from "../../lib/constants";
import { useDispatch } from "react-redux";
import { setAlert } from "../../redux/slices/global";

type INFO = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  useTitle("Reset Password");

  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onReset = useCallback(
    (values: INFO) => {
      setResetting(true);
      cAxios
        .post(`auth/reset-password/${params.tid}`, values)
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/auth/login");
            dispatch(
              setAlert({
                type: "success",
                message: "Password reset success",
                description:
                  "The password has been reset successfully. You can login now!",
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Password reset failed",
                description: res.data.body || res.data.message,
              })
            );
          }
        })
        .finally(() => {
          setResetting(false);
        });
    },
    [params, navigate, dispatch]
  );

  useEffect(() => {
    cAxios
      .get(`auth/reset-password/${params.tid}`)
      .then((res) => {
        if (res.data.status !== 200) {
          navigate("/auth/login");
          dispatch(
            setAlert({
              type: "error",
              message: "Password reset unauthorized",
              description:
                "The password reset request is unauthorized, please visit forgot password page to request an email to reset password!",
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params, navigate, dispatch]);

  if (loading) {
    return <Spin size="large" className="absolute top-1/2 left-1/2" />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <AiOutlineLock className="mr-2" /> Reset Password
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onReset}>
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
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please input your password again!" },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Passwords must match!"));
              },
            }),
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
            loading={resetting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
