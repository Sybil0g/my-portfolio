// ------------------------------------------------------------------
// Handles uploading project images to Firebase Storage and returns
// the public URL to save on the project's Firestore document.
// ------------------------------------------------------------------
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'

export async function uploadProjectImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path = `projects/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Optional cleanup helper — call this if you replace/remove an image
// and want to delete the old file from Storage too (not required,
// but keeps your Storage bucket tidy).
export async function deleteProjectImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // Fails silently if the URL isn't a Storage reference — that's fine.
  }
}
