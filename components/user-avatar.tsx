import { getImageProps } from "next/image"
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar"
import { User } from "@/lib/repositories/user-repository"
import { getInitials } from "@/lib/utils"
import { getUrl } from "@/lib/storage"

export const UserAvatar = async ({ user }: { user: User }) => {
  return (
    <Avatar>
      <AvatarContent user={user} />
    </Avatar>
  )
}

export const AvatarContent = ({
  user,
  size = 40,
}: {
  user: User
  size?: number
}) => {
  if (user.profileImageKey) {
    const { props } = getImageProps({
      fill: true,
      style: { objectFit: "cover" },
      alt: user.name ?? "User Avatar",
      src: getUrl(user.profileImageKey),
      sizes: `${size}px`,
    })
    return <AvatarImage {...props} />
  }
  return <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
}
