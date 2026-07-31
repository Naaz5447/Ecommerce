import { NoteRepository } from "../repositories/note.repository";

const noteRepository = new NoteRepository();

export class NoteService {
    async getNotes() {
        return noteRepository.getNotes();
    }

    async getNote(id: string) {
        return noteRepository.getNoteById(id);
    }

    async createNote(data: any) {
        return noteRepository.createNote({
            title: data.title,
            content: data.content,
            category: data.category,
            color: BigInt(data.color),
            pinned:
                data.pinned === true ||
                data.pinned === "true",
        });
    }

    async updateNote(id: string, data: any) {
        return noteRepository.updateNote(id, {
            title: data.title,
            content: data.content,
            category: data.category,
            color: data.color ? BigInt(data.color) : undefined,
            pinned:
                data.pinned === true ||
                data.pinned === "true",
        });
    }

    async deleteNote(id: string) {
        return noteRepository.deleteNote(id);
    }
}