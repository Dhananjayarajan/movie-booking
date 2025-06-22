import React from "react";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../../components/PageTitle";
import TheatreList from "./TheatreList";
import TheatreForm from "./TheatreForm";
import Bookings from "./Bookings";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Bookings",
      children: <Bookings />,
    },
    {
      key: "2",
      label: "Theatres",
      children: <TheatreList />,
    },
  ];
  return (
    <div>
      <PageTitle title="Profile" />
      <Tabs items={items} />
    </div>
  );
};

export default Profile;
