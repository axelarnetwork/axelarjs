# @axelarjs/proto

[![NPM Version](https://img.shields.io/npm/v/%40axelarjs%2Fproto)](https://www.npmjs.com/package/@axelarjs/proto)
[![Changelog](https://img.shields.io/badge/changelog-Changesets-48B8F3.svg)](/packages/proto/CHANGELOG.md)
[![Typedoc](https://img.shields.io/badge/docs-Typedoc-C87BFF.svg)](https://axelarnetwork.github.io/axelarjs/proto)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

JS and TS types relating to Protocol Buffers used by [axelar-core](https://github.com/axelarnetwork/axelar-core) and other related projects

## Dependencies

To generate JS/TS code from protocol buufers, you need to install:

- https://formulae.brew.sh/formula/protobuf#default

You can use Brew on macOS:

```
brew install protobuf
```

## Rebuilding types

```sh
pnpm sync # sync protobuf definition files from axelar-core, by default it will use the main branch. For a specific tag, use TAG=vX.X.X pnpm sync
pnpm codegen # generate .js/.d.ts files
```
