import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { Row, Table, message, Col } from "antd";
import { GetBookingsOfUser } from "../../apiCalls/booking";
import moment from "moment";

function Bookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      if (response.success) {
        console.log("📦 Bookings fetched:", response.data); // 👈 log here

        setBookings(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {bookings.map((booking) => {
          return (
            <Col span={12}>
              <div className="card p-2 flex justify-between uppercase">
                <div>
                  <h1 className="text-xl">
                    {booking.show.movie.title} ({booking.show.movie.language}){" "}
                  </h1>
                  <div className="divider"></div>
                  <h1 className="text-sm">
                    {booking.show.theatre.name} ({booking.show.theatre.address})
                  </h1>
                  <h1 className="text-sm">
                    Date & time :{" "}
                    {moment(booking.show.date).format("MMM Do YYYY")} -{" "}
                    {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                  </h1>
                  <h1 className="text-sm">
                    Seats : {booking.seats.join(", ")}
                  </h1>
                  <h1 className="text-sm">
                    Amount : ₹ {booking.show.ticketPrice * booking.seats.length}
                  </h1>
                  <h1 className="text-sm">Booking id : {booking._id}</h1>
                </div>
                <div>
                  <img
                    src={booking.show.movie.poster}
                    alt=""
                    height={100}
                    width={100}
                    className="br-1"
                  />
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Bookings;
