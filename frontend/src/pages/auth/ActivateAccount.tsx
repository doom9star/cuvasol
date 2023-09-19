import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cAxios } from "../../lib/constants";
import { Button, Form, Input, Spin, Typography } from "antd";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { useTitle } from "../../hooks/useTitle";
import { useDispatch } from "react-redux";
import { setAlert } from "../../redux/slices/global";

function ActivateAccount() {
  useTitle("Activate Account");

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const activateAccount = useCallback(
    (values: any) => {
      setActivating(true);
      cAxios
        .post(`auth/activate-account/${params.tid}`, values)
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/auth/login");
            dispatch(
              setAlert({
                type: "success",
                message: "Account activation success",
                description:
                  "Account has been successfully activated. You can login now!",
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Account activation failed",
                description: res.data.body || res.data.message,
              })
            );
          }
        })
        .finally(() => {
          setActivating(false);
        });
    },
    [params.tid, navigate, dispatch]
  );

  useEffect(() => {
    cAxios
      .get(`auth/activate-account/${params.tid}`)
      .then((res) => {
        if (res.data.status !== 200) {
          navigate("/auth/login");
          dispatch(
            setAlert({
              type: "error",
              message: "Account activation unauthorized",
              description:
                "Account activation unauthorized, as either the link is corrupted or account has already been activated!",
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.tid, navigate, dispatch]);

  if (loading) {
    return <Spin size="large" className="absolute top-1/2 left-1/2" />;
  }

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
            loading={activating}
          >
            Activate
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ActivateAccount;
