import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineLogin } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import getGreet from "../../lib/utils/getGreet";
import { useGlobalState } from "../../redux/slices/global";
import { ITask } from "../../types/models";
import { useTitle } from "../../hooks/useTitle";
import { v4 } from "uuid";

type Task = Pick<ITask, "id" | "name" | "description">;

export default function Home() {
  useTitle("Home");

  const [tasks, setTasks] = useState<Task[]>([
    { id: v4(), name: "", description: "" },
  ]);

  const { user } = useGlobalState();

  return (
    <div className="w-full flex flex-col my-16 lg:w-3/4 mx-auto">
      <span className="font-comfortaa text-3xl">
        {getGreet()}, <span className="font-raleway">{user?.name}</span>
      </span>
      <div className="flex justify-between items-center mt-12 mb-6">
        <span className="font-comfortaa">What are your tasks for today?</span>
        <Button
          type="primary"
          className="text-xs"
          icon={<MdAdd size={10} />}
          onClick={() =>
            setTasks([...tasks, { id: v4(), name: "", description: "" }])
          }
        >
          Add
        </Button>
      </div>

      <Form>
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
                  className="font-comfortaa"
                  autoFocus
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
                  className="font-comfortaa"
                  rows={4}
                />
              </Form.Item>
            </div>
            <Button
              danger
              type="primary"
              size="small"
              className="text-xs"
              style={{ display: tasks.length <= 1 ? "none" : "block" }}
              icon={<AiOutlineDelete size={12} />}
              onClick={() => setTasks(tasks.filter((t) => task.id !== t.id))}
            />
          </div>
        ))}
        <Button
          type="primary"
          className="text-xs w-20"
          icon={<AiOutlineLogin size={10} />}
          htmlType="submit"
        >
          Start
        </Button>
      </Form>
    </div>
  );
}
