#!/bin/sh

# Get the directory of this script
DIR=$(readlink -f $0 | xargs dirname)

$DIR/bin/dht11 $@
