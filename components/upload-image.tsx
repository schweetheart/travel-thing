import { uploadProfileImage } from "@/app/(profile)/[id]/actions"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const FileUpload = () => {
  return (
    <form action={uploadProfileImage}>
      <Input type="file" name="file" />
      <Button>Upload image</Button>
    </form>
  )
}
