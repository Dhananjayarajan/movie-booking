import React, { useEffect, useState } from "react";

import { Col, Row, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apiCalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div>
      <input
        className="search-input"
        type="text"
        placeholder="Search for Movies"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Row gutter={[20]} className="mt-2">
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((movie) => {
            return (
              <Col span={6}>
                <div
                  key={movie._id}
                  className="card flex flex-col gap-1 cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    );
                  }}
                >
                  <img src={movie.poster} height={200} />
                  <div className="flex justify-center p-1">
                    <h1 className="text-md uppercase">{movie.title}</h1>
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default Home;
