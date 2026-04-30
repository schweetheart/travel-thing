// Friends who will also be visiting the same place at the same time as the user

import { Item, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { UserAvatar } from "@/components/user-avatar"
import { visitRepository } from "@/lib/repositories/visit-repository"

export const OverlappingFriends = async ({ visitId }: { visitId: number }) => {
  const overlappingFriends = await visitRepository.overlappingVisits(visitId)

  return (
    <ItemGroup>
      {overlappingFriends.map((user) => (
        <Item key={user.id}>
          <ItemMedia>
            <UserAvatar user={user} />
          </ItemMedia>
          <ItemTitle>{user.name || `User #${user.id}`}</ItemTitle>
        </Item>
      ))}
    </ItemGroup>
  )
}
