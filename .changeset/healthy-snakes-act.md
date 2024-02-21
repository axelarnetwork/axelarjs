---
"@axelarjs/maestro": minor
---

Major upgrade of dependencies:

- react-query v5.x
- wagmi v2.x
- web3modal v4.x
- tprc v11.x

Bugfixes:

- locale related bigint parse issue on token deployment and interchain transfer flows
- use 'auto' flag for gas multiplier to allow for dynamic multiplier when retrieving gas quotes

UX:

- Interhcain token page: new pending section for remote interchain tokens being deployed
