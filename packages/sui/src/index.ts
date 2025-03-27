import * as MainnetContracts from './mainnet/types'
import * as TestnetContracts from './devnet-amplifier/types'
import * as DevnetAmplifierContracts from './testnet/types'

export default {
  mainnet: MainnetContracts,
  testnet: TestnetContracts,
  ['devnet-amplifier']: DevnetAmplifierContracts,
}
