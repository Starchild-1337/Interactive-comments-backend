const mongoose = require('mongoose');
const replySchema = require('./reply')

const Schema = mongoose.Schema

const commentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0,
  },
  wroteBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  dislikedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  replies: [replySchema.schema]
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)