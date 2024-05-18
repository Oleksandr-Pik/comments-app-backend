import express from "express";

import {
  createCommentSchema,
  updateCommentSchema,
} from "../models/Comments.js";

import { validateBody } from "../helpers/index.js";

import { authenticate, isEmptyBody, isValidId, upload } from "../middlewares/index.js";

import commentsController from "../controllers/commentsController.js";

const {
  getAllComments,
  getOneComment,
  deleteComment,
  createComment,
  createReplyComment,
  updateComment,
} = commentsController;

const commentsRouter = express.Router();

commentsRouter.use(authenticate);

commentsRouter.get("/", getAllComments);

commentsRouter.get("/:id", isValidId, getOneComment);

commentsRouter.delete("/:id", isValidId, deleteComment);

commentsRouter.post(
  "/",
  upload.single("picture"),
  isEmptyBody,
  validateBody(createCommentSchema),
  createComment
);

commentsRouter.post(
  "/:id/replies",
  upload.single("picture"),
  isEmptyBody,
  validateBody(createCommentSchema),
  createReplyComment
);

commentsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateCommentSchema),
  updateComment
);

export default commentsRouter;
