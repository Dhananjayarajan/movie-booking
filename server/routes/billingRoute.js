const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

// router.post("/create-checkout-session", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user)
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });

//     const { amount, showId, seats } = req.body;

//     if (!amount || !showId || !seats?.length) {
//       return res.status(400).send({
//         success: false,
//         message: "Missing amount, showId, or seats",
//       });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Movie Tickets for Show`,
//             },
//             unit_amount: amount * 100, // Stripe uses cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       customer_email: user.email,
//       success_url: `${process.env.REDIRECT_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`, // ✅ Fix here
//       cancel_url: `${process.env.REDIRECT_DOMAIN}/cancel`,
//       metadata: {
//         userId: user._id.toString(),
//         showId: showId.toString(),
//         seats: seats.join(","), // e.g., "5,6,7"
//       },
//     });

//     res.send({ id: session.id });
//   } catch (error) {
//     console.error("Stripe session creation error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Session creation failed",
//       error: error.message,
//     });
//   }
// });

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log("🔐 Authenticated user ID:", req.userId);
    console.log("📨 User found:", user?.email);

    const { amount, showId, seats } = req.body;
    console.log("🎟️ Booking payload:", { amount, showId, seats });

    if (!amount || !showId || !seats?.length) {
      console.log("❌ Missing required booking data");
      return res.status(400).send({
        success: false,
        message: "Missing amount, showId, or seats",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Movie Tickets for Show`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: user.email,
      success_url: `${process.env.REDIRECT_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REDIRECT_DOMAIN}/cancel`,
      metadata: {
        userId: user._id.toString(),
        showId: showId.toString(),
        seats: seats.join(","),
      },
    });

    console.log("✅ Stripe session created:", session.id);
    return res.send({ id: session.id });
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error.message);
    return res.status(500).send({
      success: false,
      message: "Session creation failed",
      error: error.message,
    });
  }
});

router.get("/stripe/session/:id", async (req, res) => {
  try {
    console.log("📥 GET /session/:id", req.params.id);

    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    console.log("✅ Stripe session retrieved:");
    console.log("🧾 id:", session.id);
    console.log("💳 payment_intent:", session.payment_intent);
    console.log("📦 metadata:", session.metadata);

    res.send(session); // session includes payment_intent
  } catch (err) {
    console.error("❌ Stripe session retrieval error:", err.message);
    res.status(500).send({
      success: false,
      message: "Stripe session retrieval failed",
      error: err.message,
    });
  }
});

module.exports = router;
