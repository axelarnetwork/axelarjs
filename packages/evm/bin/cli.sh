#!/usr/bin/env bash

# commands:
# codegen: generate code from abi

COMMAND=$1

# comma separated list of valid commands
VALID_COMMANDS="codegen"

get_npx_compatible_command(){
    # check if npx is installed
    if command -v npx &> /dev/null
    then
        echo "npx"
    # check if pnpx is installed
    elif command -v pnpx &> /dev/null
    then
        echo "pnpx"
   # check if bunx is installed
    elif command -v bunx &> /dev/null
    then
        echo "bunx"
    else
        echo "npx, pnpx or bunx is required to run this script"
        exit 1
    fi
}


# get the npx compatible command
NPX_COMMAND=$(get_npx_compatible_command)

case $COMMAND in
    codegen)
        echo "using '$NPX_COMMAND' to run codegen"
        $NPX_COMMAND tsx ./scripts/codegen.ts "$@"
        ;;
    *)
        echo "unknown command received: '$COMMAND'"
        echo "valid commands:"
        # split string into array and print each element on a new line with a - prefix
        echo "$VALID_COMMANDS" | tr ',' '\n' | sed 's/^/ * /'
        ;;
esac