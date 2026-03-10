require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// Importing Routes
const authRoutes = require("./routes/authRoutes");


// Testing imports -- will be deleted later in final version
const userAuth = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMidlleware");

// Handling All Routes

app.get("/", (req, res) => {
  res.send("Home Route");
});

//  Handling signup/sign authentication
app.use("/api/auth/", authRoutes);

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