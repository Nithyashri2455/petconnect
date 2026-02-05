import db from './config/database.js';

async function updateSchema() {
    try {
        console.log('🔄 Updating database schema...\n');
        
        // Add pet_details column to bookings
        try {
            await db.query('ALTER TABLE bookings ADD COLUMN pet_details JSON AFTER notes');
            console.log('✅ Added pet_details column to bookings table');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  pet_details column already exists in bookings');
            } else {
                throw err;
            }
        }
        
        // Show current bookings schema
        const [bookingsSchema] = await db.query('DESCRIBE bookings');
        console.log('\n📋 Current bookings table schema:');
        console.table(bookingsSchema);
        
        await db.end();
        console.log('\n✅ Schema update complete!');
    } catch (error) {
        console.error('❌ Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
