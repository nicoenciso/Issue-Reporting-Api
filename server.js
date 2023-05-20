const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express()
const port = 3000

const { postTicket, postUser, getTickets, getAssignedTickets } = require("./database.js");
const { getUsers, getUser, updateUsers, getUserRole, getUsersInRole } = require("./auth0.js");

 mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"));

const options = {
  origin: process.env.ORIGIN2 || "*",
};

app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Issue-Reporting-Api");
});

app.post("/api/ticket", postTicket);
app.get("/api/ticket/:user", getTickets);
app.get("/api/ticket/:support", getAssignedTickets)
app.get("/api/users", getUsers);
app.get("/api/:id/user", getUser);
app.patch("/api/:id/users", updateUsers);
app.get("/api/:id/roles", getUserRole);
app.get("/api/role/:roleId/users", getUsersInRole);

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`)
})