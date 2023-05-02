# Description: Sync proto files from axelarnetwork/axelar-core

pnpm clean
npx degit axelarnetwork/axelar-core/proto/axelar#${TAG:-'main'} proto/axelar
npx degit axelarnetwork/axelar-core/third_party/proto#${TAG:-'main'} proto/third_party