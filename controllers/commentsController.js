import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

import Comment from "../models/Comments.js";

import { HttpError, ctrlWrapper, processPicture } from "../helpers/index.js";

const picturesDir = path.resolve("public", "pictures");

const getAllComments = async (req, res) => {
  const { page = 1, limit = 20, ...filterParams } = req.query;
  const skip = (page - 1) * limit;

  const result = await Comment.find({ ...filterParams }, "-updatedAt", {
    skip,
    limit,
  }).populate("author", "name email subscription");
  const total = await Comment.find().count();
  res.json({
    comments: result,
    page: {
      current: page,
      total,
    },
  });
};

const getOneComment = async (req, res) => {
  const { id } = req.params;
  const result = await Comment.findOne({ _id: id });
  if (!result) {
    throw HttpError(404, `Comment with id=${id} not found`);
  }
  res.json(result);
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { _id: author } = req.user;

  const result = await Comment.findOneAndDelete({ _id: id, author });
  if (!result) {
    throw HttpError(
      404,
      `Comment with id=${id} not found or not allowed to edit`
    );
  }
  if (result.picture) {
    fs.unlink(result.picture, (err) => {
      if (err) console.error(err);
    });
  }
  res.json(result);
};

const createComment = async (req, res) => {
  const { _id: author } = req.user;
  let picture = null;

  if (req.file) {
    await processPicture(req.file.path);

    const { path: tempUpload, filename } = req.file;
    const id = nanoid();
    const [extention] = filename.split(".").reverse();
    const pictureName = `${id}.${extention}`;
    const resultUpload = path.join(picturesDir, pictureName);
    await fs.rename(tempUpload, resultUpload);
  
    picture = path.join("pictures", pictureName);
  }


  const result = await Comment.create({
    ...req.body,
    picture,
    author,
    typeComment: "head",
  });
  res.status(201).json(result);
};

const createReplyComment = async (req, res) => {
  const { _id: author } = req.user;
  const parentCommentId = req.params.id;
  const parentComment = await Comment.findById(parentCommentId);
  let picture = null;

  if (!parentComment) {
    throw HttpError(404, "Parent comment not found");
  }

  if (req.file) {
    await processPicture(req.file.path);

    const { path: tempUpload, filename } = req.file;
    const id = nanoid();
    const [extention] = filename.split(".").reverse();
    const pictureName = `${id}.${extention}`;
    const resultUpload = path.join(picturesDir, pictureName);
    await fs.rename(tempUpload, resultUpload);
  
    picture = path.join("pictures", pictureName);
  }


  const reply = await Comment.create({
    ...req.body,
    picture,
    author,
    replyTo: parentCommentId,
    typeComment: "reply",
  });
  parentComment.replies.push(reply._id);
  await parentComment.save();
  res.status(201).json(reply);
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { _id: author } = req.user;
  const result = await Comment.findOneAndUpdate({ _id: id, author }, req.body);
  if (!result) {
    throw HttpError(404, `Comment with id=${id} not found`);
  }
  res.json(result);
};

export default {
  getAllComments: ctrlWrapper(getAllComments),
  getOneComment: ctrlWrapper(getOneComment),
  deleteComment: ctrlWrapper(deleteComment),
  createComment: ctrlWrapper(createComment),
  createReplyComment: ctrlWrapper(createReplyComment),
  updateComment: ctrlWrapper(updateComment),
};
