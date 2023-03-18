# Authentication

Given an `app.js` file and a database file `userData.db` consisting of tables `user` and `user_details`.

Written APIs to perform operations on the table `user_details` containing the following columns,

**User Table**

| Column   | Type |
| -------- | ---- |
| username | TEXT |
| email    | TEXT |
| password | TEXT |

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
      Login success!
      ```

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
  If a registered try to use forget password

- **Response**
  - **Status code**
    ```
    200
    ```
  - **Status text**
    ```
    Please click on the link to reset your password.
    ```
