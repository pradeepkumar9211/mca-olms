require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Testing imports -- will be deleted later in final version
const userAuth = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMidlleware");
const reviewRoutes = require("./routes/reviewRoutes");

// Handling All Routes

app.get("/", (req, res) => {
  res.send("Home Route");
});

//  Handling signup/sign authentication
app.use("/api/auth/", authRoutes);

// Course categories
app.use("/api/categories", categoryRoutes);

// Courses Routes
app.use("/api/courses", courseRoutes);

// Payment Routes
app.use("/api/payments", paymentRoutes);

// Enrollment Routes
app.use("/api/student", enrollmentRoutes);

// Progress Routes 
app.use("/api/student", progressRoutes);

// Wishlist Routes
app.use("/api/student", wishlistRoutes);

// Review Routes
app.use("/api/reviews", reviewRoutes);
// Testing role based access route -- will be deleted later in final version
// app.get(
//   "/api/test/protected",
//   userAuth,
//   roleMiddleware("student"),
//   (req, res) => {
//     console.log(req.user);
//     res.send(
//       `Hello I am ${req.user["role"] === "student" ? "a" : "an"} ${req.user["role"]}`,
//     );
//   },
// );

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
