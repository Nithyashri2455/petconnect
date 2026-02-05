import db from './config/database.js';
import bcrypt from 'bcryptjs';

async function enhanceDatabase() {
    try {
        console.log('🔄 Enhancing database for OAuth and more users...\n');
        
        // Add OAuth columns
        try {
            await db.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE AFTER email');
            console.log('✅ Added google_id column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  google_id column already exists');
            } else {
                throw err;
            }
        }
        
        try {
            await db.query('ALTER TABLE users ADD COLUMN auth_provider ENUM("local", "google") DEFAULT "local" AFTER google_id');
            console.log('✅ Added auth_provider column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  auth_provider column already exists');
            } else {
                throw err;
            }
        }
        
        try {
            await db.query('ALTER TABLE users ADD COLUMN avatar_url TEXT AFTER auth_provider');
            console.log('✅ Added avatar_url column');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️  avatar_url column already exists');
            } else {
                throw err;
            }
        }
        
        // Make password nullable for OAuth users
        try {
            await db.query('ALTER TABLE users MODIFY password VARCHAR(255) NULL');
            console.log('✅ Made password column nullable for OAuth users');
        } catch (err) {
            console.log('ℹ️  Password column already nullable');
        }
        
        console.log('\n📝 Adding more sample users...\n');
        
        // Hash passwords for new users
        const passwords = {
            user123: await bcrypt.hash('user123', 10),
            demo123: await bcrypt.hash('demo123', 10),
            test123: await bcrypt.hash('test123', 10),
            pet123: await bcrypt.hash('pet123', 10),
            paw123: await bcrypt.hash('paw123', 10),
        };
        
        // Add more diverse sample users
        await db.query(`
            INSERT INTO users (name, email, password, is_premium, auth_provider)
            VALUES 
            ('Jessica Martinez', 'jessica@pawconnect.com', ?, true, 'local'),
            ('David Chen', 'david@petcare.com', ?, false, 'local'),
            ('Rachel Green', 'rachel@doglovers.com', ?, true, 'local'),
            ('Tom Anderson', 'tom@catowner.com', ?, false, 'local'),
            ('Lisa Robinson', 'lisa@premium.pet', ?, true, 'local'),
            ('James Parker', 'james@user.pet', ?, false, 'local'),
            ('Maria Garcia', 'maria@pawpremium.com', ?, true, 'local'),
            ('Chris Taylor', 'chris@freeuser.com', ?, false, 'local')
            ON DUPLICATE KEY UPDATE id=id
        `, [
            passwords.user123,
            passwords.demo123,
            passwords.user123,
            passwords.test123,
            passwords.user123,
            passwords.demo123,
            passwords.paw123,
            passwords.pet123
        ]);
        
        console.log('✅ Added 8 additional users\n');
        
        // Show all users
        const [users] = await db.query('SELECT id, name, email, is_premium, auth_provider FROM users ORDER BY id');
        console.log('📋 Current Users in Database:\n');
        console.table(users);
        
        console.log('\n🔑 User Credentials:\n');
        console.log('PREMIUM USERS:');
        console.log('  alex@pawpremium.com / premium123');
        console.log('  emma@premium.com / premium123');
        console.log('  sarah@premium.com / premium123');
        console.log('  jessica@pawconnect.com / user123');
        console.log('  rachel@doglovers.com / user123');
        console.log('  lisa@premium.pet / user123');
        console.log('  maria@pawpremium.com / paw123\n');
        
        console.log('FREE USERS:');
        console.log('  sam@petlover.com / free123');
        console.log('  mike@user.com / free123');
        console.log('  david@petcare.com / demo123');
        console.log('  tom@catowner.com / test123');
        console.log('  james@user.pet / demo123');
        console.log('  chris@freeuser.com / pet123\n');
        
        await db.end();
        console.log('✅ Database enhancement complete!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

enhanceDatabase();
