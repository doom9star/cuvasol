import { Button, Form, Input, Radio, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MdAdd, MdSave } from "react-icons/md";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { setAlert, useGlobalState } from "../../../../redux/slices/global";
import { setTask, useHomeState } from "../../../../redux/slices/home";
import { useCallback, useMemo, useState } from "react";
import { cAxios } from "../../../../lib/constants";
import { useTitle } from "../../../../hooks/useTitle";
import { useDispatch } from "react-redux";

type INFO = {
  name: string;
  description: string;
  completed: string;
};

export default function EditTask() {
  useTitle("Task");

  const [saving, setSaving] = useState(false);

  const { user } = useGlobalState();
  const { report } = useHomeState();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const task = useMemo(() => {
    if (report) {
      return report.tasks.find((t) => t.id === params.tid);
    }
    return null;
  }, [report, params]);

  const onSave = useCallback(
    (values: INFO) => {
      setSaving(true);
      cAxios
        .put(`report/task/${params.tid}`, {
          ...values,
          completed: values.completed === "true",
        })
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(setTask({ tid: params.tid as any, task: res.data.body }));
            navigate("/home");
            dispatch(
              setAlert({
                type: "success",
                message: "Task updation success",
                description: `"${res.data.body.name}" has been successfully updated!`,
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Task updation failed",
                description: res.data.body || res.data.message,
              })
            );
          }
        })
        .finally(() => {
          setSaving(false);
        });
    },
    [dispatch, navigate, params]
  );

  if (user?.employee && !report) {
    return <Navigate to={"/home/report/create"} />;
  }

  if (!task) {
    return <Navigate to={"/home"} />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <MdAdd className="mr-2" /> Task
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onSave}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input task name!" }]}
          initialValue={task.name}
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
          initialValue={task.description}
        >
          <TextArea
            placeholder="Write a brief description about the task..."
            className="font-mono"
            spellCheck={false}
            name="description"
            rows={4}
          />
        </Form.Item>
        <Form.Item
          label="Completed"
          name="completed"
          rules={[
            { required: true, message: "Please input completed or not!" },
          ]}
          initialValue={task.completed ? "true" : "false"}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={"true"}>True</Radio>
            <Radio value={"false"}>False</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<MdSave size={10} />}
            htmlType="submit"
            loading={saving}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
