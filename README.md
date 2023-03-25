# Authentication

Given an `app.js` file and a database file `userData.db` consisting of tables `user`, `user_details` and `post_details`.

Written APIs to perform operations on the table `user_details` and `post_details` containing the following columns,

**user_details Table**

| Column   | Type |
| -------- | ---- |
| username | TEXT |
| email    | TEXT |
| password | TEXT |

**post_details Table**

| Column          | Type     |
| --------------- | -------- |
| post_id         | INTEGER  |
| post_content    | TEXT     |
| comment_content | TEXT     |
| reaction_type   | TEXT     |
| posted_at       | DATETIME |

### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "username": "arun_prajapati",
  "email": "arunpraja5@gmail.com",
  "password": "arun_123"
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ``
      ```

- **Scenario 2**

  - **Description**:

    Successful registration of the registrant

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
    ```
    User created successfully
    ```

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**

```
{
  "username": "arun_prajapati",
  "password": "arun_123"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      {
        "jwtToken": "eyJhbGciOiJIUz......"
      }
      ```

Authentication with Token

- **Scenario 1**

- **Description**:

  If the token is not provided by the user or an invalid token

- **Response**

- **Status code**

```
401
```

Body

```
Invalid JWT Token
```

**Scenario 2** After successful verification of token proceed to next middleware or handler

### API 3

#### Path: `/forget-password`

#### Method: `POST`

**Request**

```
{
  "username": "arun_prajapati",
  "email": "arunpraja5@gmail.com"
}
```

- **Scenario 1**

  - **Description**:

    if an unregistered user tries to use forget password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid User
      ```

- **Scenario 2**
  If a registered user try to use forget password

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Please click on the link to reset your password.
    ```

### API 4

#### Path: `/post/`

#### Method: `GET`

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Returns list of all posts from post_details table.
    ```

### API 5

#### Path: `/post/:postId/`

#### Method: `GET`

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Returns a specific post based on the post ID from post_details table.
    ```

### API 6

#### Path: `/add-post/`

#### Method: `POST`

**Request**

```
{
    "postId":8,
    "postContent":"Help receive certainly case",
    "commentContent":"Remember country",
    "reactionType":"LIKE",
    "postedAt":"2023-01-10 15:09:32"
}
```

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Post Added Successfully!.
    ```

### API 7

#### Path: `/update-post/:postId/`

#### Method: `PUT`

Updates a post from the post_details table based on the post ID.

**Request**

```
{
    "postContent":"Design clear grow lot",
    "commentContent":"Should language hot get law",
    "reactionType":"DISLIKE",
    "postedAt":"2023-01-10 15:09:32"
}
```

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Post Details Updated!.
    ```

### API 8

#### Path: `/delete-post/:postId/`

#### Method: `DELETE`

Deletes a post from the post_details table based on the post ID.

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Post Removed!.
    ```

### API 9

#### Path: `/recent-post/`

#### Method: `GET`

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Returns top 3 recent posts from post_details table.
    ```
