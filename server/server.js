const express = require('express');

require('dotenv').config()

const app = express();

const dbConfig = require("./config/dbConfig");

const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute");
const chatsRoute = require("./routes/chatsRoute");
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);

app.listen(port, () => console.log(`server running on port ${port}`))