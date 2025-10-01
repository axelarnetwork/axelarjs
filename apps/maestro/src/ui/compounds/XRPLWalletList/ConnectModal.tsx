import { blackA, gray, mauve } from '@radix-ui/colors'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { WalletList } from './WalletList'

const CloseButton = styled.button`
  font-family: inherit;
  padding: 0;
  border: none;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${gray.gray11};
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: inherit;
  &:hover {
    background-color: ${blackA.blackA1};
  }
  &:focus {
    outline: none;
  }
`

const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const contentShow = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`

const DialogContent = styled(Dialog.Content)`
  z-index: 100;
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`

const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  text-align: center;
  font-weight: 500;
  color: ${mauve.mauve11};
  font-size: 1.5em;
`

type Props = {
  trigger: React.ReactNode
}

export const ConnectModal = ({ trigger }: Props) => {
  const [open, setOpen] = useState(false)

  const handleConnectSuccess = () => {
    setOpen(false)
  }
  const handleConnectError = (error: any) => {
    console.error(error.message)
    setOpen(false)
  }

  const preventOpenAutoFocus = (e: Event) => {
    e.preventDefault()
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent aria-describedby={undefined} onOpenAutoFocus={preventOpenAutoFocus}>
          <DialogTitle>Connect to</DialogTitle>
          <Dialog.Description />
          <WalletList onConnectSuccess={handleConnectSuccess} onConnectError={handleConnectError} />
          <Dialog.Close asChild>
            <CloseButton aria-label="Close">
              <Cross2Icon width={24} height={24} />
            </CloseButton>
          </Dialog.Close>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}