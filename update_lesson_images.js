// Update lesson descriptions with correct image paths
require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

const connectDB = async () => {
    try {
        const db_user = process.env.DB_USER;
        const db_pass = encodeURIComponent(process.env.DB_PASS);
        const db_name = process.env.DB_NAME;

        const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
        await mongoose.connect(dbUri);
        console.log('✅ Connected to MongoDB\n');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const updateLessonImages = async () => {
    try {
        await connectDB();

        // Get all lessons for the email course
        const lessons = await Lesson.find({ title: /Email/i }).sort({ order: 1 });

        if (lessons.length === 0) {
            console.log('❌ No lessons found');
            process.exit(1);
        }

        console.log(`Found ${lessons.length} lessons to update\n`);

        // Update each lesson's description to use public paths
        for (const lesson of lessons) {
            const oldDescription = lesson.description;

            // Replace all local paths with public paths
            const newDescription = oldDescription.replace(
                /C:\/Users\/Amalitech\/\.gemini\/antigravity\/brain\/[^)]+\//g,
                '/uploads/course-images/'
            );

            if (oldDescription !== newDescription) {
                lesson.description = newDescription;
                await lesson.save();
                console.log(`✓ Updated: ${lesson.title}`);
            } else {
                console.log(`- No changes needed: ${lesson.title}`);
            }
        }

        console.log('\n✅ All lesson images updated successfully!');
        console.log('\n📸 Screenshots are now accessible at:');
        console.log('   http://localhost:3000/uploads/course-images/[filename].png');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateLessonImages();
