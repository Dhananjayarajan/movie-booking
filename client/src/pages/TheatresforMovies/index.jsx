import React, { useEffect, useState } from "react";

import { Col, Divider, Row, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies, getMovieById } from "../../apiCalls/movies";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getAllTheatresByMovie } from "../../apiCalls/theatres";

const TheatresForMovie = () => {
  const tempDate = new URLSearchParams(window.location.search).get("date");

  const [date, setDate] = useState(tempDate || moment().format("YYYY-MM-DD"));

  const dispatch = useDispatch();
  const [movie, setMovie] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getTheatres();
  }, [date]);

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresByMovie({ date, movie: params.id });
      console.log("API Response:", response);

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

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
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
    movie && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl uppercase ">
              {movie.title} ({movie.language})
            </h1>
            <h1 className="text-md">Duration : {movie.duration} mins</h1>
            <h1 className="text-md">
              Release Date : {moment(movie.releaseDate).format("MMM Do yyyy")}
            </h1>
            <h1 className="text-md">Genre : {movie.genre}</h1>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-md"> Select Date </h1>
            <input
              type="date"
              min={moment().format("YYYY-MM-DD")}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                navigate(`/movie/${params.id}?date=${e.target.value}`);
              }}
            />
          </div>
        </div>
        <hr />
        <div className="mt-1">
          <h1 className="text-xl uppercase">Theatres</h1>
        </div>
        <div className="mt-1 flex flex-col gap-1">
          {theatres.map((theatre) => {
            return (
              <div className="card p-2">
                <h1 className="text-md uppercase">{theatre.name}</h1>
                <h1 className="text-sm">Address : {theatre.address}</h1>
                <div className="divider"></div>
                <div className="flex gap-2">
                  {theatre.shows
                    .sort((a, b) => {
                      return (
                        moment(a.time, "HH : mm") - moment(b.time, "HH : mm")
                      );
                    })
                    .map((show) => {
                      return (
                        <div
                          className="card p-1 cursor-pointer"
                          onClick={() => {
                            navigate(`/book-show/${show._id}`);
                          }}
                        >
                          <h1 className="text-sm">
                            {moment(show.time, "HH:mm").format("hh:mm A")}
                          </h1>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default TheatresForMovie;
