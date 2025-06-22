import { axiosInstance } from "../apiCalls/index";

// Register a new user
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (error) {
    return error.response
      ? error.response.data
      : { success: false, message: "An error occurred" };
  }
};

// Login user
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response
      ? error.response.data
      : { success: false, message: "An error occurred" };
  }
};

export const GetCurrentUser = async () => {
  console.log("GetCurrentUser() function triggered...");
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in GetCurrentUser:", error);
    return error;
  }
};
