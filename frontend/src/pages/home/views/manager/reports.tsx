import { Button, DatePicker, Spin, Table, TableProps, Tag } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { Fragment, useEffect, useMemo, useState } from "react";
import { IReport, ReportStatus } from "../../../../lib/types/models";
import { AiOutlineEdit } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import { cAxios } from "../../../../lib/constants";
import { useNavigate } from "react-router-dom";

export default function ReportsMenu() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string | null>(
    new Date().toISOString().split("T")[0]
  );
  const [reports, setReports] = useState<IReport[]>([]);

  const navigate = useNavigate();

  const reportCols: TableProps<AnyObject>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Employee", dataIndex: "employee", key: "employee" },
    { title: "Submitted", dataIndex: "submitted", key: "submitted" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return status === ReportStatus.PENDING ? (
          <Tag color="orange">PENDING</Tag>
        ) : status === ReportStatus.APPROVED ? (
          <Tag color="green">APPROVED</Tag>
        ) : (
          <Tag color="red">REJECTED</Tag>
        );
      },
    },
    {
      dataIndex: "edit",
      key: "edit",
      render: (_, { edit, status }) => {
        return (
          <Fragment>
            {status === ReportStatus.PENDING && (
              <Button
                ghost
                type="primary"
                size="small"
                className="mr-2"
                icon={<AiOutlineEdit size={12} />}
                onClick={() => navigate(`/home/report/${edit}/edit`)}
              />
            )}
            <Button
              type="primary"
              size="small"
              icon={<IoEyeSharp size={12} />}
              onClick={() => navigate(`/home/report/${edit}/view`)}
            />
          </Fragment>
        );
      },
    },
  ];

  const reportData = useMemo(() => {
    return reports.map((r, idx) => ({
      key: r.id,
      id: idx + 1,
      employee: r.user.name,
      submitted: new Date(r.submittedAt as string).toLocaleTimeString("en", {
        timeStyle: "short",
      }),
      status: r.status,
      edit: r.id,
    }));
  }, [reports]);

  useEffect(() => {
    setLoading(true);
    cAxios
      .get(`report/all/${date ? date : ""}`)
      .then((res) => {
        if (res.data.status === 200) {
          setReports(res.data.body);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  return (
    <Fragment>
      <div className="mx-10 mt-10 mb-5 flex items-center justify-between">
        <span className="font-comfortaa text-xl">
          Reports <span className="text-xs">({date})</span>
        </span>
        <DatePicker
          showToday
          disabledDate={(d) => d.isAfter(new Date().getTime())}
          onChange={(_, dateString) => setDate(dateString)}
        />
      </div>
      <div className="m-10">
        {loading ? (
          <Spin size="small" className="absolute top-1/2 left-1/2" />
        ) : (
          <Table
            columns={reportCols}
            dataSource={reportData}
            pagination={false}
          />
        )}
      </div>
    </Fragment>
  );
}
