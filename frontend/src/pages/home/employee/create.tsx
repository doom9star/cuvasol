import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  TimePicker,
  Typography,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { useTitle } from "../../../hooks/useTitle";
import { EmployeeType, GenderType, UserType } from "../../../lib/types/models";
import { setAlert, useGlobalState } from "../../../redux/slices/global";
import TextArea from "antd/es/input/TextArea";
import { cAxios } from "../../../lib/constants";
import { useDispatch } from "react-redux";

type INFO = {
  name: string;
  email: string;
  designation: string;
  location: string;
  phoneNumber: string;
  birthDate: Date;
  gender: GenderType;
  urls: string[];
  type: EmployeeType | UserType;
  subtype: EmployeeType;
  salary: number;
  officeHour: string[];
  joinedAt: string;
};

export default function CreateEmployee() {
  useTitle("Employee");

  const [adding, setAdding] = useState(false);

  const { user } = useGlobalState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm<INFO>();
  const typeWatch = Form.useWatch("type", form);

  const onAdd = useCallback(
    (values: INFO) => {
      const newValues: any = {
        name: values.name,
        email: values.email,
        designation: values.designation,
        type: values.type,
        subtype: values.subtype,
        location: values.location,
        phoneNumber: values.phoneNumber,
        birthDate: new Date((values.birthDate as any).$d).toISOString(),
        gender: values.gender,
        urls: values.urls,
      };

      if (values.type === UserType.EMPLOYEE) {
        newValues.employee = {
          salary: values.salary,
          startTime: new Date((values.officeHour[0] as any).$d).toISOString(),
          endTime: new Date((values.officeHour[1] as any).$d).toISOString(),
          joinedAt: new Date((values.joinedAt as any).$d).toISOString(),
        };
      }

      setAdding(true);
      cAxios
        .post("auth/register", newValues)
        .then((res) => {
          if (res.data.status === 200) {
            navigate("/home");
            dispatch(
              setAlert({
                type: "success",
                message: "Employee registration success",
                description: `EMPLOYEE "${newValues.name}" has been successfully registered!`,
              })
            );
          } else {
            dispatch(
              setAlert({
                type: "error",
                message: "Employee registration failed",
                description: res.data.body || res.data.message,
              })
            );
            window.scrollTo(0, 0);
          }
        })
        .finally(() => {
          setAdding(false);
        });
    },
    [dispatch, navigate]
  );

  const isAdmin = useMemo(() => {
    return user?.groups.findIndex((g) => g.name === UserType.ADMIN) !== -1;
  }, [user]);

  if (user?.employee) {
    return <Navigate to={"/home"} />;
  }

  return (
    <div className="w-full flex flex-col justify-center lg:w-1/2 mx-auto">
      <Typography.Title
        level={4}
        className="font-poppins flex items-center py-8"
      >
        <MdAdd className="mr-2" /> Employee
      </Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        labelAlign="left"
        onFinish={onAdd}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input employee name!" }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input employee email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Designation"
          name="designation"
          rules={[
            { required: true, message: "Please input employee designation!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          rules={[
            { required: true, message: "Please input employee location!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input employee phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Birth Date"
          name="birthDate"
          rules={[
            { required: true, message: "Please input employee birth date!" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please input employee gender!" }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={GenderType.MALE}>Male</Radio>
            <Radio value={GenderType.FEMALE}>Female</Radio>
            <Radio value={GenderType.OTHER}>Other</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="URLs"
          name="urls"
          rules={[
            { required: true, message: "Please input one employee URL!" },
          ]}
        >
          <TextArea spellCheck={false} rows={4} />
        </Form.Item>
        {isAdmin ? (
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input staff type!" }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value={UserType.MANAGER}>Manager</Radio>
              <Radio value={UserType.CLIENT}>Client</Radio>
              <Radio value={UserType.EMPLOYEE}>Employee</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input employee type!" }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value={EmployeeType.CONSULTANT}>Consultant</Radio>
              <Radio value={EmployeeType.INTERN}>Intern</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {typeWatch === UserType.EMPLOYEE && (
          <Form.Item
            label="Sub Type"
            name="subtype"
            rules={[{ required: true, message: "Please input employee type!" }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value={EmployeeType.CONSULTANT}>Consultant</Radio>
              <Radio value={EmployeeType.INTERN}>Intern</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: "Please input employee salary!" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Office Hours"
          name="officeHour"
          rules={[
            { required: true, message: "Please input employee office hours!" },
          ]}
        >
          <TimePicker.RangePicker showSecond={false} />
        </Form.Item>
        <Form.Item
          label="Joining Date"
          name="joinedAt"
          rules={[
            { required: true, message: "Please input employee joining date!" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            className="text-xs ml-4"
            icon={<MdAdd size={10} />}
            htmlType="submit"
            loading={adding}
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
