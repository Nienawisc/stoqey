# Stoqey backend

---

an authenticated server exposing a GraphQL API to requesting clients. It uses jwt tokens to authenticate users and keep them logged in.

-  Auth services (firebase auth)
-  Marketdata service(exodus/stoqey, polygon, finnhub, ibkr)
-  Exchange service(stoqey, binance, ibkr)
# Instructions to run

---

This project is packaged via npm; the respective package.json file contains all required scripts.

> For convenience, `.env` file is attached with the repository and the database configuration are already in place. Not recommended for production.

In order to the run the project, first the dependencies need to be installed.

---

To install all dependencies:

```
    `yarn install` or `npm install`
```

---

To start the server:

```
    `yarn start` or `npm start`
```

# Database Schema

![UserModel](https://i.ibb.co/9W1MhsR/User-Model-1.jpg)

#### User Model

A simplistic model for user to illustrate the authentication example.

# Graph QL API: types, mutation and queries

#### Types

---

```graphql
LoginResponse {
  accessToken: String!
  user: User!
}
```

```graphql
User {
  id: Int!
  email: String!
}
```

#### Mutations

---

```graphql
Mutation {
  register(password: String!, email: String!): Boolean!
  login(password: String!, email: String!): LoginResponse!
  revokeRefreshTokenForUser(userId: Int!): Boolean!
  logout: Boolean!
}
```

#### Queries

---

```graphql
Query {
  hello: String!
  bye: String!
  users: [User!]!
  me: User
}
```

# Example API requests

#### Registration

Registering an user with a sample email and password.

```graphql
mutation registerUser {
  register(email: "hobby@gmail.com", password: "userPassword")
}
```

#### Login

Logging in an user and returning accessToken for further requests.

```graphql
mutation login {
  login(email: "hobby@gmail.com", password: "userPassword") {
    accessToken
  }
}
```