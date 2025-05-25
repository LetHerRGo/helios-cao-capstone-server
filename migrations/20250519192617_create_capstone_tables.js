/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema
    .createTable("agent", (table) => {
      table.increments("id").primary();
      table.string("name", 255);
    })

    .createTable("agent_user", (table) => {
      table.increments("id").primary();
      table.string("username", 255);
      table.string("email", 255);
      table.string("password", 255);
      table.integer("agent_id").unsigned().references("id").inTable("agent");
    })

    .createTable("forwarder", (table) => {
      table.increments("id").primary();
      table.string("name", 255);
    })

    .createTable("forwarder_operator", (table) => {
      table.increments("id").primary();
      table.string("username", 255);
      table.string("email", 255);
      table.string("password", 255);
      table.integer("forwarder_id").unsigned().references("id").inTable("forwarder");
    })

    .createTable("client", (table) => {
      table.increments("id").primary();
      table.string("name", 255);
    })

    .createTable("client_user", (table) => {
      table.increments("id").primary();
      table.string("username", 255);
      table.string("email", 255);
      table.string("password", 255);
      table.integer("client_id").unsigned().references("id").inTable("client");
    })

    .createTable("containers", (table) => {
      table.increments("id").primary();
      table.string("container_number", 255);
      table.integer("agent_id").unsigned().references("id").inTable("agent");
      table.integer("operator_id").unsigned().references("id").inTable("forwarder_operator");
      table.integer("forwarder_id").unsigned().references("id").inTable("forwarder");
      table.integer("client_id").unsigned().references("id").inTable("client");
      table.string("forwarder_ref", 255);
    })

    .createTable("container_movements", (table) => {
      table.increments("id").primary();
      table.integer("container_id").unsigned().references("id").inTable("containers");
      table.string("status", 255);
      table.string("location", 255);
      table.string("event_description", 255);
      table.dateTime("event_time");
      table.string("customs_status", 255);
      table.dateTime("ETA");
      table.date("storage_last_free_day");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema
    .dropTableIfExists("container_movements")
    .dropTableIfExists("containers")
    .dropTableIfExists("client_user")
    .dropTableIfExists("client")
    .dropTableIfExists("forwarder_operator")
    .dropTableIfExists("forwarder")
    .dropTableIfExists("agent_user")
    .dropTableIfExists("agent");
}
