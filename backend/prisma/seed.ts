import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding StayOs database...');

    // --- Admin User ---
    const hashedPassword = await bcrypt.hash('stayos-admin-2026', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@stayos.in' },
        update: {},
        create: {
            email: 'admin@stayos.in',
            password: hashedPassword,
            firstName: 'StayOs',
            lastName: 'Admin',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // --- Neighborhoods ---
    const neighborhoods = ['Indiranagar', 'Koramangala', 'HSR Layout', 'Ulsoor', 'Bellandur', 'Hebbal'];
    for (const name of neighborhoods) {
        await prisma.neighborhood.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log('✅ Neighborhoods seeded');

    // --- Properties ---
    const properties = [
        {
            name: 'Muse',
            location: 'Ulsoor',
            neighborhood: 'Ulsoor',
            sqft: 1700,
            bhk: 2,
            price: 35000,
            status: 'AVAILABLE' as const,
            availableDate: 'Available Now',
            availableRooms: '2/2 Available',
            totalRooms: 2,
            isFemaleOnly: false,
            occupancyDescription: "You'll be the first occupant in this house",
            amenities: 'WiFi,AC,Microwave,Washing Machine,Furnished',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200', alt: 'Muse - Ulsoor', isPrimary: true }] },
        },
        {
            name: 'Classical Indian Condo',
            location: 'Bellandur',
            neighborhood: 'Bellandur',
            sqft: 2200,
            bhk: 3,
            price: 33000,
            status: 'AVAILABLE' as const,
            availableDate: 'Available Now',
            availableRooms: '1/3 Available',
            totalRooms: 3,
            isFemaleOnly: true,
            amenities: 'WiFi,AC,Microwave,Washing Machine,Furnished,Security',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200', alt: 'Classical Indian Condo - Bellandur', isPrimary: true }] },
        },
        {
            name: 'Raintree',
            location: 'Hebbal',
            neighborhood: 'Hebbal',
            sqft: 2500,
            bhk: 3,
            price: 30000,
            status: 'AVAILABLE' as const,
            availableDate: 'Available Now',
            availableRooms: '1/3 Available',
            totalRooms: 3,
            isFemaleOnly: false,
            occupancyDescription: 'Flatmates from',
            amenities: 'WiFi,AC,Furnished,Parking,Gym Access',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', alt: 'Raintree - Hebbal', isPrimary: true }] },
        },
        {
            name: 'Halo',
            location: 'Indiranagar',
            neighborhood: 'Indiranagar',
            sqft: 2100,
            bhk: 3,
            price: 42000,
            status: 'FULLY_BOOKED' as const,
            availableDate: 'Available Now',
            availableRooms: 'Fully Booked',
            totalRooms: 3,
            isFemaleOnly: false,
            amenities: 'WiFi,AC,Microwave,Washing Machine,Furnished,Premium Interiors',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=1200', alt: 'Halo - Indiranagar', isPrimary: true }] },
        },
        {
            name: 'Prism',
            location: 'Koramangala',
            neighborhood: 'Koramangala',
            sqft: 1900,
            bhk: 2,
            price: 38000,
            status: 'COMING_SOON' as const,
            availableDate: 'April 2026',
            availableRooms: 'Coming Soon',
            totalRooms: 2,
            isFemaleOnly: false,
            amenities: 'WiFi,AC,Furnished,Rooftop Access',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1200', alt: 'Prism - Koramangala', isPrimary: true }] },
        },
        {
            name: 'Meridian',
            location: 'HSR Layout',
            neighborhood: 'HSR Layout',
            sqft: 2800,
            bhk: 4,
            price: 55000,
            status: 'COMING_SOON' as const,
            availableDate: 'May 2026',
            availableRooms: 'Coming Soon',
            totalRooms: 4,
            isFemaleOnly: false,
            amenities: 'WiFi,AC,Microwave,Washing Machine,Furnished,Pool,Gym',
            images: { create: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200', alt: 'Meridian - HSR Layout', isPrimary: true }] },
        },
    ];

    for (const prop of properties) {
        const existing = await prisma.property.findFirst({ where: { name: prop.name } });
        if (!existing) {
            await prisma.property.create({ data: prop });
        }
    }
    console.log('✅ Properties seeded');

    // --- Blog Posts ---
    const blogs = [
        {
            title: 'Why Bengaluru\'s Rental Market is Broken (And How We\'re Fixing It)',
            slug: 'bengaluru-rental-market-broken',
            excerpt: 'High deposits, unverified listings, and hidden broker fees. We analysed 1,000+ rental transactions to show you exactly where the friction is.',
            content: 'Full content here...',
            coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
            category: 'Market Analysis',
            author: 'StayOs Editorial',
            tags: 'rental,bengaluru,real-estate',
            published: true,
            publishedAt: new Date('2026-02-10'),
        },
        {
            title: 'The Ultimate Guide to Furnished Apartments in Indiranagar',
            slug: 'guide-furnished-apartments-indiranagar',
            excerpt: 'Everything you need to know before renting a fully furnished flat in one of Bengaluru\'s most sought-after neighbourhoods.',
            content: 'Full content here...',
            coverImage: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1200',
            category: 'City Guide',
            author: 'StayOs Editorial',
            tags: 'indiranagar,furnished,guide',
            published: true,
            publishedAt: new Date('2026-01-25'),
        },
        {
            title: '5 Interior Principles We Use in Every StayOs Home',
            slug: '5-interior-principles-stayos',
            excerpt: 'From the 60-30-10 colour rule to the strategic use of negative space — here\'s how we design homes that feel like home.',
            content: 'Full content here...',
            coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
            category: 'Design',
            author: 'StayOs Editorial',
            tags: 'interior,design,decor',
            published: true,
            publishedAt: new Date('2026-01-12'),
        },
    ];

    for (const blog of blogs) {
        await prisma.blogPost.upsert({
            where: { slug: blog.slug },
            update: {},
            create: blog,
        });
    }
    console.log('✅ Blog posts seeded');

    // --- Career Jobs ---
    const jobs = [
        {
            title: 'Senior Software Engineer',
            department: 'Engineering',
            location: 'Bengaluru, India',
            type: 'Full-time',
            experience: '3-5 years',
            description: 'Build and scale the StayOs platform. Work on everything from our tenant app to our property management backend.',
            requirements: 'React, Node.js, TypeScript, PostgreSQL, 3+ years experience',
            isActive: true,
        },
        {
            title: 'Interior Design Associate',
            department: 'Design',
            location: 'Bengaluru, India',
            type: 'Full-time',
            experience: '2-4 years',
            description: 'Curate and design spaces for our premium property portfolio across Bengaluru.',
            requirements: 'Interior Design degree, AutoCAD, 2+ years experience in residential design',
            isActive: true,
        },
        {
            title: 'City Operations Manager',
            department: 'Operations',
            location: 'Bengaluru, India',
            type: 'Full-time',
            experience: '4-6 years',
            description: 'Oversee end-to-end property operations, maintenance, and tenant experience.',
            requirements: 'Operations management, Property/Real estate background, Team leadership',
            isActive: true,
        },
        {
            title: 'Growth Marketing Lead',
            department: 'Marketing',
            location: 'Bengaluru, India (Remote-friendly)',
            type: 'Full-time',
            experience: '3-5 years',
            description: 'Drive tenant and landlord acquisition through performance marketing, SEO, and community-led growth.',
            requirements: 'Google Ads, Meta Ads, SEO, Analytics, startup experience preferred',
            isActive: true,
        },
    ];

    for (const job of jobs) {
        const existing = await prisma.careerJob.findFirst({ where: { title: job.title } });
        if (!existing) {
            await prisma.careerJob.create({ data: job });
        }
    }
    console.log('✅ Career jobs seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin login: admin@stayos.in');
    console.log('🔑 Admin password: stayos-admin-2026');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
