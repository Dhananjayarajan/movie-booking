import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import TheatreForm from "./TheatreForm";
import {
  DeleteTheatre,
  GetAllTheatres,
  getAllTheatresByOwner,
} from "../../apiCalls/theatres";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { Table, message } from "antd";
import Shows from "./Shows";

const TheatreList = () => {
  const { user } = useSelector((state) => state.users);
  const [showTheatreForm, setShowTheatreForm] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);
  const [openShowsModal, setOpenShowModal] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresByOwner({
        owner: user._id,
      });
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({ theatreId: id });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        if (text) {
          return "Approved";
        } else {
          return "Pending/Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            <i
              className="ri-edit-line"
              onClick={() => {
                setSelectedTheatre(record);
                setFormType("edit");
                setShowTheatreForm(true);
              }}
            ></i>
            <i
              className="ri-delete-bin-line"
              onClick={() => handleDelete(record._id)}
            ></i>
            {record.isActive && (
              <span
                className="underline"
                onClick={() => {
                  setOpenShowModal(true);
                  setSelectedTheatre(record);
                }}
              >
                Shows
              </span>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          variant="outlined"
          title="Add theatre"
          onClick={() => {
            setFormType("add");
            setShowTheatreForm(true);
          }}
        />
      </div>
      <Table columns={columns} dataSource={theatres} />

      {showTheatreForm && (
        <TheatreForm
          showTheatreForm={showTheatreForm}
          setShowTheatreForm={setShowTheatreForm}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}
      {openShowsModal && (
        <Shows
          openShowsModal={openShowsModal}
          setOpenShowModal={setOpenShowModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  );
};

export default TheatreList;
