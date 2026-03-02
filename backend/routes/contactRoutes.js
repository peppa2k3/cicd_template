// backend/routes/contactRoutes.js
import express from "express";
import { sendContact } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/", sendContact);

export default contactRouter;
