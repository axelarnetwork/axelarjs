#!/bin/bash

rm -rf src/contracts/its

SRC_FOLDER=node_modules/@axelar-network/interchain-token-service/artifacts/contracts

./bin/cli.mjs codegen \
--src $SRC_FOLDER \
--out src/contracts/its \
--exclude executable,proxies,utils \
--client '../../PublicContractClient' \
--flatten \
--index
