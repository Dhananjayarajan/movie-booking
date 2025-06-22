import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { GetShowById } from "../../apiCalls/theatres";
import moment from "moment";
import Button from "../../components/Button";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const BookShow = () => {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_KEY);

  const handleClick = async () => {
    try {
      if (selectedSeats.length === 0) {
        message.error("Please select at least one seat.");
        return;
      }

      const stripe = await stripePromise;

      const token = localStorage.getItem("token");
      const amount = show.ticketPrice * selectedSeats.length;

      // ✅ Save booking data before redirecting to Stripe
      localStorage.setItem("showId", show._id);
      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

      const res = await axios.post(
        "/api/create-checkout-session",
        {
          amount, // total price to charge
          showId: show._id,
          seats: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("📦 Full Axios response:", res);
      console.log("🎯 Stripe session response:", res.data);

      const session = res.data;

      if (!session.id) {
        message.error("❌ No session ID received from backend");
        return;
      }

      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.log("Stripe error:", error);
      message.error("Something went wrong!");
    }
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({ showId: params.id });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getSeats = () => {
    const columns = 10;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="flex gap-1 flex-col p-2 card">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {Array.from({ length: columns }).map((_, colIndex) => {
              const seatNumber = rowIndex * columns + colIndex + 1;
              if (seatNumber > totalSeats) return null;

              let seatClass = "seat";
              if (selectedSeats.includes(seatNumber)) {
                seatClass = seatClass + " selected-seat";
              }

              if (show.bookedSeats.includes(seatNumber)) {
                seatClass = seatClass + " booked-seat";
              }

              return (
                seatNumber <= totalSeats && (
                  <div
                    key={seatNumber}
                    className={seatClass}
                    onClick={() => {
                      if (show.bookedSeats.includes(seatNumber)) return; // Prevent selecting booked seats
                      if (selectedSeats.includes(seatNumber)) {
                        setSelectedSeats(
                          selectedSeats.filter((item) => item !== seatNumber)
                        );
                      } else {
                        setSelectedSeats([...selectedSeats, seatNumber]);
                      }
                    }}
                  >
                    <h1 className="text-sm">{seatNumber}</h1>
                  </div>
                )
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const onToken = async (token) => {
    console.log(token);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    show && (
      <div>
        <div className="flex justify-between card p-2 items-center">
          <div>
            <h1 className="text-xl">{show.theatre.name}</h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>
          <div>
            <h1 className="text-2xl uppercase">
              {show.movie.title}({show.movie.language})
            </h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>
          <div>
            <h1 className="text-xl">
              {moment(show.date).format("MMM Do yyyy")} - {""}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </h1>
          </div>
        </div>

        <div className="flex justify-center mt-2">{getSeats()}</div>

        <Button onClick={handleClick} title="Book Now" />
      </div>
    )
  );
};

export default BookShow;
