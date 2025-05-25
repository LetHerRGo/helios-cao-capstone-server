
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('client').del();

  // Inserts seed entries
  await knex('client').insert([
    { name: 'UAP' },
    { name: 'Client Blue' },
    { name: 'Client Green' },
    { name: 'Client Yellow' },
    { name: 'Client Black' }
  ]);
}
