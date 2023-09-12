const { ObjectId } = require("mongodb");
const { validationResult } = require("express-validator");

const Comment = require("../models/comment");
const User = require("../models/user");

exports.getComments = async (req, res, next) => {
  const comments = await Comment.find()
    .sort({ likes: -1 })
    .populate({
      path: "wroteBy",
    })
    .populate({
      path: "replies",
      populate: {
        path: "wroteBy",
        model: "User",
      },
    });
  res.status(200).json({ message: "Comments fetched successfully", comments });
};

exports.addComent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  let { body, commentId } = req.body;

  const user = await User.findById(req.userId);
  let comment = new Comment({ body, wroteBy: req.userId });

  if (commentId) {
    const parent = await Comment.find({
      "replies._id": new ObjectId(commentId),
    });

    if (parent.length > 0) {
      commentId = parent[0]._id.toString();
    }

    const foundComment = await Comment.findById(commentId);
    foundComment.replies.push(comment);
    await foundComment.save();
  } else {
    await comment.save();
  }

  user.comments.push(comment);
  await user.save();

  res.status(201).json({
    message: "Comment added",
    comment: {
      ...comment._doc,
      wroteBy: {
        avatar: user.avatar,
        username: user.username,
        _id: user._id,
      },
    },
  });
};

exports.deleteComment = async (req, res, next) => {
  let { commentId } = req.body;
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const parent = await Comment.find({ "replies._id": new ObjectId(commentId) });

  if (parent.length > 0) {
    let parentId = parent[0]._id.toString();
    let foundComment = await Comment.findById(parentId);
    foundComment.replies.pull(commentId);
    await foundComment.save();
  } else {
    await Comment.findByIdAndRemove(commentId);
  }

  user.comments.pull(commentId);
  await user.save();

  res.status(200).json({ message: "Comment deleted" });
};

exports.editComment = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  let { body, commentId } = req.body;

  const parent = await Comment.find({ "replies._id": new ObjectId(commentId) });

  if (parent.length > 0) {
    let parentId = parent[0]._id.toString();
    let foundComment = await Comment.findById(parentId);
    foundComment.replies.id(commentId).body = body;
    await foundComment.save();
  } else {
    await Comment.findByIdAndUpdate(commentId, { body: body });
  }

  res.status(200).json({ message: "Post updated" });
};

exports.like = async (req, res, next) => {
  let { commentId } = req.body;

  let comment = await Comment.findById(commentId);

  let parent;
  if (!comment) {
    parent = await Comment.find({ "replies._id": new ObjectId(commentId) });
    comment = parent[0].replies.find(
      (reply) => reply._id.toString() === commentId
    );
  }

  if (comment.likedBy.includes(req.userId)) {
    comment.likes = comment.likes - 1;
    comment.likedBy.pull(req.userId);
  } else if (comment.dislikedBy.includes(req.userId)) {
    comment.likes = comment.likes + 1;
    comment.dislikedBy.pull(req.userId);
  } else {
    comment.likes = comment.likes + 1;
    comment.likedBy.push(req.userId);
  }

  if (parent) {
    await parent[0].save();
  } else {
    await comment.save();
  }

  res.status(200).json({ message: "liked" });
};

exports.dislike = async (req, res, next) => {
  let { commentId } = req.body;

  let comment = await Comment.findById(commentId);

  let parent;
  if (!comment) {
    parent = await Comment.find({ "replies._id": new ObjectId(commentId) });
    comment = parent[0].replies.find(
      (reply) => reply._id.toString() === commentId
    );
  }

  if (comment.dislikedBy.includes(req.userId)) {
    comment.likes = comment.likes + 1;
    comment.dislikedBy.pull(req.userId);
  } else if (comment.likedBy.includes(req.userId)) {
    comment.likes = comment.likes - 1;
    comment.likedBy.pull(req.userId);
  } else {
    comment.likes = comment.likes - 1;
    comment.dislikedBy.push(req.userId);
  }

  if (parent) {
    await parent[0].save();
  } else {
    await comment.save();
  }

  res.status(200).json({ message: "disliked" });
};
