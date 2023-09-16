import { Button, Form, Table, TableProps, Tag, Typography } from "antd";
import { AnyObject } from "antd/es/_util/type";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineLogin } from "react-icons/ai";
import { BsSendFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Navigate } from "react-router-dom";
import {
  setAlert,
  setUser,
  useGlobalState,
} from "../../../redux/slices/global";
import { useHomeState } from "../../../redux/slices/home";
import { cAxios } from "../../../lib/constants";
import { useDispatch } from "react-redux";
import { BiTask } from "react-icons/bi";

type INFO = {
  summary: string;
};

export default function SubmitReport() {
  const [submitting, setSubmitting] = useState(false);

  const { user } = useGlobalState();
  const { report } = useHomeState();
  const dispatch = useDispatch();

  const taskCols: TableProps<AnyObject>["columns"] = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { description }) => (
        <span className="whitespace-pre">{description}</span>
      ),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (_, { completed }) => {
        return completed ? (
          <Tag color="green">true</Tag>
        ) : (
          <Tag color="red">false</Tag>
        );
      },
    },
  ];

  const taskData = useMemo(() => {
    if (report?.tasks) {
      return report.tasks.map((t, idx) => ({
        key: t.id,
        name: t.name,
        description: t.description,
        completed: t.completed,
      }));
    }
    return [];
  }, [report]);

  const onSubmit = useCallback(
    (values: INFO) => {
      setSubmitting(true);
      cAxios
        .put(`report/${report?.id}/submit`, values)
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(setUser(null));
            dispatch(
              setAlert({
                type: "success",
                message: "Report submission success",
                description: `Report has been successfully submitted for today!`,
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Report submission failed",
                description: res.data.body || res.data.message,
              })
            );
            window.scrollTo(0, 0);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [dispatch, report]
  );

  if (!user?.employee) {
    return <Navigate to={"/home"} />;
  }

  if (!report) {
    return <Navigate to={"/home/report/create"} />;
  }

  return (
    <div className="w-full flex flex-col lg:w-3/4 mx-auto">
      <div className="w-full font-comfortaa flex flex-col my-10 px-8 pb-8 border border-solid border-gray-200">
        <Typography.Title
          level={4}
          className="font-comfortaa self-center flex items-center py-4"
        >
          <HiOutlineDocumentReport className="mr-2" /> Report
        </Typography.Title>
        <div className="mb-8">
          <div className="flex items-center text-xs mb-2">
            <AiOutlineCalendar size={12} className="mr-2" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mb-16">
          <div className="flex items-center text-xs mb-2">
            <FaUserTie size={12} className="mr-2" /> <span>{user.name}</span>
          </div>
          <Tag color="orange" className="ml-4 mb-2">
            {user.designation}
          </Tag>
          <div className="flex items-center text-xs ml-4">
            <span>
              (
              {new Date(user.employee.startTime).toLocaleTimeString("en", {
                timeStyle: "short",
              })}
            </span>
            <span className="mx-2">-</span>
            <span>
              {new Date(user.employee.endTime).toLocaleTimeString("en", {
                timeStyle: "short",
              })}
              )
            </span>
          </div>
        </div>
        <div className="mb-16">
          <div className="flex items-center text-xs mb-2">
            <AiOutlineLogin className="mr-2" size={12} />
            <span>
              {new Date(report.createdAt).toLocaleTimeString("en", {
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="flex items-center text-xs mb-4">
            <BiTask className="mr-2" size={12} />
            <span>
              {report.tasks.reduce((p, c) => (c.completed ? p + 1 : p), 0)} /{" "}
              {report.tasks.length}
            </span>
          </div>
          <Table columns={taskCols} dataSource={taskData} pagination={false} />
        </div>
        <Form onFinish={onSubmit}>
          <Form.Item
            name="summary"
            rules={[
              {
                required: true,
                message: "Please add summary for the report!",
              },
            ]}
          >
            <TextArea
              placeholder="Write a summary about the report..."
              className="font-mono"
              spellCheck={false}
              name="summary"
              rows={8}
            />
          </Form.Item>
          <Button
            type="primary"
            className="text-xs"
            icon={<BsSendFill size={10} />}
            htmlType="submit"
            loading={submitting}
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
