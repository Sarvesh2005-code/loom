import { useMutation } from "convex/react";

export function useUploadFiles(generateUploadUrlMutation: any) {
    const generateUploadUrl = useMutation(generateUploadUrlMutation);

    const startUpload = async (files: File[]) => {
        const uploaded = await Promise.all(
            files.map(async (file) => {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                const { storageId } = await result.json();
                return { response: storageId };
            })
        );
        return uploaded;
    };

    return { startUpload };
}
