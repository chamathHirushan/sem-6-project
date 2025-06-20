export async function handleImageUpload(files: FileList | File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];

  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sewalk-imgs');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djsq4aguk/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log(`Uploaded ${file.name}:`, data.secure_url);
      uploadedUrls.push(data.secure_url);
    } catch (err) {
      console.error(`Upload failed for ${file.name}:`, err);
    }
  }

  return uploadedUrls;
}