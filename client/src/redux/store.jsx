import { configureStore } from "@reduxjs/toolkit";
import loadersReducer from "./loadersSlice";
import userReducer from "./usersSlice";

const store = configureStore({
  reducer: {
    loaders: loadersReducer,
    users: userReducer,
  },
});

export default store;
