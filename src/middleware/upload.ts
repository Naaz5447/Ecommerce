import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

function imageFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
    ];

    const ext = path
        .extname(file.originalname)
        .toLowerCase();

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".heic",
        ".heif",
    ];

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(ext)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
}
export function upload(folder?: string) {
    return multer({
        storage,
        fileFilter: imageFilter,
        limits: {
            fileSize: 200 * 1024,
        },
    });
}