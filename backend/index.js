require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// importing all routes
const authRoutes       = require("./routes/authRoutes");
const categoryRoutes   = require("./routes/categoryRoutes");
const courseRoutes     = require("./routes/courseRoutes");
const paymentRoutes    = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes   = require("./routes/progressRoutes");
const wishlistRoutes   = require("./routes/wishlistRoutes");
const reviewRoutes     = require("./routes/reviewRoutes");
const dashboardRoutes  = require("./routes/dashboardRoutes");

// home route
app.get("/", (req, res) => {
  res.send("Home Route");
});

// auth -- signup, signin, me, change password
app.use("/api/auth", authRoutes);

// course categories
app.use("/api/categories", categoryRoutes);

// courses + course modules
app.use("/api/courses", courseRoutes);

// payments
app.use("/api/payments", paymentRoutes);

// student -- enrollment, progress, wishlist
app.use("/api/student", enrollmentRoutes);
app.use("/api/student", progressRoutes);
app.use("/api/student", wishlistRoutes);

// reviews
app.use("/api/reviews", reviewRoutes);

// dashboards + profiles
app.use("/api", dashboardRoutes);

// 404 handler -- catches any unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// global error handler -- catches any unhandled errors
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}.`);
    });
  } catch (err) {
    console.log("Error : ", err);
    process.exit(1);
  }
}

main();