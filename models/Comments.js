import { Schema, model } from "mongoose";

import Joi from "joi";

import { handleSaveError, preUpdate } from "./hooks.js";

const typeCommentList = ["head", "reply"];

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "'text' not be empty"],
    },
    picture: {
      type: String,
    },
    typeComment: {
      type: String,
      enum: typeCommentList,
      // default: 'head'
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "comment",
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
      required: false
    }]
  },
  { versionKey: false, timestamps: true }
);

commentSchema.post("save", handleSaveError);

commentSchema.pre("findOneAndUpdate", preUpdate);

commentSchema.post("findOneAndUpdate", handleSaveError);

export const createCommentSchema = Joi.object({
  text: Joi.string().required().messages({
    "any.required": `Write text of comment`,
  }),
  picture: Joi.string(),
});
export const createReplyCommentSchema = Joi.object({
  text: Joi.string().required().messages({
    "any.required": `Write text of comment`,
  }),
  picture: Joi.string(),
  // typeComment: Joi.string(),
  replyTo: Joi.string()
});

export const updateCommentSchema = Joi.object({
  text: Joi.string(),
});

const Comment = model("comment", commentSchema);

export default Comment;
