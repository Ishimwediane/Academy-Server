require('dotenv').config();
const mongoose = require('mongoose');

// Build MongoDB URI
const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

// Connect
const connectDB = async () => {
    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB\n');
};

const lessonSchema = new mongoose.Schema({}, { strict: false });
const Lesson = mongoose.model('Lesson', lessonSchema);

async function checkLessons() {
    try {
        await connectDB();

        const lessons = await Lesson.find({ title: /Email/i }).sort({ order: 1 });

        console.log(`Found ${lessons.length} lessons\n`);

        lessons.forEach((lesson, index) => {
            console.log(`${index + 1}. ${lesson.title}`);
            console.log(`   Order: ${lesson.order}`);
            console.log(`   Has imageUrl: ${lesson.imageUrl ? '✓' : '✗'}`);

            // Check if description has images
            const hasImages = lesson.description && lesson.description.includes('![');
            console.log(`   Has images in description: ${hasImages ? '✓' : '✗'}`);

            if (hasImages) {
                const imageCount = (lesson.description.match(/!\[/g) || []).length;
                console.log(`   Number of images: ${imageCount}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

checkLessons();
