import express from "express";

import authController from "../controllers/authController.js";

import { authenticate, isEmptyBody, upload } from "../middlewares/index.js";

import { validateBody } from "../helpers/index.js";

import {
  userRegisterSchema,
  userAuthSchema,
  emailSchema,
} from "../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userRegisterSchema),
  authController.register
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);

authRouter.post(
  "/verify/",
  isEmptyBody,
  validateBody(emailSchema),
  authController.resendVerifyEmail
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userAuthSchema),
  authController.login
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.post("/recaptcha", authController.reCaptchaVerify);

export default authRouter;
