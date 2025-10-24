import type { XRPLWallet } from '@axelarjs/xrpl-wallet-standard-vendored'
import styled from 'styled-components'
import { useConnect } from '@axelarjs/xrpl-wallet-standard-vendored'
import { getRegisterdXRPLWallets } from "@axelarjs/xrpl-wallet-standard-vendored";

const WalletListContainer = styled.ul`
  padding: 0;
  margin: 0;
`

const WalletItem = styled.li`
  list-style: none;
  display: flex;
`

const WalletButton = styled.button`
  display: flex;
  width: 100%;
  justify-content: stretch;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  margin: 0.3rem;
`

const WalletIcon = styled.img`
  height: 36px;
  vertical-align: middle;
`

const WalletName = styled.span`
  vertical-align: middle;
`

type Props = {
  onConnectSuccess: () => void
  onConnectError: (error: Error) => void
}

export const WalletList = ({ onConnectSuccess, onConnectError }: Props) => {
  const wallets = getRegisterdXRPLWallets()
  const { connect } = useConnect()

  const handleConnect = async (wallet: XRPLWallet) => {
    try {
      await connect(wallet)
      onConnectSuccess()
    } catch (error: any) {
      onConnectError(error)
    }
  }

  return (
    <WalletListContainer>
      {wallets.map((wallet) => (
        <WalletItem key={wallet.name}>
          <WalletButton onClick={() => handleConnect(wallet)}>
            <WalletIcon src={wallet.icon} alt={wallet.name} />
            <WalletName>{wallet.name}</WalletName>
          </WalletButton>
        </WalletItem>
      ))}
    </WalletListContainer>
  )
}