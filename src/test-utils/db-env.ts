import { getConnection } from "typeorm"
import { createDatabaseConnection } from "./test-db-connection"

beforeAll(async () => {
  await createDatabaseConnection()
})
afterAll(async () => {
  await getConnection().close()
})