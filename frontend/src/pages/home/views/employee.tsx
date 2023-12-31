import { Button, Collapse, Modal, Table, TableProps, Tag } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { Fragment, useCallback, useMemo, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSend } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cAxios } from "../../../lib/constants";
import { setAlert } from "../../../redux/slices/global";
import { deleteTask, useHomeState } from "../../../redux/slices/home";

export default function EmployeeView() {
  const [deleteTaskID, setDeleteTaskID] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { report } = useHomeState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const taskCols: TableProps<AnyObject>["columns"] = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Added", dataIndex: "added", key: "added" },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      render: (_, { updated }) => {
        return updated === "-" ? (
          <Tag color="warning">UNMODIFIED</Tag>
        ) : (
          updated
        );
      },
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
    {
      dataIndex: "edit",
      key: "edit",
      render: (_, { edit }) => {
        return (
          <div>
            <Button
              type="primary"
              className="mr-2"
              size="small"
              icon={<AiOutlineEdit size={12} />}
              onClick={() =>
                navigate(`/home/report/task/${edit.split("|-|-|")[0]}/edit`)
              }
            />
            <Button
              danger
              type="primary"
              size="small"
              icon={<AiOutlineDelete size={12} />}
              onClick={() => setDeleteTaskID(edit)}
            />
          </div>
        );
      },
    },
  ];

  const taskData = useMemo(() => {
    if (report?.tasks) {
      return report.tasks.map((t, idx) => ({
        key: t.id,
        id: idx + 1,
        name: t.name,
        added: new Date(t.createdAt).toLocaleTimeString("en", {
          timeStyle: "short",
        }),
        updated:
          new Date(t.createdAt).toISOString().split("T")[1].slice(0, 5) ===
          new Date(t.updatedAt).toISOString().split("T")[1].slice(0, 5)
            ? "-"
            : new Date(t.updatedAt).toLocaleTimeString("en", {
                timeStyle: "short",
              }),
        completed: t.completed,
        edit: `${t.id}|-|-|${t.name}`,
      }));
    }
    return [];
  }, [report]);

  const onDelete = useCallback(() => {
    const [tid, tname] = deleteTaskID!.split("|-|-|");
    setDeleting(true);
    cAxios
      .delete(`report/task/${tid}`)
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(deleteTask(tid));
          setDeleteTaskID(null);
          dispatch(
            setAlert({
              type: "success",
              message: "Task deletion success",
              description: `"${tname}" has been successfully deleted from report!`,
            })
          );
        } else {
          dispatch(
            setAlert({
              type: "error",
              message: "Task deletion failed",
              description: res.data.body || res.data.message,
            })
          );
        }
      })
      .finally(() => {
        setDeleting(false);
      });
  }, [deleteTaskID, dispatch]);

  return (
    <Fragment>
      <Modal
        title="Task deletion"
        open={!!deleteTaskID}
        onCancel={() => setDeleteTaskID(null)}
        confirmLoading={deleting}
        onOk={onDelete}
      >
        <p>Do you want to delete "{deleteTaskID?.split("|-|-|")[1]}"?</p>
      </Modal>
      <Collapse
        className="mt-12 font-comfortaa"
        items={[
          {
            label: "Instructions",
            children: (
              <ul className="text-xs space-y-2">
                <li>
                  Employee has to login 1Hr before EH, where EH = Ending hour.
                </li>
                <li>
                  Employee will be logged out immediately after successful
                  report submission.
                </li>
                <li>
                  Employee will be logged out automatically, if the EH + 1Hr is
                  exceeded.
                </li>
                <li>Report must have atleast one task for submission.</li>
                <li>Report must be submitted before EH + 1.</li>
                <li>Any reports beyond EH + 1Hr will be dismissed.</li>
              </ul>
            ),
          },
        ]}
      />
      <div className="mt-12 flex items-center">
        <span className="font-comfortaa text-2xl">Report </span>
        <span className="text-xs ml-2">
          (
          {new Date(report!.createdAt).toLocaleTimeString("en", {
            timeStyle: "short",
          })}
          )
        </span>
        <div className="ml-auto">
          <Button
            ghost
            type="primary"
            size="small"
            className="mr-2"
            icon={<MdAdd size={12} />}
            onClick={() => navigate(`/home/report/task/create`)}
          />
          <Button
            type="primary"
            size="small"
            disabled={(report?.tasks.length || 0) <= 0}
            icon={<AiOutlineSend size={12} />}
            onClick={() => navigate(`/home/report/submit`)}
          />
        </div>
      </div>
      <div className="m-10">
        <Table columns={taskCols} dataSource={taskData} pagination={false} />
      </div>
    </Fragment>
  );
}
