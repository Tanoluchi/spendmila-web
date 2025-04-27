import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { MenuContent, MenuRoot, MenuTrigger, MenuItem } from "../ui/menu"

import type { UserPublic } from "@/client"
import { useState } from "react"
import DeleteUser from "../Admin/DeleteUser"
import EditUser from "../Admin/EditUser"

interface UserActionsMenuProps {
  user: UserPublic
  disabled?: boolean
}

export const UserActionsMenu = ({ user, disabled }: UserActionsMenuProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
    <>
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton 
            variant="ghost" 
            color="inherit" 
            disabled={disabled}
            aria-label="User actions"
          >
            <BsThreeDotsVertical />
          </IconButton>
        </MenuTrigger>
        <MenuContent width="150px">
          <MenuItem onClick={() => setIsEditOpen(true)}>
            <FiEdit style={{ marginRight: '8px' }} />
            Edit User
          </MenuItem>
          <MenuItem onClick={() => setIsDeleteOpen(true)} colorPalette="red">
            <FiTrash2 style={{ marginRight: '8px' }} />
            Delete User
          </MenuItem>
        </MenuContent>
      </MenuRoot>

      {isEditOpen && (
        <EditUser 
          user={user} 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteUser 
          id={user.id} 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </>
  )
}
