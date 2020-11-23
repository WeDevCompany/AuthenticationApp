// tslint:disable-next-line: no-var-requires
require("ts-node/register")
// tslint:disable-next-line: no-var-requires
require("tsconfig-paths/register")

import "dotenv/config"
import { createConnection } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { DatabaseConnectionTestConfiguration } from "../../ormconfig"

/*
 * This file is executed by Jest before running any tests.
 * We drop the database and re-create it from migrations every time.
 */
export default async () => {
  const testOrmConfig: MysqlConnectionOptions = {
    ...(DatabaseConnectionTestConfiguration as MysqlConnectionOptions),
    dropSchema: true,
  }
  const t0 = Date.now();
  console.log(DatabaseConnectionTestConfiguration);
  const connection = await createConnection(testOrmConfig)
  const connectTime = Date.now()
  await connection.runMigrations()
  const migrationTime = Date.now()
  console.log(
    ` 👩‍🔬 Connected in ${connectTime -
      t0}ms - Executed migrations in ${migrationTime - connectTime}ms.`
  )
}