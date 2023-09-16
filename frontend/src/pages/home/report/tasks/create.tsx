import { Button, Form, Input, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MdAdd } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { setAlert, useGlobalState } from "../../../../redux/slices/global";
import { addTask, useHomeState } from "../../../../redux/slices/home";
import { useCallback, useState } from "react";
import { cAxios } from "../../../../lib/constants";
import { useTitle } from "../../../../hooks/useTitle";
import { useDispatch } from "react-redux";

type INFO = {
  name: string;
  description: string;
};

export default function CreateTask() {
  useTitle("Task");

  const [adding, setAdding] = useState(false);

  const { user } = useGlobalState();
  const { report } = useHomeState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onAdd = useCallback(
    (values: INFO) => {
      setAdding(true);
      cAxios
        .post(`report/${report?.id}/task`, { task: values })
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(addTask(res.data.body));
            navigate("/home");
            dispatch(
              setAlert({
                type: "success",
                message: "Task addition success",
                description: `"${res.data.body.name}" has been successfully added to report!`,
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Task addition failed",
                description: res.data.body || res.data.message,
              })
            );
          }
        })
        .finally(() => {
          setAdding(false);
        });
    },
    [dispatch, navigate, report]
  );

  if (user?.employee && !report) {
    return <Navigate to={"/home/report/create"} />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <MdAdd className="mr-2" /> Task
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onAdd}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input task name!" }]}
        >
          <Input
            autoFocus
            name="name"
            placeholder="Task"
            className="font-mono"
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please add description for the task!" },
          ]}
        >
          <TextArea
            placeholder="Write a brief description about the task..."
            className="font-mono"
            spellCheck={false}
            name="description"
            rows={4}
          />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<MdAdd size={10} />}
            htmlType="submit"
            loading={adding}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
