import { DataSource } from 'typeorm';

export async function seedLanguagesAndCountries(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding languages...');

  await dataSource.query(`
    INSERT INTO languages 
    (id, code, name)
    VALUES
      ('a8fe3dd7-0499-4b12-94b6-92f335486e10', 'es', 'Español'),
      ('6638e53b-4dbf-4b82-beda-182a1ebad3f8', 'en', 'English')
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('✅ Languages seeded');
}
