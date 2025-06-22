const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const User = mongoose.model("users");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Stripe webhook verified");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      if (!userId) {
        console.error("❌ Missing userId in session metadata");
        return res.status(400).send("Missing userId");
      }

      try {
        const user = await User.findById(userId);
        if (user) {
          user.credits = (user.credits || 0) + 5;
          await user.save();
          console.log(`✅ Credits updated for ${user.email}`);
        }
      } catch (error) {
        console.error("❌ Failed to update user credits:", error);
      }
    }

    res.status(200).send({});
  }
);

module.exports = router;
