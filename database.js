const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  IssueNo: {type: Number, unique: true},
  userID: String,
  Status: String,
  Description: String,
  Category: String,
  Priority: String,
  AssigneeID: String,
  Open: String,
  Closed: String,
  Attachment: String,
  AttachmentMimeType: String,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

const notificationsSchema = new mongoose.Schema({
  From: String,
  To: String,
  Type: String,
  Section: String,
  Body: String,
  Date: String,
  Read: Boolean,
});

const Notification = mongoose.model("Notification", notificationsSchema);

const categoriesSchema = new mongoose.Schema({
  Title: String,
  Description: String,
});

const Category = mongoose.model("Category", categoriesSchema);

const postTicket = async (req, res, next) => {
  const ticketNumber = await Ticket.findOne().sort("-IssueNo").exec();
  const newTicketNumber = ticketNumber ? ticketNumber.IssueNo + 1 : 1;
  const { userID, Status, Description, Category, Priority, AssigneeID } =
    req.body;
  const file = req.file;
  const date = new Date();
  const newTicket = new Ticket({
    IssueNo: newTicketNumber,
    userID,
    Status,
    Description,
    Category,
    Priority,
    AssigneeID,
    Attachment: file ? file.buffer.toString("base64") : "",
    AttachmentMimeType: file ? file.mimetype : "",
    Open: date.toLocaleDateString(),
    Closed: "",
  });
  try {
    const ticket = await newTicket.save();
    res.status(200).json(ticket);
    console.log("Ticket Submited");
    next();
  } catch (err) {
    console.error(err);
  }
};

/*
async function enumTickets() {
  try {
  const tickets = await Ticket.find({}).exec();

  tickets.sort((a, b) => a.IssueNo - b.IssueNo);

  let currentTicketNumber = 1;
    for(const ticket of tickets) {
      ticket.IssueNo = currentTicketNumber++;
      await ticket.save();
    }
    console.log("enumeracion completada")
}catch (err) {
  console.error("error con los tickets")
}
}
enumTickets();
*/

const getTickets = async (req, res) => {
  const tickets = await Ticket.find({ userID: req.params.id });
  const resTickets = tickets.map((t) => ({
    _id: t._id,
    IssueNo: t.IssueNo,
    Status: t.Status,
    Description: t.Description,
    Category: t.Category,
    Priority: t.Priority,
    AssigneeID: t.AssigneeID,
    Attachment: t.Attachment,
    AttachmentMimeType: t.AttachmentMimeType,
    Open: t.Open,
    Closed: t.Closed,
  }));
  res.status(200).json(resTickets.reverse());
};

const getAssignedTickets = async (req, res) => {
  const tickets = await Ticket.find({ AssigneeID: req.params.id });
  const resTickets = tickets.map((t) => ({
    _id: t._id,
    IssueNo: t.IssueNo,
    Status: t.Status,
    Description: t.Description,
    Category: t.Category,
    Priority: t.Priority,
    ReportedBy: t.userID,
    Attachment: t.Attachment,
    AttachmentMimeType: t.AttachmentMimeType,
    Open: t.Open,
    Closed: t.Closed,
  }));
  res.status(200).json(resTickets.reverse());
};

const updateTickets = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.status(200).json(ticket);
  console.log("Ticket updated");
};

const postNotification = async (req, res) => {
  const { From, To, Type, Section, Body } = req.body;
  const date = new Date();
  const newNotification = new Notification({
    From,
    To,
    Type,
    Section,
    Body,
    Date: date.toLocaleDateString(),
    Read: false,
  });
  try {
    const notification = await newNotification.save();
    res.status(200).json(notification);
    console.log("Notification added");
  } catch (err) {
    console.error(err);
  }
};

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ To: req.params.id });
  res.status(200).json(notifications.reverse());
};

const updateNotification = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.status(200).json(notification);
  console.log("Notification updated");
};

const updateAllNotifications = async (req, res) => {
  const notifications = await Notification.updateMany({To: req.params.user}, {Read: true});
  res.status(200).json(notifications);
  console.log("All notifications updated");
}

const deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id)
  res.status(200).json(notification);
  console.log("Notification deleted");
}

const deleteAllNotifications = async (req, res) => {
  const notifications = await Notification.deleteMany({To: req.params.user})
  res.status(200).json(notifications)
  console.log("All notifications deleted");
}

const postCategory = async (req, res) => {
  const { Title, Description } = req.body;
  const newCategory = new Category({
    Title,
    Description,
  });
  try {
    const category = await newCategory.save();
    res.status(200).json(category);
    console.log("Category added");
  } catch (err) {
    console.error(err);
  }
}

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  const resCategories = categories.map((c) => ({
    _id: c._id,
    Title: c.Title,
    Description: c.Description,
  }));
  res.status(200).json(resCategories);
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );
  res.status(200).json(category);
  console.log("Category updated");
}

exports.postTicket = postTicket;
exports.getTickets = getTickets;
exports.getAssignedTickets = getAssignedTickets;
exports.updateTickets = updateTickets;
exports.postNotification = postNotification;
exports.getNotifications = getNotifications;
exports.updateNotification = updateNotification;
exports.deleteNotification = deleteNotification;
exports.deleteAllNotifications = deleteAllNotifications;
exports.updateAllNotifications = updateAllNotifications;
exports.postCategory = postCategory;
exports.getCategories = getCategories;
exports.updateCategory = updateCategory;
