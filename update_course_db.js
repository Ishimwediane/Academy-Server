require('dotenv').config();
const mongoose = require('mongoose');

// Build MongoDB URI from environment variables (same as server)
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

// Define Course schema (minimal version)
const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema);

// Update course function
async function updateCourse() {
    try {
        console.log('📚 Finding "Isomo rya Email" course...');

        const course = await Course.findOne({
            title: { $regex: /Isomo rya Email/i }
        });

        if (!course) {
            console.error('✗ Course not found!');
            console.log('Available courses:');
            const allCourses = await Course.find({}, 'title');
            allCourses.forEach(c => console.log(`  - ${c.title}`));
            process.exit(1);
        }

        console.log(`✓ Found course: ${course.title}`);
        console.log(`  ID: ${course._id}\n`);

        console.log('📝 Updating course with learning outcomes...');

        // Update the course
        const result = await Course.updateOne(
            { _id: course._id },
            {
                $set: {
                    whatYouWillLearn: [
                        'Gufungura konti ya Gmail',
                        'Kohereza no kwakira email',
                        'Kurinda konti yawe n\'ijambo ry\'ibanga rikomeye',
                        'Kumenya email z\'uburiganya (phishing)',
                        'Kwandika email y\'umwuga',
                        'Gukoresha attachments'
                    ],
                    learningObjectives: [
                        'Kumenya icyo email ari cyo n\'akamaro kayo',
                        'Gufungura no kurinda konti ya Gmail',
                        'Kohereza no kwakira email mu buryo bwizewe',
                        'Kumenya no kwirinda email z\'uburiganya',
                        'Kwandika email y\'umwuga',
                        'Gukoresha attachments neza'
                    ],
                    instructorBio: 'Diane Ishimwe ni umwarimu w\'ikoranabuhanga akaba yarafashije abantu barenga 1000 kwiga gukoresha email n\'ibindi bikoresho bya interineti. Afite uburambe bw\'imyaka 5 mu kwigisha tekinoloji mu Kinyarwanda.',
                    courseOutcome: 'Nyuma y\'iri somo, uzaba ushobora gufungura konti ya email, kohereza no kwakira email, kurinda konti yawe, no kwandika email y\'umwuga. Uzaba ufite ubumenyi bwose bwo gukoresha email mu buzima bwawe bwa buri munsi no mu kazi.',
                    shortDescription: 'Wiga ibanze byose bya email mu Kinyarwanda - kuva gufungura konti kugeza ku kwandika email y\'umwuga'
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log('✓ Course updated successfully!\n');
            console.log('Added:');
            console.log('  ✓ 6 learning outcomes (What You\'ll Learn)');
            console.log('  ✓ 6 learning objectives');
            console.log('  ✓ Instructor bio');
            console.log('  ✓ Course outcome');
            console.log('  ✓ Short description');

            // Verify the update
            const updatedCourse = await Course.findById(course._id);
            console.log('\n📊 Verification:');
            console.log(`  - Learning outcomes: ${updatedCourse.whatYouWillLearn?.length || 0} items`);
            console.log(`  - Learning objectives: ${updatedCourse.learningObjectives?.length || 0} items`);
            console.log(`  - Instructor bio: ${updatedCourse.instructorBio ? '✓' : '✗'}`);
            console.log(`  - Course outcome: ${updatedCourse.courseOutcome ? '✓' : '✗'}`);
            console.log(`  - Short description: ${updatedCourse.shortDescription ? '✓' : '✗'}`);
        } else {
            console.log('⚠ No changes made (data might already exist)');
        }

        console.log('\n✅ Update complete!');
        console.log('🎉 The "Isomo rya Email" course is now fully configured!');
        console.log('📱 You can view it on the frontend now.');

    } catch (error) {
        console.error('✗ Update error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
}

// Main execution
(async () => {
    await connectDB();
    await updateCourse();
})();
