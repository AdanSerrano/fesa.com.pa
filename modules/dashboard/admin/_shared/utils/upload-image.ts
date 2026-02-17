export async function uploadImage<T extends string>(
  getUploadUrlAction: (
    type: T,
    id: string,
    fileName: string,
    fileType: string,
    imageIndex?: number
  ) => Promise<{ url: string; publicUrl: string } | { error: string }>,
  type: T,
  id: string,
  file: File,
  imageIndex?: number
): Promise<string | null> {
  const result = await getUploadUrlAction(type, id, file.name, file.type, imageIndex);
  if ("error" in result) return null;

  const response = await fetch(result.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return response.ok ? result.publicUrl : null;
}
