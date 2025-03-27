import * as MainnetContracts from './mainnet/types'
import * as TestnetContracts from './testnet/types'
import * as DevnetAmplifierContracts from './devnet-amplifier/types'

export default {
  mainnet: MainnetContracts,
  testnet: TestnetContracts,
  ['devnet-amplifier']: DevnetAmplifierContracts,
}
