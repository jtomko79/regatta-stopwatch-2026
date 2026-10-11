import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const liveRooms = sqliteTable('live_rooms', {
 id:text('id').primaryKey(), ownerId:text('owner_id').notNull(), ownerHash:text('owner_hash').notNull(),
 state:text('state').notNull(), revision:integer('revision').notNull().default(0), updatedAt:integer('updated_at').notNull()
});
