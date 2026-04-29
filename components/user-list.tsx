import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./ui/item"
import type { User } from "@/lib/repositories/user-repository"
import Link from "next/link"
import { Avatar } from "./ui/avatar"
import { AvatarContent } from "./user-avatar"
import { Home } from "lucide-react"

export const UserList = ({ users }: { users: User[] }) => {
  return (
    <ItemGroup>
      {users.map((user) => (
        <Item key={user.id} variant="outline" asChild>
          <Link href={`/${user.id}`}>
            <ItemMedia variant="image">
              <Avatar className="size-10">
                <AvatarContent user={user} size={40} />
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{user.name ?? "Unknown"}</ItemTitle>
              {user.location?.city && (
                <ItemDescription className="flex items-center gap-1">
                  <Home />
                  {user.location.city}
                </ItemDescription>
              )}
            </ItemContent>
          </Link>
        </Item>
      ))}
    </ItemGroup>
  )
}
