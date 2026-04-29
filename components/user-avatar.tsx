import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar"
import { getInitials } from "@/lib/utils"
import { getUrl } from "@/lib/storage"

export const UserAvatar = async ({
  user,
}: {
  user: { name: string | null; profileImageKey: string | null }
}) => {
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
  user: {
    name: string | null
    profileImageKey: string | null
  }
  size?: number
}) => {
  return (
    <>
      {user.profileImageKey && (
        <AvatarImage
          fill={true}
          className="object-fit"
          alt={user.name ?? "User Avatar"}
          src={getUrl(user.profileImageKey)}
          sizes={`${size}px`}
        />
      )}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </>
  )
}
