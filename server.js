const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require("dotenv").config();
const app = express()
const port = 3000

const { postTicket, postUser, getTickets, getAssignedTickets, updateTickets, postNotification, getNotifications, updateNotification, updateAllNotifications, deleteNotification, deleteAllNotifications, postCategory, getCategories, updateCategory, deleteCategory } = require("./database.js");
const { getUsers, getUser, updateUsers, updateUsersPicture, deleteUsersPicture, getUserRole, getUsersInRole, deleteRoleFromUser, assignRoleToUser } = require("./auth0.js");

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
  res.send("Issue-Reporting-Api (Open API)");
});

app.post("/api/ticket", upload.single("Attachment"), postTicket);
app.get("/api/ticket/:id/user", getTickets);
app.get("/api/ticket/:id/support", getAssignedTickets);
app.patch("/api/ticket/:id/checkticket", updateTickets);
app.post("/api/Notification", postNotification);
app.get("/api/:id/Notifications", getNotifications);
app.patch("/api/Notification/:id", updateNotification);
app.patch("/api/Notifications/:user", updateAllNotifications)
app.delete("/api/Notification/:id", deleteNotification);
app.delete("/api/Notifications/:user", deleteAllNotifications);
app.post("/api/Category", postCategory);
app.get("/api/Categories", getCategories);
app.patch("/api/Category/:id", updateCategory);
app.delete("/api/Category/:id", deleteCategory);
app.get("/api/users", getUsers);
app.get("/api/:id/user", getUser);
app.patch("/api/:id/users", updateUsers);
app.post("/api/:id/users/picture",upload.single("file"), updateUsersPicture);
app.post("/api/:id/users/clearMetadata", deleteUsersPicture);
app.get("/api/:id/roles", getUserRole);
app.get("/api/role/:roleId/users", getUsersInRole);
app.delete("/api/role/:userId", deleteRoleFromUser);
app.post("/api/role/:roleId/:userId", assignRoleToUser);

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`)
})

const http = require('http');

setInterval(() => {
  http.get('http://issue-reporting-api.nicolegend.repl.co');
}, 280000); // Realiza la solicitud cada 4 minutos y 40 segundos (280000 milisegundos)

