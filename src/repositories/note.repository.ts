import { prisma } from "../config/prisma";

export class NoteRepository {
  async getNotes() {
    return prisma.note.findMany({
      orderBy: [
        { pinned: "desc" },
        { updatedAt: "desc" },
      ],
    });
  }

  async getNoteById(id: string) {
    return prisma.note.findUnique({
      where: {
        id,
      },
    });
  }

  async createNote(data: any) {
    return prisma.note.create({
      data,
    });
  }

  async updateNote(id: string, data: any) {
    return prisma.note.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteNote(id: string) {
    return prisma.note.delete({
      where: {
        id,
      },
    });
  }
}