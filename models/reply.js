const mongoose = require('mongoose');

const Schema = mongoose.Schema

const replySchema = new Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Reply', replySchema)