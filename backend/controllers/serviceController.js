import db from '../config/database.js';

// Get all services with filters
export const getServices = async (req, res) => {
    try {
        const { search, petType, type, minRating } = req.query;
        
        let query = 'SELECT * FROM services WHERE 1=1';
        const params = [];

        // Search filter
        if (search) {
            query += ' AND (name LIKE ? OR type LIKE ? OR location LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        // Pet type filter
        if (petType && petType !== 'All') {
            query += ' AND JSON_CONTAINS(pet_types, ?)';
            params.push(JSON.stringify(petType));
        }

        // Service type filter
        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        // Minimum rating filter
        if (minRating) {
            query += ' AND rating >= ?';
            params.push(parseFloat(minRating));
        }

        query += ' ORDER BY rating DESC, reviews DESC';

        const [services] = await db.query(query, params);

        // Parse JSON fields
        const formattedServices = services.map(service => ({
            id: service.id,
            name: service.name,
            type: service.type,
            rating: parseFloat(service.rating),
            reviews: service.reviews,
            location: service.location,
            lat: parseFloat(service.latitude),
            lng: parseFloat(service.longitude),
            priceRange: service.price_range,
            basePrice: parseFloat(service.base_price),
            verified: Boolean(service.verified),
            petTypes: typeof service.pet_types === 'string' ? JSON.parse(service.pet_types) : service.pet_types,
            image: service.image_url,
            description: service.description
        }));

        res.json({
            success: true,
            count: formattedServices.length,
            data: formattedServices
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
};

// Get single service by ID
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const [services] = await db.query(
            'SELECT * FROM services WHERE id = ?',
            [id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const service = services[0];
        const formattedService = {
            id: service.id,
            name: service.name,
            type: service.type,
            rating: parseFloat(service.rating),
            reviews: service.reviews,
            location: service.location,
            lat: parseFloat(service.latitude),
            lng: parseFloat(service.longitude),
            priceRange: service.price_range,
            basePrice: parseFloat(service.base_price),
            verified: Boolean(service.verified),
            petTypes: typeof service.pet_types === 'string' ? JSON.parse(service.pet_types) : service.pet_types,
            image: service.image_url,
            description: service.description
        };

        res.json({
            success: true,
            data: formattedService
        });
    } catch (error) {
        console.error('Get service by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching service',
            error: error.message
        });
    }
};

// Create new service (admin only - simplified for now)
export const createService = async (req, res) => {
    try {
        const {
            name,
            type,
            location,
            latitude,
            longitude,
            priceRange,
            basePrice,
            petTypes,
            imageUrl,
            description
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO services 
            (name, type, location, latitude, longitude, price_range, base_price, pet_types, image_url, description, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
            [
                name,
                type,
                location,
                latitude,
                longitude,
                priceRange,
                basePrice,
                JSON.stringify(petTypes),
                imageUrl,
                description
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating service',
            error: error.message
        });
    }
};
