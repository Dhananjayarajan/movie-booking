require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://movie-booking-frontend-4zdw.onrender.com",
    ],
    credentials: true,
  })
);

// Raw body parser only for webhooks
app.use("/api/webhook", bodyParser.raw({ type: "application/json" }));
app.use(express.json());

// MongoDB config
require("./config/dbConfig");

// Routes
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/movies", require("./routes/moviesRoute"));
app.use("/api/theatres", require("./routes/theatreRoute"));
app.use("/api", require("./routes/billingRoute"));
app.use("/api", require("./webhook/stripeWebhook"));
app.use("/api/bookings", require("./routes/bookingRoute"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
