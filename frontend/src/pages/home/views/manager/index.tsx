import { Menu, MenuProps } from "antd";
import { Fragment, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import EmployeesMenu from "./employees";
import ReportsMenu from "./reports";
import { MdSettings } from "react-icons/md";
import SettingsMenu from "../settings";

const ManagerMenu: MenuProps["items"] = [
  {
    label: "Reports",
    key: "reports",
    icon: <TbReportAnalytics size={12} />,
  },
  {
    label: "Employees",
    key: "employees",
    icon: <FaUsers size={12} />,
  },
  {
    label: "Settings",
    key: "settings",
    icon: <MdSettings size={12} />,
  },
];

export default function ManagerView() {
  const [menu, setMenu] = useState<string>("reports");
  return (
    <Fragment>
      <Menu
        items={ManagerMenu}
        selectedKeys={[menu]}
        mode="horizontal"
        className="mt-10"
        onClick={(e) => setMenu(e.key)}
      />
      {menu === "reports" ? (
        <ReportsMenu />
      ) : menu === "employees" ? (
        <EmployeesMenu />
      ) : (
        <SettingsMenu />
      )}
    </Fragment>
  );
}
