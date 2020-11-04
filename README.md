# Tasks

## Back

- [ ] Integrate the ORM
- [ ] Create the new repository
- [ ] Listar para un email en concreto todas las cuentas asociadas a ese usuario.
- [ ] Dado un listado de emails o un mail solo crear usuarios a notificar que tienen que entrar y conectar sus cuentas.
- [ ] Cada vez que un nuevo usuario conecte una cuenta deberíamos notificarlo y darle la vienida.
- [ ] Crear Dominio de notificaciones donde dado un email, un servicio y un mensaje en un formato determinado se le enviará una notificación a dicho usuario.

## Front

- [ ] Permitir añadir una nueva cuenta
- [ ] Permitir borrar una cuaneta ya existente
- [ ] Crear fron con el listado de tus cuentas
- [ ] Permitir restingir las notificaciones

# ORM insert

```
console.log('test');
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
