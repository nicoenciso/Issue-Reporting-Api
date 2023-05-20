const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userID: String,
  Status: String,
  Description: String,
  Category: String,
  Priority: String, 
  AssigneeID: String,
  Open: String,
  Close: String,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

const notificationsSchema = new mongoose.Schema({
  type: String,
  section: String,
  body: String,
  read: String
});

const Notification = mongoose.model("Notification", notificationsSchema);

const postTicket = async (req, res, next) => {
  const { userID, Status, Description, Category, Priority, AssigneeID } = req.body;
  const date = new Date();
  const newTicket = new Ticket({
    userID,
    Status,
    Description,
    Category,
    Priority,
    AssigneeID,
    Open: date.toLocaleDateString(), 
    Close: ""
  });
  try {
    const ticket = await newTicket.save();
    res.json({
      Status: ticket.Status,
      Description: ticket.Description,
      Category: ticket.Category,
      Priority: ticket.Priority,
      AssigneeID: ticket.AssigneeID,
      Open: ticket.Open, 
    })
    next()
  } catch (err) {
    console.error(err);
  }
};

const getTickets = async (req, res) => {
  const tickets = await Ticket.find({userID: req.params.user})
  const resTickets = tickets.map(t => ({
      IssueNo: tickets.indexOf(t)+1,
      Status: t.Status,
      Description: t.Description,
      Category: t.Category,
      Priority: t.Priority,
      AssigneeID: t.AssigneeID,
      Open: t.Open,
      Close: t.Close
  }))
  res.json(resTickets)
};

const getAssignedTickets = async (req, res) => {
  const tickets = await Ticket.find({AssigneeID: req.params.support})
  const resTickets = tickets.map(t => ({
      IssueNo: tickets.indexOf(t)+1,
      Status: t.Status,
      Description: t.Description,
      Category: t.Category,
      Priority: t.Priority,
      ReportedBy: t.userID,
      Open: t.Open,
      Close: t.Close
  }))
  res.json(resTickets)
};

exports.postTicket = postTicket;
exports.getTickets = getTickets;
exports.getAssignedTickets = getAssignedTickets;