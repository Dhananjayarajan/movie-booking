import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apiCalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      dispatch(HideLoading());

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      dispatch(setUser(null));
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    console.log("ProtectedRoute mounted");
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (token) {
      console.log("Calling getCurrentUser()...");
      getCurrentUser();
    } else {
      console.log("No token found → redirecting to login");
      navigate("/login");
    }
  }, []);

  if (checkingAuth) {
    return null; // or return a spinner while checking
  }

  if (!user) {
    return null; // will redirect in useEffect
  }

  return (
    <div className="layout p-1">
      <div className="bg-primary flex justify-between p-2">
        <div>
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Book My Ticket
          </h1>
        </div>
        <div className="bg-white p-1 flex gap-1">
          <i className="ri-shield-user-line text-primary"></i>
          <h1
            className="text-sm underline"
            onClick={() => {
              if (user.isAdmin) {
                navigate("/admin");
              } else {
                navigate("/profile");
              }
            }}
          >
            {user.name}
          </h1>
          <i
            className="ri-logout-circle-r-line ml-2"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          ></i>
        </div>
      </div>
      <div className="mt-1 p-1 content">{children}</div>
    </div>
  );
}

export default ProtectedRoute;
