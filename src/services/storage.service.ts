import { supabase } from "../config/supabase";


export async function uploadToSupabase(
    file: Express.Multer.File,
    folder: string
) {
    const extension = file.originalname
        .split(".")
        .pop();


    const filename =
        `${folder}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;


    const { error } = await supabase.storage
        .from("products")
        .upload(
            filename,
            file.buffer,
            {
                contentType: file.mimetype,
            }
        );


    if (error) {
        throw error;
    }


    const { data } =
        supabase.storage
            .from("products")
            .getPublicUrl(filename);


    return data.publicUrl;
}