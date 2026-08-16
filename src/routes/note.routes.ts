import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { asyncHandler } from "../common/handlers/async.handler";
import { ShopUserRole } from "@prisma/client";

const router = Router();
const controller = new NoteController();

router.use(authenticate);

router.use(
    requireRole(ShopUserRole.ADMIN)
);

router.get(
    "/",
    asyncHandler(
        controller.getNotes.bind(controller)
    )
);

router.get(
    "/:id",
    asyncHandler(
        controller.getNote.bind(controller)
    )
);

router.post(
    "/",
    asyncHandler(
        controller.createNote.bind(controller)
    )
);

router.put(
    "/:id",
    asyncHandler(
        controller.updateNote.bind(controller)
    )
);

router.delete(
    "/:id",
    asyncHandler(
        controller.deleteNote.bind(controller)
    )
);

export default router;