import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
    let connection;
    
    try {
        // Connect to MySQL server without specifying database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log('📡 Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_premium BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created');

        // Create services table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type ENUM('Grooming', 'Veterinary', 'Training', 'Boarding', 'Walking') NOT NULL,
                rating DECIMAL(2,1) DEFAULT 0,
                reviews INT DEFAULT 0,
                location VARCHAR(255) NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                price_range ENUM('$', '$$', '$$$') NOT NULL,
                base_price DECIMAL(10, 2) NOT NULL,
                verified BOOLEAN DEFAULT false,
                pet_types JSON NOT NULL,
                image_url TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Services table created');

        // Create events table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                location VARCHAR(255) NOT NULL,
                premium_only BOOLEAN DEFAULT false,
                image_url TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Events table created');

        // Create bookings table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                service_id INT NOT NULL,
                booking_date DATE NOT NULL,
                booking_time TIME NOT NULL,
                status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
                total_price DECIMAL(10, 2) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Bookings table created');

        // Create payments table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                booking_id INT,
                amount DECIMAL(10, 2) NOT NULL,
                payment_type ENUM('booking', 'premium_upgrade') NOT NULL,
                payment_method VARCHAR(50),
                transaction_id VARCHAR(255),
                status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Payments table created');

        // Insert sample services
        await connection.query(`
            INSERT INTO services (name, type, rating, reviews, location, latitude, longitude, price_range, base_price, verified, pet_types, image_url, description)
            VALUES 
            ('Happy Tails Grooming', 'Grooming', 4.8, 124, 'Downtown, NY', 40.7128, -74.0060, '$$', 45.00, true, '["Dog", "Cat"]', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400', 'Professional grooming services for your beloved pets'),
            ('City Vet Hospital', 'Veterinary', 4.9, 350, 'Brooklyn, NY', 40.6782, -73.9442, '$$$', 120.00, true, '["Dog", "Cat", "Bird"]', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400', 'Comprehensive veterinary care with experienced staff'),
            ('Paws & Play Training', 'Training', 4.7, 89, 'Queens, NY', 40.7282, -73.7949, '$$', 65.00, true, '["Dog"]', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400', 'Expert dog training for all breeds and ages'),
            ('Pet Paradise Boarding', 'Boarding', 4.6, 203, 'Manhattan, NY', 40.7589, -73.9851, '$$$', 85.00, true, '["Dog", "Cat"]', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400', 'Luxury boarding facilities with 24/7 care'),
            ('Walk & Wag', 'Walking', 4.5, 156, 'Bronx, NY', 40.8448, -73.8648, '$', 30.00, true, '["Dog"]', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400', 'Professional dog walking services')
            ON DUPLICATE KEY UPDATE id=id
        `);
        console.log('✅ Sample services inserted');

        // Insert sample events
        await connection.query(`
            INSERT INTO events (title, date, location, premium_only, image_url, description)
            VALUES 
            ('Annual Adoption Fair', '2026-10-15', 'Central Park', false, 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=400', 'Find your perfect furry companion'),
            ('Golden Retriever Meetup', '2026-10-20', 'Riverside Park', true, 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400', 'Exclusive event for Golden Retriever owners'),
            ('Pet Health Workshop', '2026-11-05', 'Community Center', false, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400', 'Learn about pet health and nutrition'),
            ('Premium Members Gala', '2026-11-12', 'Grand Hotel', true, 'https://images.unsplash.com/photo-1587767119446-d8f635e6dd08?auto=format&fit=crop&q=80&w=400', 'Exclusive networking event for premium members')
            ON DUPLICATE KEY UPDATE id=id
        `);
        console.log('✅ Sample events inserted');

        // Hash passwords for sample users
        const password1 = await bcrypt.hash('password123', 10);
        const password2 = await bcrypt.hash('premium123', 10);
        const password3 = await bcrypt.hash('free123', 10);

        // Insert sample users
        await connection.query(`
            INSERT INTO users (name, email, password, is_premium)
            VALUES 
            ('Alex Johnson', 'alex@pawpremium.com', ?, true),
            ('Sam Taylor', 'sam@petlover.com', ?, false),
            ('Emma Davis', 'emma@premium.com', ?, true),
            ('Mike Wilson', 'mike@user.com', ?, false),
            ('Sarah Brown', 'sarah@premium.com', ?, true)
            ON DUPLICATE KEY UPDATE id=id
        `, [password2, password3, password2, password3, password2]);
        console.log('✅ Sample users inserted');

        // Insert sample bookings (for premium users)
        await connection.query(`
            INSERT INTO bookings (user_id, service_id, booking_date, booking_time, status, total_price, notes)
            VALUES 
            (1, 1, '2026-02-10', '10:00:00', 'confirmed', 45.00, 'First grooming appointment for my golden retriever'),
            (1, 2, '2026-02-12', '14:30:00', 'confirmed', 120.00, 'Annual checkup'),
            (3, 3, '2026-02-15', '09:00:00', 'confirmed', 65.00, 'Basic obedience training'),
            (3, 4, '2026-02-20', '16:00:00', 'pending', 85.00, 'Weekend boarding'),
            (5, 5, '2026-02-08', '08:00:00', 'completed', 30.00, 'Morning walk'),
            (5, 1, '2026-02-18', '11:00:00', 'confirmed', 45.00, 'Full grooming service'),
            (1, 3, '2026-01-25', '10:30:00', 'completed', 65.00, 'Puppy training session'),
            (3, 2, '2026-01-28', '15:00:00', 'completed', 120.00, 'Vaccination appointment')
            ON DUPLICATE KEY UPDATE id=id
        `);
        console.log('✅ Sample bookings inserted');

        // Insert sample payments
        await connection.query(`
            INSERT INTO payments (user_id, booking_id, amount, payment_type, payment_method, transaction_id, status)
            VALUES 
            (1, 1, 45.00, 'booking', 'card', 'TXN1707145200001', 'completed'),
            (1, 2, 120.00, 'booking', 'card', 'TXN1707145200002', 'completed'),
            (3, 3, 65.00, 'booking', 'card', 'TXN1707145200003', 'completed'),
            (3, 4, 85.00, 'booking', 'card', 'TXN1707145200004', 'pending'),
            (5, 5, 30.00, 'booking', 'card', 'TXN1707145200005', 'completed'),
            (5, 6, 45.00, 'booking', 'card', 'TXN1707145200006', 'completed'),
            (1, NULL, 49.99, 'premium_upgrade', 'card', 'TXN1707145200007', 'completed'),
            (3, NULL, 49.99, 'premium_upgrade', 'card', 'TXN1707145200008', 'completed'),
            (5, NULL, 49.99, 'premium_upgrade', 'card', 'TXN1707145200009', 'completed'),
            (1, 7, 65.00, 'booking', 'card', 'TXN1707145200010', 'completed'),
            (3, 8, 120.00, 'booking', 'card', 'TXN1707145200011', 'completed')
            ON DUPLICATE KEY UPDATE id=id
        `);
        console.log('✅ Sample payments inserted');

        console.log('\n🎉 Database initialization completed successfully!');
        console.log('📝 Sample data summary:');
        console.log('   👥 5 Users (3 premium, 2 free)');
        console.log('   🏢 5 Services');
        console.log('   📅 4 Events');
        console.log('   📋 8 Bookings');
        console.log('   💳 11 Payments');
        console.log('\n📝 Test Accounts:');
        console.log('   Premium: alex@pawpremium.com / password: premium123');
        console.log('   Free:    sam@petlover.com / password: free123');
        console.log('\n🚀 You can now start the server with: npm run dev\n');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run initialization
initDatabase();
