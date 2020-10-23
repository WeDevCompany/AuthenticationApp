package.json
      "npm run[1;31m todo:[mfile",

scripts/todo.sh
git grep --heading --break --ignore-case -I --color=always -e '[1;31m FIX: [m*' -e '[1;31m TODO: [m*' | sed 's/\\s\\{3,\\}/  /g'
