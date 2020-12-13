# First steps

```
npm run docker:reset-env && npm run docker:watch
```

# ORM insert

```
await this.databaseConnection
    .createQueryBuilder()
    .insert()
    .into(UserORM)
    .values({
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    image: user.image,
    email: user.email
    })
    .execute();
```

# Generate UUID for cookies

```
sudo apt-get install uuid-runtime
Random UUID generated with uuidgen -r
```
