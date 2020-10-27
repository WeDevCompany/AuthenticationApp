package.json
      "npm run[1;31m todo:[mfile",

scripts/todo.sh
git grep --heading --break --ignore-case -I --color=always -e '[1;31m FIX: [m*' -e '[1;31m TODO: [m*' | sed 's/\\s\\{3,\\}/  /g'

src/OAuth/Domain/User.ts
    //[1;31m TODO: [mRefactor it should be able to handle multiple errors

src/OAuth/Infraestructure/PassportConfig.ts
//[1;31m TODO: [mDO NOT REMOVE methods need it for the passport js library
//[1;31m TODO: [mDO NOT REMOVE methods need it for the passport js library

src/OAuth/Infraestructure/PassportOauthMiddleware.ts
  //[1;31m TODO: [mRefactor when the factory methods use the same name as the passport library
