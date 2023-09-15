import { useCallback, useEffect, useState } from "react";
import { ITask } from "../../../types/models";
import { v4 } from "uuid";
import { setAlert, useGlobalState } from "../../../redux/slices/global";
import { useDispatch } from "react-redux";
import { cAxios } from "../../../lib/constants";
import { setReport } from "../../../redux/slices/home";
import getGreet from "../../../lib/utils/getGreet";
import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  AiOutlineDelete,
  AiOutlineDown,
  AiOutlineLogin,
  AiOutlineUp,
} from "react-icons/ai";

type Task = Pick<ITask, "id" | "name" | "description">;

export default function CreateReport() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: v4(), name: "", description: "" },
  ]);
  const [starting, setStarting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const { user } = useGlobalState();
  const dispatch = useDispatch();

  const onChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      task: Task
    ) => {
      setTasks((old) => {
        const _tasks = [...old];
        const tidx = _tasks.findIndex((t) => t.id === task.id);
        if (tidx !== -1) {
          _tasks[tidx] = { ..._tasks[tidx], [e.target.name]: e.target.value };
        }
        return _tasks;
      });
    },
    []
  );

  const addTask = useCallback((task: Task, loc: "up" | "down") => {
    setTasks((old) => {
      const tidx = old.findIndex((t) => t.id === task.id);
      if (tidx !== -1) {
        if (loc === "up") {
          return [
            ...old.slice(0, tidx),
            { id: v4(), name: "", description: "" },
            ...old.slice(tidx),
          ];
        } else {
          return [
            ...old.slice(0, tidx + 1),
            { id: v4(), name: "", description: "" },
            ...old.slice(tidx + 1),
          ];
        }
      }
      return old;
    });
  }, []);

  const onStart = useCallback(() => {
    setStarting(true);
    cAxios
      .post("report/", { tasks })
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(setReport(res.data.body));
        } else {
          dispatch(
            setAlert({
              type: "error",
              message: "Account login failed",
              description: res.data.body || res.data.message,
            })
          );
        }
      })
      .finally(() => {
        setStarting(false);
      });
  }, [tasks, dispatch]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setDate(new Date());
    }, 1000 * 60);
    return () => clearInterval(intervalID);
  }, []);
  return (
    <div className="w-full flex flex-col my-16 lg:w-3/4 mx-auto">
      <span className="font-comfortaa text-3xl">
        {getGreet()}, <span className="font-raleway">{user?.name}</span>
      </span>
      <span className="mt-2">
        {date.toLocaleDateString()} &nbsp;|&nbsp;{" "}
        {date.toLocaleTimeString("en", { timeStyle: "short" })}
      </span>
      <div className="flex justify-between items-center mt-12 mb-6">
        <span className="font-comfortaa text-lg flex items-center">
          What are your tasks for today?
        </span>
      </div>
      <Form onFinish={onStart}>
        {tasks.map((task, idx) => (
          <div
            key={task.id}
            className="flex items-center justify-start mb-4 w-full"
          >
            <span className="font-comfortaa">{idx + 1}.</span>
            <div className="mx-4 w-3/4">
              <Form.Item
                name={`${task.id}-name`}
                rules={[{ required: true, message: "Please input task name!" }]}
                className="mb-2"
              >
                <Input
                  placeholder="Task"
                  autoFocus
                  className="font-mono"
                  name="name"
                  value={task.name}
                  onChange={(e) => onChange(e, task)}
                />
              </Form.Item>
              <Form.Item
                name={`${task.id}-description`}
                rules={[
                  { required: true, message: "Please input task description!" },
                ]}
              >
                <TextArea
                  placeholder="Write a brief description about the task..."
                  className="font-mono"
                  onChange={(e) => onChange(e, task)}
                  spellCheck={false}
                  name="description"
                  value={task.description}
                  rows={4}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col">
              <Button
                type="primary"
                size="small"
                className="mb-2"
                icon={
                  <AiOutlineUp size={12} onClick={() => addTask(task, "up")} />
                }
              />
              <Button
                danger
                size="small"
                type="primary"
                className="text-xs mb-2"
                style={{ display: tasks.length <= 1 ? "none" : "block" }}
                icon={<AiOutlineDelete size={12} />}
                onClick={() => setTasks(tasks.filter((t) => task.id !== t.id))}
              />
              <Button
                type="primary"
                size="small"
                icon={
                  <AiOutlineDown
                    size={12}
                    onClick={() => addTask(task, "down")}
                  />
                }
              />
            </div>
          </div>
        ))}
        <Button
          type="primary"
          className="text-xs w-20 font-bold"
          icon={<AiOutlineLogin size={10} />}
          htmlType="submit"
          loading={starting}
        >
          Start
        </Button>
      </Form>
    </div>
  );
}