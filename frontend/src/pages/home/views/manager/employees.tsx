import { Avatar, Button, List, Spin, Tag } from "antd";
import { Fragment, useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import { cAxios } from "../../../../lib/constants";
import { IUser } from "../../../../lib/types/models";

export default function EmployeesMenu() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<IUser[]>([]);

  useEffect(() => {
    cAxios
      .get(`user/employees`)
      .then((res) => {
        if (res.data.status === 200) {
          setEmployees(res.data.body);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Fragment>
      <div className="mx-10 mt-10 mb-5 flex items-center justify-between">
        <span className="font-comfortaa text-xl">Employees</span>
        <Button
          type="primary"
          className="text-xs mt-8"
          icon={<MdAdd size={10} />}
        >
          Add
        </Button>
      </div>
      <div className="m-10">
        {loading ? (
          <Spin size="small" className="absolute top-1/2 left-1/2" />
        ) : (
          <div>
            {employees.map((e) => (
              <div className="flex items-start" key={e.id}>
                <Avatar className="bg-green-300 text-green-700">
                  {e.name[0]}
                </Avatar>
                <div className="flex flex-col ml-4 font-comfortaa">
                  <span className="text-xs mb-2">{e.name}</span>
                  <Tag color="orange">{e.designation}</Tag>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}
