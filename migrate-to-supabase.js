// Data migration script
// Run this once to populate Supabase with your existing content.json data

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load content.json
const contentPath = path.join(__dirname, 'src/data/content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

// Get Supabase credentials from command line or environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.argv[2];
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.argv[3];

if (!supabaseUrl || !supabaseKey) {
    console.error('Usage: node migrate-to-supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
    console.error('Or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('Starting migration...\n');

    // Migrate coaches
    console.log('Migrating coaches...');
    const { error: coachesError } = await supabase
        .from('coaches')
        .insert(content.coaches);

    if (coachesError) {
        console.error('  Error:', coachesError.message);
    } else {
        console.log(`  ✓ ${content.coaches.length} coaches migrated`);
    }

    // Migrate gallery
    console.log('Migrating gallery...');
    const { error: galleryError } = await supabase
        .from('gallery')
        .insert(content.gallery);

    if (galleryError) {
        console.error('  Error:', galleryError.message);
    } else {
        console.log(`  ✓ ${content.gallery.length} gallery items migrated`);
    }

    // Migrate schedule
    console.log('Migrating schedule...');
    const scheduleItems = [];

    Object.entries(content.schedule).forEach(([location, days]) => {
        Object.entries(days).forEach(([day, slots]) => {
            slots.forEach((slot) => {
                scheduleItems.push({
                    location,
                    day,
                    time: slot.time,
                    group_name: slot.group,
                });
            });
        });
    });

    const { error: scheduleError } = await supabase
        .from('schedule')
        .insert(scheduleItems);

    if (scheduleError) {
        console.error('  Error:', scheduleError.message);
    } else {
        console.log(`  ✓ ${scheduleItems.length} schedule items migrated`);
    }

    // Migrate programs
    console.log('Migrating programs...');
    const { error: programsError } = await supabase
        .from('programs')
        .insert(content.programs);

    if (programsError) {
        console.error('  Error:', programsError.message);
    } else {
        console.log(`  ✓ ${content.programs.length} programs migrated`);
    }

    console.log('\nMigration complete!');
}

migrate().catch(console.error);
