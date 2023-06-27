const ManagementClient = require("auth0").ManagementClient;

const auth0 = new ManagementClient({
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: "read:users update:users read:roles read:role_members create:role_members update:users_app_metadata",
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
        lastName: user.family_name,
        picture1: user.user_metadata?.picture,
        picture2: user.picture,
        lastLogin: user.last_login
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
        picture1: user.user_metadata?.picture,
        picture2: user.picture,
        username: user.username,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name
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
    console.log("User Updated")
  })
  .catch((err) => {
    console.log(err)
  });
}

const updateUsersPicture = (req, res, next) => {
  const file = req.file;
  const metadata = { picture: `data:image/jpeg;base64,${file.buffer.toString('base64')}`}
  auth0
    .updateUserMetadata({id: req.params.id}, metadata)
    .then((newData) => {
    res.json(newData);
    console.log("User picture updated")
  })
  .catch((err) => {
    console.log(err)
  });
}

const deleteUsersPicture = (req, res) => {
  const clearMetadata = req.body
  auth0
    .updateUserMetadata({id: req.params.id}, clearMetadata)
    .then((newData) => {
    res.json(newData);
    console.log("User picture deleted")
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

const deleteRoleFromUser = (req, res) => {
  const user = process.env.USER_ROLE;
  const support = process.env.SUPPORT_ROLE;
  auth0
    .removeRolesFromUser(
      {id: req.params.userId},
      {"roles": [support, user]})
    .then((newData) => {
      res.json(newData);
      console.log("Role deleted");
    })
    .catch((err) => {
      console.log(err)
    });
}

const assignRoleToUser = (req, res) => {
  auth0
    .assignRolestoUser(
      {id: req.params.userId},
      {"roles": [req.params.roleId]})
    .then((newData) => {
      res.json(newData);
      console.log("Role assigned");
    })
    .catch((err) => {
      console.log(err)
    });
}

exports.getUsers = getUsers;
exports.getUserRole = getUserRole;
exports.getUser = getUser;
exports.updateUsers = updateUsers;
exports.updateUsersPicture = updateUsersPicture;
exports.deleteUsersPicture = deleteUsersPicture;
exports.getUsersInRole = getUsersInRole;
exports.deleteRoleFromUser = deleteRoleFromUser;
exports.assignRoleToUser = assignRoleToUser;