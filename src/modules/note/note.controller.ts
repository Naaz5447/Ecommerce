import { Request, Response } from "express";
import { NoteService } from "./note.service";

const noteService = new NoteService();

export class NoteController {
    async getNotes(req: Request, res: Response) {
        const notes = await noteService.getNotes();

        res.json({
            success: true,
            data: notes.map(note => ({
                ...note,
                color: note.color.toString(),
            })),
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
            data: {
                ...note,
                color: note.color.toString(),
            },
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
            data: {
                ...note,
                color: note.color.toString(),
            },
        });
    }


    async createNote(req: Request, res: Response) {
        const note = await noteService.createNote(req.body);

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: {
                ...note,
                color: note.color.toString(),
            },
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