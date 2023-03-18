const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is Running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//Registration API

app.post("/register", async (request, response) => {
  const userDetails = request.body;
  const { username, email, password } = userDetails;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
        SELECT *
        FROM user_details
        WHERE username = '${username}';
    `;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO user_details
      (username,email,password)
      VALUES
      (
          '${username}',
          '${email}',
          '${hashedPassword}'
      );
      `;
    await db.run(createUserQuery);
    response.send("User Created Successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//Login API

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
        SELECT *
        FROM user_details
        WHERE
        username = '${username}';
    `;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      response.send("Login Success!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

//Forget password API

app.post("/forget-password", async (request, response) => {
  const { username, email } = request.body;
  const selectUserUserQuery = `
    SELECT *
    FROM user_details
    WHERE username = '${username}';
`;
  const dbUser = await db.get(selectUserUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const randomString = randomstring.generate();
    const testAccount = await nodemailer.createTestAccount();
    const transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "rhea4@ethereal.email",
        pass: "fFjmntGJ9E5w1DQ1ME",
      },
    });

    const info = await transporter.sendMail({
      from: "shravan@gmail.com",
      to: email,
      subject: "API for Forget password",
      html: `<p>Please click on the link http://localhost:3000/forget-password/?token=${randomString} to reset your password</p>`,
    });

    response.json(info);
  }
});
