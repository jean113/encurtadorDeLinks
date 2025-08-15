import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { v4 as uuidv4 } from 'uuid';

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  original: text('original').notNull(),
  encurtado: text('encurtado').notNull(),
  acesso: integer('acesso').notNull().default(0),  
  createdAt: timestamp('created_at').defaultNow().notNull(),
})