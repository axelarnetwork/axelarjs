# Description: Generate typescript types from proto files

npx rimraf src/generated/proto/* 
protoc -I=proto -I=proto/third_party proto/axelar/**/**/*.proto\
 --plugin=./node_modules/.bin/protoc-gen-ts_proto\
 --ts_proto_out=src\
 --ts_proto_opt='esModuleInterop=true,forceLong=long,useOptionals=messages'

# remove descriptor.ts to avoid infinite type recursion
npx rimraf src/google/protobuf/descriptor.ts

pnpm format