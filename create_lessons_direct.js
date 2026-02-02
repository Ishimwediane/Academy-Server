// Direct MongoDB script to create lessons for Kinyarwanda Email Course
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const User = require('./models/User');

const connectDB = async () => {
    try {
        const db_user = process.env.DB_USER;
        const db_pass = encodeURIComponent(process.env.DB_PASS);
        const db_name = process.env.DB_NAME;

        const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const createLessons = async () => {
    try {
        await connectDB();

        // Find the trainer
        const trainer = await User.findOne({ email: 'ishimwediane@gmail.com' });
        if (!trainer) {
            console.error('❌ Trainer not found!');
            process.exit(1);
        }
        console.log('✓ Found trainer:', trainer.email);

        // Find the course - search for any course by this trainer with "Email" in title
        let course = await Course.findOne({
            title: /Email/i,
            trainer: trainer._id
        });

        // If not found, get the most recent course by this trainer
        if (!course) {
            course = await Course.findOne({ trainer: trainer._id }).sort({ createdAt: -1 });
        }

        if (!course) {
            console.error('❌ Course not found!');
            console.log('Please create the course first through the UI.');
            process.exit(1);
        }
        console.log('✓ Found course:', course.title);
        console.log('  Course ID:', course._id);
        console.log('  Language:', course.language);

        // Delete existing lessons for this course (if any)
        await Lesson.deleteMany({ course: course._id });
        console.log('✓ Cleared existing lessons\n');

        // Image base path
        const imagePath = 'C:/Users/Amalitech/.gemini/antigravity/brain/fa3caa69-0ba8-41b8-897a-debeff23116c';

        // Lesson data with images
        const lessons = [
            {
                title: 'Email ni iki?',
                description: `Email ni uburyo bwo kohereza ubutumwa binyuze kuri interineti. Ni nk'ibaruwa, ariko ikohererezwa vuba kandi igera mu gihe gito.

**Ibyo uziga / What you'll learn:**
- Email ni iki? (What is email?)
- Impamvu email ari ingenzi (Why email is important)
- Itandukaniro hagati ya email na SMS (Difference between email and SMS)
- Ibice by'aderesi ya email (Parts of an email address)

**Ibice by'Aderesi ya Email:**

![Email Address Parts](${imagePath}/email_address_parts_1770046969260.png)

- **Username (Amazina):** Ni izina ryawe cyangwa igihanga wakoresheje
- **@ Symbol (Ikimenyetso):** Ni ikimenyetso gikomeye kigomba kuboneka muri buri email
- **Domain (Serivisi):** Ni serivisi ukoresha (gmail.com, yahoo.com, etc.)

**Ingero / Examples:**
- jean@gmail.com
- marie@yahoo.com
- ishimwe@outlook.com`,
                duration: 15,
                order: 1,
                course: course._id,
                videoUrl: '',
                materials: []
            },
            {
                title: 'Gufungura Konti ya Email',
                description: `Uyu munsi tuziga gufungura konti ya Gmail. Ni byoroshye, uzabikora mu minota 5 gusa!

**Ibyo uziga / What you'll learn:**
- Guhitamo serivisi ya email
- Gufungura konti ya Gmail
- Guhitamo ijambo ry'ibanga rikomeye
- Kwemeza konti yawe

**Intambwe za Mbere:**

![Gmail Homepage](${imagePath}/gmail_homepage_1770046905287.png)

**Intambwe kuri kuri / Step by Step:**

1. **Jya kuri gmail.com** - Fungura interineti ukande kuri gmail.com
2. **Kanda "Create account"** - Uzabona buto y'ubururu

![Create Account Form](${imagePath}/gmail_create_account_1770046920357.png)

3. **Uzuza amazina yawe:**
   - First name: Izina ryawe rya mbere
   - Last name: Izina rya kabiri
   
4. **Hitamo aderesi ya email:**
   - Andika izina ushaka (example: jean.uwase)
   - Izajya @gmail.com

5. **Shiraho ijambo ry'ibanga:**
   - Koresha inyuguti nini n'ntoya
   - Ongeraho imibare
   - Koresha nibura inyuguti 8

6. **Emeza nimero ya telefoni yawe**`,
                duration: 20,
                order: 2,
                course: course._id,
                videoUrl: '',
                materials: []
            },
            {
                title: 'Kohereza Email',
                description: `Uyu munsi tuziga kohereza email. Ni byoroshye cyane!

**Gukanda "Compose":**

![Gmail Inbox](${imagePath}/gmail_inbox_1770046954014.png)

Nyuma yo kwinjira kuri Gmail, uzabona buto ivuga "Compose" ku ruhande rw'ibumoso. Kanda kuri yo!

**Kwandika Email:**

![Compose Email](${imagePath}/gmail_compose_email_1770046935722.png)

**Intambwe / Steps:**

1. **To:** Andika aderesi y'uwakoherezwa
   - Ingero: marie@gmail.com

2. **Subject:** Andika umutwe w'email yawe
   - Ingero: "Ndabagera" cyangwa "Ikibazo ku kazi"

3. **Message Body:** Andika ubutumwa bwawe
   - Tangira n'indangamuntu: "Mwaramutse Marie,"
   - Andika ubutumwa bwawe
   - Sohoka: "Murakoze, Jean"

4. **Kanda "Send"**

**Kohereza Dosiye:**

![Attachment](${imagePath}/gmail_attachment_1770047179218.png)

1. Kanda ikimenyetso cy'attachment (paperclip)
2. Hitamo dosiye kuri mudasobwa yawe
3. Tegereza dosiye yinjire
4. Kanda "Send"`,
                duration: 25,
                order: 3,
                course: course._id,
                videoUrl: '',
                materials: []
            },
            {
                title: 'Kwakira no Gusoma Email',
                description: `Uyu munsi tuziga gusoma no gusubiza email.

**Inbox Yawe:**

![Gmail Inbox](${imagePath}/gmail_inbox_1770046954014.png)

- **Inbox:** Aho email zose zigera
- **Starred:** Email z'ingenzi
- **Sent:** Email wakohereje
- **Drafts:** Email watangiye

**Email Nshya:**
- Email nshya zigaragara mu bururu bw'umukara (bold)
- Kanda kuri email kugira ngo uyisome

**Gusubiza Email:**

![Reply and Forward](${imagePath}/gmail_reply_forward_1770047987186.png)

- **Reply:** Gusubiza uwakohereye wenyine
- **Reply all:** Gusubiza abantu bose
- **Forward:** Kohereza email ku bandi

**Gusiba Email:**
- Kanda ikimenyetso cy'agasanduku
- Email izajya mu 'Trash'`,
                duration: 20,
                order: 4,
                course: course._id,
                videoUrl: '',
                materials: []
            },
            {
                title: 'Umutekano wa Email',
                description: `Uyu munsi tuziga ku mutekano wa email. Ni ingenzi cyane!

**Ijambo ry'Ibanga Rikomeye:**
✓ Inyuguti nini: ABC
✓ Inyuguti ntoya: abc
✓ Imibare: 123
✓ Ibimenyetso: !@#
✓ Nibura inyuguti 8

**Email z'Uburiganya (Phishing):**

![Phishing Example](${imagePath}/phishing_email_example_1770047250255.png)

Ibimenyetso:
⚠️ Isaba amafaranga vuba
⚠️ Aderesi y'uwohereje itameze neza
⚠️ Amakosa menshi mu nyandiko
⚠️ Link zijya ahantu utazi

Ntukigire:
❌ Ukanda link utazi
❌ Usangira amakuru y'ibanga
❌ Ukohereza amafaranga

**Two-Step Verification:**

![Security Settings](${imagePath}/gmail_security_settings_1770047198024.png)

1. Jya mu Settings
2. Hitamo "Security"
3. Kanda "2-Step Verification"
4. Andika nimero ya telefoni yawe
5. Emeza kode Gmail yakoherereje`,
                duration: 20,
                order: 5,
                course: course._id,
                videoUrl: '',
                materials: []
            },
            {
                title: 'Imyitwarire Myiza mu Email',
                description: `Uyu munsi tuziga kwandika email y'umwuga.

**Indangamuntu / Greetings:**
✓ Mwaramutse [Izina]
✓ Muraho [Izina]
✓ Ndashimira [Izina]

Wirinde:
❌ Heeee
❌ Yo

**Umutwe Ucye:**
✓ 'Raporo y'Icyumweru - Mutarama 15'
✓ 'Ikibazo ku Kazi - Urgent'
✓ 'Inama ya Saa Tatu'

**Ingero y'Email Yiza:**

To: boss@company.com
Subject: Raporo y'Icyumweru

Mwaramutse Mukuru,

Ndashaka kubamenyesha ko raporo y'icyumweru yarangiye. 
Mwayisanga muri attachment.

Murakoze,
Jean Uwase

**Gusohoka / Sign-off:**
- Murakoze, [Izina]
- Ndabona, [Izina]
- Mwese mwiyongere, [Izina]

Ongeraho:
- Umwanya wawe
- Nimero ya telefoni
- Kompanyi`,
                duration: 15,
                order: 6,
                course: course._id,
                videoUrl: '',
                materials: []
            }
        ];

        // Create lessons
        console.log('📝 Creating lessons...\n');
        const createdLessons = [];

        for (const lessonData of lessons) {
            const lesson = await Lesson.create(lessonData);
            createdLessons.push(lesson._id);
            console.log(`✓ Created: ${lesson.title} (${lesson.duration} min)`);
        }

        // Update course with lesson IDs
        course.lessons = createdLessons;
        course.totalLessons = createdLessons.length;
        await course.save();

        console.log('\n✅ All lessons created successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Course: ${course.title}`);
        console.log(`   - Total lessons: ${createdLessons.length}`);
        console.log(`   - Total duration: ${lessons.reduce((sum, l) => sum + l.duration, 0)} minutes`);
        console.log(`   - Images included: 9 screenshots`);
        console.log(`\n🎉 Your Kinyarwanda Email course is now complete with all content and images!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createLessons();
