const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { amount, showId, seats } = req.body;

    if (!amount || !showId || !seats?.length) {
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
      cancel_url: `${process.env.REDIRECT_DOMAIN}/`,
      metadata: {
        userId: user._id.toString(),
        showId: showId.toString(),
        seats: seats.join(","),
      },
    });
    return res.send({ id: session.id });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Session creation failed",
      error: error.message,
    });
  }
});

router.get("/stripe/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    res.send(session); // session includes payment_intent
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Stripe session retrieval failed",
      error: err.message,
    });
  }
});

module.exports = router;
