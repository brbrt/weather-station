#!/bin/sh

# Get the directory of this script
DIR=$(readlink -f $0 | xargs dirname)

`which node || which nodejs` $DIR/ds18b20.js $@
