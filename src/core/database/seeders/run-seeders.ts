import { AppDataSource } from '../data-source';
import { seedLanguagesAndCountries } from './01-languages-countries.seeder';
import { seedBusinessParameters } from './02-business-parameters.seeder';
import { seedPlansAndAddons } from './03-plans-addons.seeder';
import { seedNotificationTemplates } from './04-notification-templates.seeder';

async function runSeeders() {
  try {
    console.log('🌱 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    console.log('\n🌱 Running seeders in order...\n');

    // 1. Languages and Countries (base data)
    console.log('📝 Step 1/4: Languages, Countries & Config...');
    await seedLanguagesAndCountries(AppDataSource);

    // 2. Business Parameters
    console.log('\n📝 Step 2/4: Business Parameters...');
    await seedBusinessParameters(AppDataSource);

    // 3. Plans and Addons
    console.log('\n📝 Step 3/4: Plans and Addons...');
    await seedPlansAndAddons(AppDataSource);

    // 4. Notification Templates (requires languages)
    console.log('\n📝 Step 4/4: Notification Templates...');
    await seedNotificationTemplates(AppDataSource);

    console.log('\n✅ All seeders completed successfully');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

runSeeders();
