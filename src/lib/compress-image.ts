export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
export const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;

const MAX_IMAGE_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

export async function compressImageForUpload(file: File): Promise<Blob> {
    if (file.size > MAX_INPUT_BYTES) {
        throw new Error(
            "L'image est trop lourde (10 Mo maximum avant envoi)."
        );
    }

    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    let targetWidth = width;
    let targetHeight = height;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width >= height) {
            targetWidth = MAX_IMAGE_DIMENSION;
            targetHeight = Math.round((height / width) * MAX_IMAGE_DIMENSION);
        } else {
            targetHeight = MAX_IMAGE_DIMENSION;
            targetWidth = Math.round((width / height) * MAX_IMAGE_DIMENSION);
        }
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        bitmap.close();
        throw new Error("Impossible de préparer l'image.");
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Échec de la compression de l'image."));
                }
            },
            "image/jpeg",
            JPEG_QUALITY
        );
    });

    if (blob.size > MAX_OUTPUT_BYTES) {
        throw new Error(
            "Image encore trop lourde après compression. Rapprochez le sujet ou prenez une photo plus petite."
        );
    }

    return blob;
}
