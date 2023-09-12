const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

const forbiddenUsers = ["juliusomo", "maxblagun", "amyrobson", "ramsesmiron"];
// const forbiddenUsers = []

router.post(
  "/login",
  body("username")
    .trim()
    .isLength({ min: 2, max: 15 })
    .isAlphanumeric()
    .custom((value, { req }) => {
      if (forbiddenUsers.includes(value)) {
        throw new Error("Forbidden username");
      }
      return true;
    }),
  authController.login
);

module.exports = router;
