const ManagementClient = require("auth0").ManagementClient;

const auth0 = new ManagementClient({
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: "read:users update:users read:roles read:role_members update:users_app_metadata",
});

const getUsers = (req, res) => {
  auth0
    .getUsers()
    .then((users) => {
      const usersList = users.map(user => ({
        username: user.username,
        email: user.email,
        userID: user.user_id,
        firstName: user.given_name,
        lastname: user.family_name
      }))
      res.json(usersList);
    })
    .catch((err) => {
      console.log(err);
    })
};

const getUser = (req, res) => {
  auth0
    .getUser({id: req.params.id})
    .then((user) => {
      res.json({
        username: user.username,
        email: user.email,
        firstName: user.given_name,
        lastname: user.family_name
      });
    })
    .catch((err) => {
      console.log(err);
    })
}

const updateUsers = (req, res) => {
  const data = {
    username: req.body.username,
    given_name: req.body.firstName,
    family_name: req.body.lastName
  }
  auth0
    .updateUser({id: req.params.id}, data)
    .then((newData) => {
    res.json(newData);
  })
  .catch((err) => {
    console.log(err)
  });
}

const getUserRole = (req, res) => {
  auth0
    .getUserRoles({id: req.params.id})
    .then((roles) => {
    res.json(roles);
  })
  .catch((err) => {
    console.log(err)
  });
}

const getUsersInRole = (req, res) => {
  auth0
    .getUsersInRole({id: req.params.roleId})
    .then((users) => {
      const roleUserId = users.map(user => user.user_id)
      res.json(roleUserId);
    })
    .catch((err) => {
      console.log(err)
    });
}

exports.getUsers = getUsers;
exports.getUserRole = getUserRole;
exports.getUser = getUser;
exports.updateUsers = updateUsers;
exports.getUsersInRole = getUsersInRole;