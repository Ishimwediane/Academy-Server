require('dotenv').config();
const mongoose = require('mongoose');

// Build MongoDB URI from environment variables
const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;

if (!db_user || !db_pass || !db_name) {
    console.error('❌ Missing database credentials in .env file');
    process.exit(1);
}

const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ Connected to MongoDB\n');
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Define Lesson schema
const lessonSchema = new mongoose.Schema({}, { strict: false });
const Lesson = mongoose.model('Lesson', lessonSchema);

// Map images to lessons based on content
const lessonImageMapping = [
    {
        title: 'Email ni iki?',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/gmail_homepage_1770046905287_an4n5q.jpg',
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/email_address_parts_1770046969260_l22sll.jpg'
        ]
    },
    {
        title: 'Gufungura Konti ya Email',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/gmail_create_account_1770046920357_yrnt5d.jpg'
        ]
    },
    {
        title: 'Kohereza Email',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/gmail_compose_email_1770046935722_iqb23c.jpg',
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/gmail_attachment_1770047179218_fyatri.jpg'
        ]
    },
    {
        title: 'Kwakira no Gusoma Email',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/gmail_inbox_1770046954014_bnuttz.jpg',
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/gmail_reply_forward_1770046987186_o21bsp.jpg'
        ]
    },
    {
        title: 'Umutekano wa Email',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135404/gmail_security_settings_1770047198024_eako8o.jpg',
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/phishing_email_example_1770047250255_sfd5hl.jpg'
        ]
    },
    {
        title: 'Imyitwarire Myiza mu Email',
        images: [
            'https://res.cloudinary.com/dfe7ue90j/image/upload/v1770135403/gmail_compose_email_1770046935722_iqb23c.jpg'
        ]
    }
];

// Update lessons with image URLs
async function updateLessonImages() {
    try {
        console.log('📚 Updating lessons with Cloudinary images...\n');

        let updatedCount = 0;

        for (const mapping of lessonImageMapping) {
            const lesson = await Lesson.findOne({ title: mapping.title });

            if (lesson) {
                // Add images to description as markdown
                let updatedDescription = lesson.description || '';

                // Add images at the end of description
                updatedDescription += '\n\n**Screenshots:**\n';
                mapping.images.forEach((imageUrl, index) => {
                    updatedDescription += `\n![Screenshot ${index + 1}](${imageUrl})\n`;
                });

                await Lesson.updateOne(
                    { _id: lesson._id },
                    {
                        $set: {
                            description: updatedDescription,
                            imageUrl: mapping.images[0] // Set first image as main image
                        }
                    }
                );

                console.log(`✓ Updated: ${lesson.title}`);
                console.log(`  Added ${mapping.images.length} image(s)\n`);
                updatedCount++;
            } else {
                console.log(`⚠ Lesson not found: ${mapping.title}\n`);
            }
        }

        console.log(`\n✅ Update complete!`);
        console.log(`   - ${updatedCount} lessons updated with Cloudinary images`);
        console.log(`   - Total images added: ${lessonImageMapping.reduce((sum, m) => sum + m.images.length, 0)}\n`);

    } catch (error) {
        console.error('✗ Update error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Main execution
(async () => {
    await connectDB();
    await updateLessonImages();
})();
