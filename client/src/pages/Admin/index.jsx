import React from "react";
import PageTitle from "../../components/PageTitle";
import { Tabs } from "antd";
import MoviesList from "./MoviesList";
import TheatresList from "./TheatresList";

const Admin = () => {
  const items = [
    {
      key: "1",
      label: "Movies",
      children: <MoviesList />,
    },
    {
      key: "2",
      label: "Theatres",
      children: <TheatresList />,
    },
  ];
  return (
    <div>
      <PageTitle title="Admin" />
      <Tabs items={items} />
    </div>
  );
};

export default Admin;
