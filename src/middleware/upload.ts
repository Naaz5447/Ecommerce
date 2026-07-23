import multer from "multer";
import path from "path";
import fs from "fs";

function createStorage(folder: string) {
    const uploadPath = path.join(process.cwd(), "uploads", folder);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadPath);
        },

        filename(req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase();

            cb(
                null,
                `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
            );
        },
    });
}


function imageFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    console.log("Uploaded file:");
    console.log("name:", file.originalname);
    console.log("mime:", file.mimetype);

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".heic",
        ".heif",
    ];

    const ext = path
        .extname(file.originalname)
        .toLowerCase();

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(ext)
    ) {
        return cb(null, true);
    }

    cb(new Error("Only image files are allowed."));
}


export function upload(folder: string) {
    return multer({
        storage: createStorage(folder),

        fileFilter: imageFilter,

        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    });
}