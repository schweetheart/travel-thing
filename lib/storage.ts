import { getCloudflareContext } from "@opennextjs/cloudflare"

export const deleteFile = async (key: string) => {
  const cloudflare = getCloudflareContext()
  await cloudflare.env.IMAGES_R2_BUCKET.delete(key)
}

export const uploadFile = async (key: string, file: File) => {
  const cloudflare = getCloudflareContext()
  const object = await cloudflare.env.IMAGES_R2_BUCKET.put(key, file)

  if (!object) {
    throw new Error("Failed to upload image to R2")
  }
}

export const getUrl = (key: string) => {
  return `${process.env.R2_BUCKET_URL}/${key}`
}
