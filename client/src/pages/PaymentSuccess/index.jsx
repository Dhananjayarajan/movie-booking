// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
// import { BookShowTickets } from "../../apiCalls/booking";
// import { axiosInstance } from "../../apiCalls/index";
// import { message } from "antd";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.users);

//   const book = async (transactionId) => {
//     console.log("📦 Booking payload preparing...");
//     const showId = localStorage.getItem("showId");
//     const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
//     console.log("✅ showId:", showId);
//     console.log("✅ selectedSeats:", selectedSeats);
//     console.log("✅ transactionId:", transactionId);
//     console.log("✅ userId:", user?._id);

//     try {
//       dispatch(ShowLoading());

//       const response = await BookShowTickets({
//         show: showId,
//         seats: selectedSeats,
//         transactionId,
//         user: user._id,
//       });

//       dispatch(HideLoading());

//       if (response.success) {
//         console.log("🎉 Booking successful!");
//         message.success("🎟️ Tickets booked successfully!");

//         localStorage.removeItem("showId");
//         localStorage.removeItem("selectedSeats");

//         setTimeout(() => {
//           console.log("🔁 Redirecting to /profile");
//           navigate("/profile");
//         }, 3000);
//       } else {
//         console.error("❌ Booking failed:", response.message);
//         message.error(response.message || "Booking failed");
//         navigate("/");
//       }
//     } catch (error) {
//       dispatch(HideLoading());
//       console.error("🚨 Booking error:", error.message);
//       message.error(error.message || "Something went wrong");
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     const confirmBooking = async () => {
//       try {
//         console.log("🕵️ Extracting session_id from URL...");
//         const sessionId = new URLSearchParams(window.location.search).get(
//           "session_id"
//         );

//         if (!sessionId) {
//           console.error("❌ No session_id found in URL");
//           return;
//         }

//         console.log("✅ session_id:", sessionId);
//         dispatch(ShowLoading());

//         console.log("🔗 Verifying session with backend...");

//         const sessionRes = await axiosInstance.get(
//           `/api/stripe/session/${sessionId}`
//         );

//         console.log("✅ session response full:", sessionRes);

//         const transactionId = sessionRes?.data?.payment_intent;

//         if (!transactionId) {
//           console.error("❌ payment_intent missing in sessionRes.data");
//           console.log("❓ sessionRes.data keys:", Object.keys(sessionRes.data));
//         }

//         dispatch(HideLoading());

//         if (transactionId) {
//           console.log("✅ transactionId:", transactionId);
//           await book(transactionId);
//         } else {
//           message.error("Failed to confirm payment.");
//           navigate("/");
//         }
//       } catch (err) {
//         dispatch(HideLoading());
//         console.error("🚨 Error confirming payment:", err);
//         console.log("🪵 err.response:", err?.response?.data);
//         message.error("Error confirming payment.");
//         navigate("/");
//       }
//     };

//     confirmBooking();
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center">
//       <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
//       <p className="mt-2 text-gray-600">Processing your booking...</p>
//     </div>
//   );
// };

// export default PaymentSuccess;

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
    console.log("📦 Booking payload preparing...");
    const showId = localStorage.getItem("showId");
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
    console.log("✅ showId:", showId);
    console.log("✅ selectedSeats:", selectedSeats);
    console.log("✅ transactionId:", transactionId);
    console.log("✅ userId:", user?._id);

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
        console.log("🎉 Booking successful:", response.data);
        message.success("🎟️ Tickets booked successfully!");

        // Cleanup
        localStorage.removeItem("showId");
        localStorage.removeItem("selectedSeats");

        setTimeout(() => {
          console.log("🔁 Redirecting to /profile...");
          navigate("/profile");
        }, 3000);
      } else {
        console.error("❌ Booking failed:", response.message);
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
        console.log("🕵️ Extracting session_id from URL...");
        const sessionId = new URLSearchParams(window.location.search).get(
          "session_id"
        );

        if (!sessionId) {
          console.error("❌ No session_id found in URL");
          return;
        }

        console.log("✅ session_id found:", sessionId);
        dispatch(ShowLoading());

        console.log("🔗 Calling backend to retrieve session info...");
        const sessionRes = await axiosInstance.get(
          `/api/stripe/session/${sessionId}`
        );

        console.log("📦 Stripe session response full:", sessionRes);

        const transactionId = sessionRes?.data?.payment_intent;

        if (!transactionId) {
          console.error("❌ payment_intent missing in sessionRes.data");
          console.log("🪵 sessionRes.data keys:", Object.keys(sessionRes.data));
        }

        dispatch(HideLoading());

        if (transactionId) {
          console.log("✅ transactionId:", transactionId);
          await book(transactionId);
        } else {
          message.error("Payment succeeded, but could not confirm session.");
          navigate("/");
        }
      } catch (err) {
        dispatch(HideLoading());
        console.error("🚨 Error during payment confirmation:", err);
        console.log("🪵 err.response:", err?.response?.data);
        message.error("Error confirming payment.");
        navigate("/");
      }
    };

    confirmBooking();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Payment Successful!
      </h1>
      <p className="mt-2 text-gray-600">Processing your booking...</p>
    </div>
  );
};

export default PaymentSuccess;
