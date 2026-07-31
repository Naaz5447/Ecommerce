import { Request, Response } from "express";
import { NoteService } from "../services/note.service";

const noteService = new NoteService();

export class NoteController {
    async getNotes(req: Request, res: Response) {
        const data = await noteService.getNotes();

        res.json({
            success: true,
            data,
        });
    }

    async getNote(req: Request, res: Response) {
        const note = await noteService.getNote(String(req.params.id));

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.json({
            success: true,
            data: note,
        });
    }

    async createNote(req: Request, res: Response) {
        const note = await noteService.createNote(req.body);

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });
    }

    async updateNote(req: Request, res: Response) {
        const note = await noteService.updateNote(
            String(req.params.id),
            req.body
        );

        res.json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });
    }

    async deleteNote(req: Request, res: Response) {
        await noteService.deleteNote(String(req.params.id));

        res.json({
            success: true,
            message: "Note deleted successfully",
        });
    }
}