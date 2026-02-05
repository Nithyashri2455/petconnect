import db from '../config/database.js';

// Get all events
export const getEvents = async (req, res) => {
    try {
        const { premiumOnly } = req.query;
        const isPremium = req.user?.isPremium || false;

        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        // If user is not premium, exclude premium-only events
        if (!isPremium) {
            query += ' AND premium_only = false';
        }

        // Filter by premium status if specified
        if (premiumOnly !== undefined) {
            query += ' AND premium_only = ?';
            params.push(premiumOnly === 'true');
        }

        query += ' ORDER BY date ASC';

        const [events] = await db.query(query, params);

        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            date: event.date,
            location: event.location,
            premiumOnly: Boolean(event.premium_only),
            image: event.image_url,
            description: event.description
        }));

        res.json({
            success: true,
            count: formattedEvents.length,
            data: formattedEvents
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

// Get single event by ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const isPremium = req.user?.isPremium || false;

        const [events] = await db.query(
            'SELECT * FROM events WHERE id = ?',
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const event = events[0];

        // Check if user has access to premium event
        if (event.premium_only && !isPremium) {
            return res.status(403).json({
                success: false,
                message: 'This event is only available for premium members'
            });
        }

        const formattedEvent = {
            id: event.id,
            title: event.title,
            date: event.date,
            location: event.location,
            premiumOnly: Boolean(event.premium_only),
            image: event.image_url,
            description: event.description
        };

        res.json({
            success: true,
            data: formattedEvent
        });
    } catch (error) {
        console.error('Get event by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
};

// Create new event (admin only - simplified for now)
export const createEvent = async (req, res) => {
    try {
        const { title, date, location, premiumOnly, imageUrl, description } = req.body;

        const [result] = await db.query(
            `INSERT INTO events (title, date, location, premium_only, image_url, description)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [title, date, location, premiumOnly || false, imageUrl, description]
        );

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};
