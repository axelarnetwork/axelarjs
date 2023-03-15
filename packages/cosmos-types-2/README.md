# @axelarnetwork/axelarjs-types

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
