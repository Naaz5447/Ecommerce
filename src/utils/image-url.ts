export function getImageUrl(path?: string | null) {

    if (!path) {
        return null;
    }


    const baseUrl =
        process.env.BASE_URL || "http://localhost:3000";


    if(path.startsWith("http")) {
        return path;
    }


    return `${baseUrl}${path}`;

}