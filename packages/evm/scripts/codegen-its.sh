#!/bin/bash

rm -rf src/contracts/its

./bin/cli.mjs codegen \
--src node_modules/@axelar-network/interchain-token-service/artifacts/contracts \
--out src/contracts/its \
--exclude executable,proxies,utils \
--client '../../PublicContractClient' \
--flatten \
--index \