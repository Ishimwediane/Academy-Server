require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const connectDB = async () => {
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✓ Connected\n');
};

const lessonSchema = new mongoose.Schema({}, { strict: false });
const Lesson = mongoose.model('Lesson', lessonSchema);

async function inspectDescription() {
    try {
        await connectDB();

        const lesson = await Lesson.findOne({ title: 'Gufungura Konti ya Email' });

        if (lesson && lesson.description) {
            console.log('=== DESCRIPTION CONTENT ===\n');
            console.log(lesson.description);
            console.log('\n=== END ===\n');

            // Show character codes around the image
            const screenshotIndex = lesson.description.indexOf('**Screenshots:**');
            if (screenshotIndex !== -1) {
                const snippet = lesson.description.substring(screenshotIndex, screenshotIndex + 200);
                console.log('Screenshot section (first 200 chars):');
                console.log(snippet);
                console.log('\nCharacter codes:');
                for (let i = 0; i < Math.min(snippet.length, 150); i++) {
                    if (snippet[i] === '\n') console.log(`[${i}]: \\n (newline)`);
                    else if (snippet[i] === '\r') console.log(`[${i}]: \\r (carriage return)`);
                    else if (snippet[i] === '!') console.log(`[${i}]: ${snippet[i]} (exclamation)`);
                    else if (snippet[i] === '[') console.log(`[${i}]: ${snippet[i]} (open bracket)`);
                    else if (snippet[i] === ']') console.log(`[${i}]: ${snippet[i]} (close bracket)`);
                    else if (snippet[i] === '(') console.log(`[${i}]: ${snippet[i]} (open paren)`);
                }
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

inspectDescription();
