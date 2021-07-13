#!/usr/bin/env bash


function addCSUM() {
    extension="$1"

    grep -o -P -e "\".*\.$extension.*?\"" index.html | while read -r line
    do
        if [[ $line == *"http"* ]]
        then
            continue
        fi

        line=${line:1:-1}
        cleanLine="${line%\?*}"
        xxcsum=`xxh32sum "$cleanLine"`
        csum="${xxcsum:0:8}"
        sed -i "s|\"$line\"|\"$cleanLine?c=$csum\"|" index.html
        #echo $line $csum

    done
}

addCSUM js
addCSUM css
