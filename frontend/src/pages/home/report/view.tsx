import {
  Button,
  Form,
  Radio,
  Spin,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { AnyObject } from "antd/es/_util/type";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AiOutlineCalendar,
  AiOutlineLogin,
  AiOutlineSend,
} from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useDispatch } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { cAxios } from "../../../lib/constants";
import { IReport, ReportStatus, UserType } from "../../../lib/types/models";
import { setAlert, useGlobalState } from "../../../redux/slices/global";

type INFO = {
  status: ReportStatus;
};

type Props = {
  editable: boolean;
};

export default function ViewReport({ editable }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState<IReport | null>(null);

  const { user } = useGlobalState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();

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

  const onSave = useCallback(
    (values: INFO) => {
      setSaving(true);
      cAxios
        .put(`report/${params.rid}/status`, values)
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/home");
            dispatch(
              setAlert({
                type: "success",
                message: "Report updation success",
                description: `Report has been successfully updated.`,
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Report updation failed",
                description: res.data.body || res.data.message,
              })
            );
            window.scrollTo(0, 0);
          }
        })
        .finally(() => {
          setSaving(false);
        });
    },
    [dispatch, params.rid, navigate]
  );

  useEffect(() => {
    cAxios
      .get(`report/${params.rid}`)
      .then((res) => {
        if (res.data.status === 200) {
          setReport(res.data.body);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.rid]);

  if (loading) {
    return <Spin size="large" className="absolute top-1/2 left-1/2" />;
  }

  if (
    user?.groups.findIndex((g) => g.name === UserType.MANAGER) === -1 ||
    !report
  ) {
    return <Navigate to={"/home"} />;
  }

  if (
    pathname.split("/").slice(-1)[0] === "edit" &&
    report.status !== ReportStatus.PENDING
  ) {
    return <Navigate to={"/home"} />;
  }

  return (
    <div className="w-full flex flex-col lg:w-3/4 mx-auto">
      <div
        className={
          "w-full font-comfortaa flex flex-col my-10 px-8 pb-8 border border-solid border-gray-200 shadow-lg"
        }
      >
        <Typography.Title
          level={4}
          className="font-comfortaa self-center flex items-center py-4"
        >
          <HiOutlineDocumentReport className="mr-2" /> Report
        </Typography.Title>
        <div className="mb-8">
          <div className="flex items-center text-xs mb-2">
            <AiOutlineCalendar size={12} className="mr-2" />
            <span>{new Date(report.submittedAt!).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mb-16">
          <div className="flex items-center text-xs mb-2">
            <FaUserTie size={12} className="mr-2" />{" "}
            <span>{report.user.name}</span>
          </div>
          <Tag color="orange" className="ml-4 mb-2">
            {report.user.designation}
          </Tag>
          <div className="flex items-center text-xs ml-4">
            <span>
              (
              {new Date(report.user.employee!.startTime).toLocaleTimeString(
                "en",
                {
                  timeStyle: "short",
                }
              )}
            </span>
            <span className="mx-2">-</span>
            <span>
              {new Date(report.user.employee!.endTime).toLocaleTimeString(
                "en",
                {
                  timeStyle: "short",
                }
              )}
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
          <div className="flex items-center text-xs mb-2">
            <AiOutlineSend className="mr-2" size={12} />
            <span>
              {new Date(report.submittedAt!).toLocaleTimeString("en", {
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
        <p className="text-xs whitespace-pre-line mb-16">{report.summary}</p>
        {editable ? (
          <Form onFinish={onSave}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                { required: true, message: "Please input report status!" },
              ]}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio value={ReportStatus.APPROVED}>Approved</Radio>
                <Radio value={ReportStatus.REJECTED}>Rejected</Radio>
              </Radio.Group>
            </Form.Item>
            <Button
              type="primary"
              className="text-xs mt-8"
              icon={<BsSendFill size={10} />}
              htmlType="submit"
              loading={saving}
            >
              Submit
            </Button>
          </Form>
        ) : (
          <div>
            {report.status === ReportStatus.APPROVED ? (
              <Tag color="#008000">Approved</Tag>
            ) : (
              <Tag color="#FF0000">Rejected</Tag>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
