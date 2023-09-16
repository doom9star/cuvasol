import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "../redux/slices/global";
import { Tag } from "antd";
import { GenderType } from "../lib/types/models";
import { BiMale, BiFemale, BiMaleFemale } from "react-icons/bi";

export default function Greet() {
  const [date, setDate] = useState<Date>(new Date());

  const { user } = useGlobalState();

  const greet = useMemo(() => {
    const hour = date.getHours();

    if (hour < 12) return "Good Morning";
    else if (hour < 18) return "Good Afternoon";
    else if (hour < 21) return "Good Evening";
    else return "Good Night";
  }, [date]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setDate(new Date());
    }, 1000 * 60);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center font-comfortaa text-3xl">
        <span>{greet}, </span>
        <span className="font-raleway mx-2">{user?.name}</span>{" "}
        <div className="flex items-center ml-auto">
          {user?.gender === GenderType.MALE ? (
            <BiMale size={20} style={{ color: "chocolate" }} />
          ) : user?.gender === GenderType.FEMALE ? (
            <BiFemale size={20} style={{ color: "chocolate" }} />
          ) : (
            <BiMaleFemale size={20} style={{ color: "chocolate" }} />
          )}
          <Tag color="orange" className="ml-2">
            {user?.designation}
          </Tag>
        </div>
      </div>
      <span className="mt-2">
        {date.toLocaleDateString()} &nbsp;|&nbsp;{" "}
        {date.toLocaleTimeString("en", { timeStyle: "short" })}
      </span>
    </div>
  );
}
