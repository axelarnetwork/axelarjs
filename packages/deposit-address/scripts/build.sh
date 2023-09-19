#!/bin/bash

pnpm clean

# build only files under src
pnpm tsc -p tsconfig.build.json -m commonjs --outDir build/commonjs 
pnpm tsc -p tsconfig.build.json -m esnext --outDir build/module

cp -Rf build/commonjs/* .