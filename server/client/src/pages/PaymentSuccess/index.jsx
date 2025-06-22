import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { BookShowTickets } from "../../apiCalls/booking";
import { axiosInstance } from "../../apiCalls/index";
import { message } from "antd";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const book = async (transactionId) => {
    const showId = localStorage.getItem("showId");
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

    try {
      dispatch(ShowLoading());

      const response = await BookShowTickets({
        show: showId,
        seats: selectedSeats,
        transactionId,
        user: user._id,
      });

      dispatch(HideLoading());

      if (response.success) {
        message.success("🎟️ Tickets booked successfully!");

        // Cleanup
        localStorage.removeItem("showId");
        localStorage.removeItem("selectedSeats");

        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } else {
        console.error(" Booking failed:", response.message);
        message.error(response.message || "Booking failed");
        navigate("/");
      }
    } catch (error) {
      dispatch(HideLoading());
      console.error("🚨 Booking error:", error.message);
      message.error(error.message || "Something went wrong");
      navigate("/");
    }
  };

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get(
          "session_id"
        );

        if (!sessionId) {
          console.error(" No session_id found");
          return;
        }

        const sessionRes = await axiosInstance.get(
          `/api/stripe/session/${sessionId}`
        );

        const transactionId = sessionRes?.data?.payment_intent;
        if (transactionId) {
          await book(transactionId);
        } else {
          console.error(" No transactionId in sessionRes");
        }
      } catch (err) {
        console.error(" Booking error in confirmBooking:", err);
      }
    };

    confirmBooking().catch((err) =>
      console.error(" Unhandled async error in confirmBooking:", err)
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">Processing your booking...</p>
    </div>
  );
};

export default PaymentSuccess;
