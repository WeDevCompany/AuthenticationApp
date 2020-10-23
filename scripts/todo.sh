#!/bin/sh
git grep --heading --break --ignore-case -I --color=always -e ' FIX: *' -e ' TODO: *' | sed 's/\\s\\{3,\\}/  /g'