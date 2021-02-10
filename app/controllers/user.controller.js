const passport = require("passport");
const db = require("../models");
const User = db.users;
exports.index = (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          // console.log(foundUser);
          res.json({ isAuthenticated: true, user: foundUser });
        }
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
};
exports.login = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        req.session.save(() => {
          if (req.isAuthenticated()) {
            res.status(200).json({ isAuthenticated: true });
          } else {
            res.status(500).json({ isAuthenticated: false });
          }
        });
      });
    }
  });
};
exports.dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          // console.log(foundUser);
          res.json({ isAuthenticated: true, user: foundUser });
        }
      }
    });
  } else {
    res.status(403).send("Not authenticated");
  }
};
exports.register = (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          return res.status(200).json({ success: true, data: user });
        });
      }
    }
  );
};
exports.logout = (req, res) => {
  req.logout();
  res.json({ success: true });
};
// exports.google = (req, res) => {};
// exports.googleCallback = (req, res) => {
//   passport.authenticate("google", { failureRedirect: "/login" });
//   res.json({ success: true });
//   function (req, res) {
//     // Successful authentication, redirect to secrets.
//     res.redirect("/secrets");
//   }
// };
