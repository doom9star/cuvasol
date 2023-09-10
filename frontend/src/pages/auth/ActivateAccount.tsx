import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cAxios } from "../../library/constants";
import { Button, Form, Input, Typography } from "antd";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { useTitle } from "../../hooks/useTitle";

function ActivateAccount() {
  useTitle("Activate Account");

  const navigate = useNavigate();
  const params = useParams();

  const activateAccount = useCallback(
    (values: any) => {
      cAxios
        .post(`/auth/activate-account/${params.tid}`, values)
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/auth/login");
          }
        });
    },
    [params.tid, navigate]
  );

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <AiOutlineLock className="mr-2" /> Activate Account
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={activateAccount}>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoFocus />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<AiOutlineMail size={10} />}
            htmlType="submit"
          >
            Activate
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ActivateAccount;
