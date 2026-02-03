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

// Fix broken markdown images (they were split across lines)
async function fixImageMarkdown() {
    try {
        console.log('🔧 Fixing broken markdown images...\n');

        const lessons = await Lesson.find({ title: /Email/i }).sort({ order: 1 });

        let fixedCount = 0;

        for (const lesson of lessons) {
            if (lesson.description && lesson.description.includes('![')) {
                // Fix broken markdown by joining lines
                let fixedDescription = lesson.description
                    // Remove line breaks between ![alt] and (url)
                    .replace(/!\[([^\]]*)\]\s*\n\s*\(([^)]+)\)/g, '![$1]($2)');

                if (fixedDescription !== lesson.description) {
                    await Lesson.updateOne(
                        { _id: lesson._id },
                        { $set: { description: fixedDescription } }
                    );
                    console.log(`✓ Fixed: ${lesson.title}`);
                    fixedCount++;
                } else {
                    console.log(`- No fix needed: ${lesson.title}`);
                }
            }
        }

        console.log(`\n✅ Fix complete!`);
        console.log(`   - ${fixedCount} lessons fixed\n`);

    } catch (error) {
        console.error('✗ Fix error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');
    }
}

// Main execution
(async () => {
    await connectDB();
    await fixImageMarkdown();
})();
