const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const commentsController = require("../controllers/comments");
const isAuth = require("../middleware/is-auth");

router.get("/comments", commentsController.getComments);

router.post(
  "/add-comment",
  body("body").trim().not().isEmpty(),
  isAuth,
  commentsController.addComent
);

router.delete("/delete-comment", isAuth, commentsController.deleteComment);

router.put(
  "/edit-comment",
  body("body").trim().not().isEmpty(),
  isAuth,
  commentsController.editComment
);

router.post("/like", isAuth, commentsController.like);

router.post("/dislike", isAuth, commentsController.dislike);

module.exports = router;
