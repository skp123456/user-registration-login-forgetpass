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

//Get list of all posts API

app.get("/post/", async (request, response) => {
  const getPostDetailsQuery = `
    SELECT *
    FROM post_details;
    `;
  const postArray = await db.all(getPostDetailsQuery);
  response.send(postArray);
});

//Get a specific post API

app.get("/post/:postId/", async (request, response) => {
  const { postId } = request.params;
  const getSinglePostQuery = `
        SELECT *
        FROM post_details
        WHERE 
        post_id = ${postId};
    `;
  const post = await db.get(getSinglePostQuery);
  response.send(post);
});

//Create new post details API

app.post("/add-post/", async (request, response) => {
  const postDetails = request.body;
  const {
    postId,
    postContent,
    commentContent,
    reactionType,
    postedAt,
  } = postDetails;
  const createNewPostQuery = `
    INSERT INTO post_details
    (post_id,post_content,comment_content,reaction_type,posted_at)
    VALUES 
    (
        ${postId},
        '${postContent}',
        '${commentContent}',
        '${reactionType}',
        '${postedAt}'
    );
  `;
  await db.run(createNewPostQuery);
  response.send("Post Added Successfully!");
});

//Update post details API

app.put("/update-post/:postId/", async (request, response) => {
  const { postId } = request.params;
  const { postContent, commentContent, reactionType, postedAt } = request.body;
  const updatePostQuery = `
    UPDATE post_details
    SET
    post_content = '${postContent}',
    comment_content = '${commentContent}',
    reaction_type = '${reactionType}',
    posted_at = '${postedAt}'
    WHERE
    post_id = ${postId};
  `;
  await db.run(updatePostQuery);
  response.send("Post Details Updated!");
});

//Delete post details API

app.delete("/delete-post/:postId/", async (request, response) => {
  const { postId } = request.params;
  const deletePostQuery = `
        DELETE FROM post_details
        WHERE 
        post_id = ${postId};
    `;
  await db.run(deletePostQuery);
  response.send("Post Removed!");
});

//Get top 3 recent posts API

app.get("/recent-post/", async (request, response) => {
  const getTopThreeRecentPostQuery = `
        SELECT *
        FROM post_details
        ORDER BY posted_at DESC
        LIMIT 3;
    `;
  const topThreeRecentPosts = await db.all(getTopThreeRecentPostQuery);
  response.send(topThreeRecentPosts);
});
