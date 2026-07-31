import { Router } from "express";
import { NoteController } from "../controllers/note.controller";

const router = Router();
const controller = new NoteController();

router.get("/", controller.getNotes.bind(controller));

router.get("/:id", controller.getNote.bind(controller));

router.post("/", controller.createNote.bind(controller));

router.put("/:id", controller.updateNote.bind(controller));

router.delete("/:id", controller.deleteNote.bind(controller));

export default router;