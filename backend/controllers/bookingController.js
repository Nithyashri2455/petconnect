import db from '../config/database.js';

// Helper function to convert 12-hour time to 24-hour
const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier.toUpperCase() === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}:00`;
};

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { serviceId, bookingDate, bookingTime, petDetails, notes } = req.body;
        const userId = req.user.id;
        
        // Convert 12-hour time to 24-hour format for MySQL
        const time24h = convertTo24Hour(bookingTime);

        // Verify service exists
        const [services] = await db.query(
            'SELECT id, base_price FROM services WHERE id = ?',
            [serviceId]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const service = services[0];

        // Create booking
        const [result] = await db.query(
            `INSERT INTO bookings (user_id, service_id, booking_date, booking_time, total_price, notes, pet_details, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [userId, serviceId, bookingDate, time24h, service.base_price, notes || '', JSON.stringify(petDetails || null)]
        );

        // Get created booking with service details
        const [bookings] = await db.query(
            `SELECT b.*, 
                    s.name as service_name, 
                    s.type as service_type, 
                    s.location as service_location,
                    s.image_url as service_image
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE b.id = ?`,
            [result.insertId]
        );

        const booking = bookings[0];

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                id: booking.id,
                serviceId: booking.service_id,
                serviceName: booking.service_name,
                serviceType: booking.service_type,
                serviceLocation: booking.service_location,
                serviceImage: booking.service_image,
                bookingDate: booking.booking_date,
                bookingTime: bookingTime, // Return original 12-hour format
                totalPrice: parseFloat(booking.total_price),
                status: booking.status,
                petDetails: petDetails,
                notes: booking.notes,
                createdAt: booking.created_at
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        let query = `
            SELECT b.*, 
                   s.name as service_name, 
                   s.type as service_type, 
                   s.location as service_location,
                   s.image_url as service_image
            FROM bookings b
            LEFT JOIN services s ON b.service_id = s.id
            WHERE b.user_id = ?
        `;
        const params = [userId];

        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }

        query += ' ORDER BY b.booking_date DESC, b.booking_time DESC';

        const [bookings] = await db.query(query, params);

        const formattedBookings = bookings.map(booking => {
            // Convert 24-hour time back to 12-hour format for display
            let displayTime = booking.booking_time;
            if (booking.booking_time) {
                const timeStr = booking.booking_time.toString();
                const [hours, minutes] = timeStr.split(':');
                const hour = parseInt(hours, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                displayTime = `${displayHour}:${minutes} ${ampm}`;
            }
            
            return {
                id: booking.id,
                service_id: booking.service_id,
                booking_date: booking.booking_date,
                booking_time: displayTime,
                total_price: parseFloat(booking.total_price),
                status: booking.status,
                notes: booking.notes,
                pet_details: booking.pet_details,
                created_at: booking.created_at,
                service: booking.service_id ? {
                    id: booking.service_id,
                    name: booking.service_name,
                    type: booking.service_type,
                    location: booking.service_location,
                    image: booking.service_image
                } : null
            };
        });

        res.json({
            success: true,
            count: formattedBookings.length,
            data: formattedBookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Get single booking
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [bookings] = await db.query(
            `SELECT b.*, 
                    s.name as service_name, 
                    s.type as service_type, 
                    s.location as service_location,
                    s.image_url as service_image
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE b.id = ? AND b.user_id = ?`,
            [id, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[0];

        res.json({
            success: true,
            data: {
                id: booking.id,
                serviceId: booking.service_id,
                serviceName: booking.service_name,
                serviceType: booking.service_type,
                serviceLocation: booking.service_location,
                serviceImage: booking.service_image,
                bookingDate: booking.booking_date,
                bookingTime: booking.booking_time,
                totalPrice: parseFloat(booking.total_price),
                status: booking.status,
                notes: booking.notes,
                createdAt: booking.created_at
            }
        });
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if booking exists and belongs to user
        const [bookings] = await db.query(
            'SELECT id, status FROM bookings WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[0];

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed booking'
            });
        }

        // Update booking status
        await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['cancelled', id]
        );

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};
