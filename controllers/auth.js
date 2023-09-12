const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { username } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    const newUser = new User({ username: username, avatar: "" });
    await newUser.save();

    const token = createToken(username, newUser._id.toString());

    return res.status(201).json({
      message: "User created",
      userId: newUser._id.toString(),
      token,
    });
  }

  const token = createToken(username, user._id.toString());

  res.status(200).json({
    message: "Logged in",
    userId: user._id.toString(),
    token,
  });
};

const createToken = (username, userId) => {
  const token = jwt.sign(
    {
      username: username,
      userId: userId,
    },
    "superspecialsecret"
  );

  return token;
};
