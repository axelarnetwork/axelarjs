#!/bin/bash

pnpm clean

# build only files under src
pnpm tsc -p tsconfig.build.json -m commonjs --outDir build/commonjs --noEmitOnError false 2>/dev/null
pnpm tsc -p tsconfig.build.json -m esnext --outDir build/module --noEmitOnError false 2>/dev/null

cp -Rf build/commonjs/* .
