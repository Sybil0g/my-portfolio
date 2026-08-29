// ------------------------------------------------------------------
// Uploads an image file to ImgBB and returns the hosted image URL.
// This is what powers the "Choose Image" pickers in the admin form —
// no Firebase Storage involved, so no Blaze plan / card needed.
//
// Setup: get a free API key at https://api.imgbb.com/ (sign in with
// email or Google, no card required) and put it in your .env file as:
//   VITE_IMGBB_API_KEY=your_key_here
// ------------------------------------------------------------------

const MAX_FILE_SIZE_MB = 5
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/** Returns an error message if the file isn't a valid image to upload, or null if it's fine. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG, or WebP image.'
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `That image is too large — please choose one under ${MAX_FILE_SIZE_MB}MB.`
  }
  return null
}

/** Uploads a single image file to ImgBB and resolves with its public URL. */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY as string | undefined

  if (!apiKey) {
    throw new Error(
      'Missing ImgBB API key — add VITE_IMGBB_API_KEY to your .env file (get a free key at api.imgbb.com).'
    )
  }

  const formData = new FormData()
  formData.append('image', file)

  let response: Response
  try {
    response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Could not reach ImgBB — check your internet connection and try again.')
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    throw new Error('ImgBB returned an unexpected response. Try again.')
  }

  if (!response.ok || !data?.data?.url) {
    throw new Error(data?.error?.message || 'ImgBB upload failed. Try again.')
  }

  return data.data.url as string
}
