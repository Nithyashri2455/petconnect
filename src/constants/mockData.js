/**
 * PAWCONNECT - MOCK DATA
 * Centralized data constants for services and events
 */

export const SERVICES = [
    {
        id: 1,
        name: "Happy Tails Grooming",
        type: "Grooming",
        rating: 4.8,
        reviews: 124,
        location: "Downtown, NY",
        lat: 40.7128,
        lng: -74.0060,
        priceRange: "$$",
        basePrice: 45,
        verified: true,
        petTypes: ["Dog", "Cat"],
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 2,
        name: "City Vet Hospital",
        type: "Veterinary",
        rating: 4.9,
        reviews: 350,
        location: "Brooklyn, NY",
        lat: 40.6782,
        lng: -73.9442,
        priceRange: "$$$",
        basePrice: 120,
        verified: true,
        petTypes: ["Dog", "Cat", "Bird"],
        image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: 3,
        name: "Paws & Play Training",
        type: "Training",
        rating: 4.7,
        reviews: 89,
        location: "Queens, NY",
        lat: 40.7282,
        lng: -73.7949,
        priceRange: "$$",
        basePrice: 65,
        verified: true,
        petTypes: ["Dog"],
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400",
    }
];

export const EVENTS = [
    {
        id: 101,
        title: "Annual Adoption Fair",
        date: "Oct 15, 2024",
        location: "Central Park",
        premiumOnly: false,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 102,
        title: "Golden Retriever Meetup",
        date: "Oct 20, 2024",
        location: "Riverside Park",
        premiumOnly: true,
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400"
    }
];

export const PET_OPTIONS = ['All', 'Dog', 'Cat', 'Bird'];
