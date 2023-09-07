import { Button } from "antd";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";

export default function Index() {
  useTitle("Home");
  const navigate = useNavigate();
  return (
    <div className="w-full h-full">
      <Button
        type="primary"
        className="text-xs absolute top-8 right-8 z-10"
        icon={<FiLogIn size={10} />}
        onClick={() => navigate("/auth/login")}
      >
        Login
      </Button>
      <div className="h-full flex justify-end">
        <img
          src="/banner.jpg"
          alt="banner"
          className="w-1/2 h-full object-cover"
        />
        <div className="w-1/2 h-full absolute bg-black opacity-10 z-0" />
      </div>
      <div className="absolute top-4 left-20">
        <img
          src="/logo.png"
          alt="logo"
          className="w-32 h-16 object-contain rounded-full mb-8"
        />
        <p className="font-raleway text-4xl font-bold m-0 mb-2">
          INTERVIEW PREPARATION
        </p>
        <p className="font-comfortaa text-2xl font-bold m-0 mb-4">
          Kickstart your career
        </p>
        <div className="font-comfortaa flex flex-col items-center justify-between text-lg font-bold p-10">
          <div className="flex justify-between w-full">
            <span className="m-2 h-full p-4 rounded-xl border border-red-500 bg-red-100 text-red-500 border-solid">
              Video Training
            </span>
            <span className="my-8 h-full p-4 rounded-xl border border-green-500 bg-green-100 text-green-500 border-solid">
              Metaverse
            </span>
          </div>
          <span className="m-2 h-full p-4 rounded-xl border border-blue-500 bg-blue-100 text-blue-500 border-solid">
            Communication
          </span>
          <div className="flex justify-between w-full">
            <span className="my-16 h-full p-4 rounded-xl border border-purple-500 bg-purple-100 text-purple-500 border-solid">
              Artificial Intelligence
            </span>
            <span className="m-8 h-full p-4 rounded-xl border border-orange-500 bg-orange-100 text-orange-500 border-solid">
              Automation
            </span>
          </div>
        </div>
      </div>
      <div className="p-10">
        <p className="font-comfortaa text-xl flex flex-col text-center my-32">
          <span className="font-raleway">JOIN US!</span>
          <span>
            to experience great success in interview preparation or hiring
            candidates from all across the world.
          </span>
          <div className="mt-8 flex justify-center">
            <img src="/android.png" alt="android" className="mr-2" />
            <img src="/ios.png" alt="ios" />
          </div>
        </p>
        <div className="flex items-center">
          <img
            src="/about-banner-2.jpg"
            alt="about-banner-2"
            className="w-1/2 rounded-lg"
          />
          <p className="text-lg w-1/2 p-8 font-comfortaa">
            <span className="text-2xl font-raleway">CUVASOL</span> is a
            full-service video interviewing company driven by an internal team
            of talented professionals from fortune 500 companies whose combined
            breadth of experience includes all areas of education and hiring
            development.
          </p>
        </div>
        <div className="flex items-center my-20">
          <p className="text-lg w-1/2 p-8 font-comfortaa">
            We are proud of our executive team that consists of teachers,
            technologists and mothers who have provided wisdom in building a
            platform to help students gain that edge during interview process,
            and also support companies that are looking to hire exceptional
            candidates in an efficient manner.
          </p>
          <img
            src="/about-banner-1.png"
            alt="about-banner-1"
            className="w-1/2 rounded-lg"
          />
        </div>
      </div>
      <div className="pb-10 text-center font-comfortaa">
        © 2023 Cuvasol Technologies, Pvt Ltd. Privacy Policy | Terms and
        Conditions
      </div>
    </div>
  );
}
