const http = require('http');

// Login credentials
const email = 'ishimwediane@gmail.com';
const password = '@Diane123';

// Lesson data
const lessons = [
    {
        title: 'Email ni iki?',
        titleEnglish: 'What is Email?',
        description: `Email ni uburyo bwo kohereza ubutumwa binyuze kuri interineti. Ni nk'ibaruwa, ariko ikohererezwa vuba kandi igera mu gihe gito.

**Ibyo uziga / What you'll learn:**
- Email ni iki? (What is email?)
- Impamvu email ari ingenzi (Why email is important)
- Itandukaniro hagati ya email na SMS (Difference between email and SMS)
- Ibice by'aderesi ya email (Parts of an email address)

**Ibisobanuro / Content:**
- Email ni uburyo bwo kohereza ubutumwa binyuze kuri interineti
- Aderesi ya email igizwe n'amazina (example@gmail.com)
- @ ni ikimenyetso gikomeye mu email
- Gmail, Yahoo, Outlook ni serivisi zitandukanye za email

**Ibice by'Aderesi ya Email:**
- Username (Amazina): Ni izina ryawe cyangwa igihanga wakoresheje
- @ Symbol (Ikimenyetso): Ni ikimenyetso gikomeye kigomba kuboneka muri buri email
- Domain (Serivisi): Ni serivisi ukoresha (gmail.com, yahoo.com, etc.)`,
        duration: 15,
        order: 1
    },
    {
        title: 'Gufungura Konti ya Email',
        titleEnglish: 'Creating an Email Account',
        description: `Uyu munsi tuziga gufungura konti ya Gmail. Ni byoroshye, uzabikora mu minota 5 gusa!

**Ibyo uziga / What you'll learn:**
- Guhitamo serivisi ya email (Choosing an email service)
- Gufungura konti ya Gmail (Creating a Gmail account)
- Guhitamo ijambo ry'ibanga rikomeye (Choosing a strong password)
- Kwemeza konti yawe (Verifying your account)

**Intambwe kuri kuri / Step by Step:**

1. **Jya kuri gmail.com** - Fungura interineti ukande kuri gmail.com
2. **Kanda "Create account"** - Uzabona buto y'ubururu ivuga "Create account"

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

6. **Emeza nimero ya telefoni yawe** - Kugira ngo urinde konti yawe`,
        duration: 20,
        order: 2
    },
    {
        title: 'Kohereza Email',
        titleEnglish: 'Sending an Email',
        description: `Uyu munsi tuziga kohereza email. Ni byoroshye cyane!

**Ibyo uziga / What you'll learn:**
- Gukoresha "Compose" (Kwandika email nshya)
- Kwandika aderesi y'uwakoherezwa (To:)
- Kwandika umutwe w'email (Subject)
- Kwandika ubutumwa (Message body)
- Kohereza dosiye (Attachments)

**Intambwe / Steps:**

1. **To:** Andika aderesi y'uwakoherezwa
   - Ingero: marie@gmail.com

2. **Subject:** Andika umutwe w'email yawe
   - Ingero: "Ndabagera" cyangwa "Ikibazo ku kazi"

3. **Message Body:** Andika ubutumwa bwawe
   - Tangira n'indangamuntu: "Mwaramutse Marie,"
   - Andika ubutumwa bwawe
   - Sohoka: "Murakoze, Jean"

4. **Kanda "Send"** - Buto y'ubururu hasi ibumoso

**Kohereza Dosiye / Sending Attachments:**
1. Kanda ikimenyetso cy'attachment (paperclip) hasi
2. Hitamo dosiye kuri mudasobwa yawe
3. Tegereza dosiye yinjire
4. Uzayibona hejuru y'ubutumwa
5. Kanda "Send"`,
        duration: 25,
        order: 3
    },
    {
        title: 'Kwakira no Gusoma Email',
        titleEnglish: 'Receiving and Reading Email',
        description: `Uyu munsi tuziga gusoma no gusubiza email.

**Ibyo uziga / What you'll learn:**
- Gusoma email nshya (Reading new emails)
- Gusubiza email (Replying to emails)
- Kohereza email ku bandi (Forwarding emails)
- Gusiba email (Deleting emails)

**Inbox Yawe / Your Inbox:**
- **Inbox:** Aho email zose zigera
- **Starred:** Email z'ingenzi wasize ikimenyetso
- **Sent:** Email wakohereje
- **Drafts:** Email watangiye ariko utarakohereza

**Email Nshya / New Emails:**
- Email nshya zigaragara mu bururu bw'umukara (bold)
- Kanda kuri email kugira ngo uyisome

**Gusubiza Email / Replying to Email:**
- **Reply:** Gusubiza uwakohereye wenyine
- **Reply all:** Gusubiza abantu bose bari muri email
- **Forward:** Kohereza email ku bandi

**Gusiba Email:**
- Kanda ikimenyetso cy'agasanduku
- Email izajya mu 'Trash'`,
        duration: 20,
        order: 4
    },
    {
        title: 'Umutekano wa Email',
        titleEnglish: 'Email Security',
        description: `Uyu munsi tuziga ku mutekano wa email. Ni ingenzi cyane!

**Ibyo uziga / What you'll learn:**
- Kurinda ijambo ry'ibanga (Protecting your password)
- Kumenya email z'uburiganya (Recognizing spam/phishing)
- Gukoresha "Two-factor authentication"
- Gusiba email zidakenewe (Deleting unnecessary emails)

**Ijambo ry'Ibanga Rikomeye:**
✓ Inyuguti nini: ABC
✓ Inyuguti ntoya: abc
✓ Imibare: 123
✓ Ibimenyetso: !@#
✓ Nibura inyuguti 8

Ingero Nziza: Jean2024!@
Ingero Mbi: 12345

**Email z'Uburiganya (Phishing):**

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
1. Jya mu Settings (Ibikoresho)
2. Hitamo "Security"
3. Kanda "2-Step Verification"
4. Andika nimero ya telefoni yawe
5. Emeza kode Gmail yakoherereje`,
        duration: 20,
        order: 5
    },
    {
        title: 'Imyitwarire Myiza mu Email',
        titleEnglish: 'Email Etiquette',
        description: `Uyu munsi tuziga kwandika email y'umwuga.

**Ibyo uziga / What you'll learn:**
- Kwandika email y'umwuga (Writing professional emails)
- Gukoresha indangamuntu (Using greetings)
- Kwandika umutwe ucye (Writing clear subjects)
- Gusohoka neza (Proper sign-offs)

**Indangamuntu / Greetings:**
✓ Mwaramutse [Izina]
✓ Muraho [Izina]
✓ Ndashimira [Izina]

Wirinde:
❌ Heeee
❌ Yo
❌ (Ubusa)

**Umutwe Ucye / Clear Subject:**
✓ 'Raporo y'Icyumweru - Mutarama 15'
✓ 'Ikibazo ku Kazi - Urgent'
✓ 'Inama ya Saa Tatu'

Umutwe Mubi:
❌ 'Ikibazo'
❌ 'Heeee'
❌ 'Reba'

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
- Mwese mwiyongere, [Izina]`,
        duration: 15,
        order: 6
    }
];

// Step 1: Login
function login(callback) {
    const loginData = JSON.stringify({ email, password });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    };

    console.log('🔐 Logging in as trainer...');

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.success && response.token) {
                    console.log('✓ Login successful!\n');
                    callback(null, response.token);
                } else {
                    callback(new Error(response.message || 'Login failed'));
                }
            } catch (error) {
                callback(error);
            }
        });
    });

    req.on('error', callback);
    req.write(loginData);
    req.end();
}

// Step 2: Get course ID
function getCourseId(token, callback) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/courses',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    console.log('📚 Finding your course...');

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.success && response.data) {
                    const course = response.data.find(c => c.title.includes('Isomo rya Email'));
                    if (course) {
                        console.log(`✓ Found course: ${course.title}`);
                        console.log(`  ID: ${course._id}\n`);
                        callback(null, course._id);
                    } else {
                        callback(new Error('Course not found'));
                    }
                } else {
                    callback(new Error('Failed to get courses'));
                }
            } catch (error) {
                callback(error);
            }
        });
    });

    req.on('error', callback);
    req.end();
}

// Step 3: Create lessons
function createLesson(token, courseId, lesson, callback) {
    const lessonData = JSON.stringify({
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order,
        course: courseId,
        videoUrl: '',
        materials: []
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/lessons',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': lessonData.length
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.success) {
                    console.log(`✓ Created: ${lesson.title} (${lesson.duration} min)`);
                    callback(null, response.data);
                } else {
                    callback(new Error(response.message || 'Failed to create lesson'));
                }
            } catch (error) {
                callback(error);
            }
        });
    });

    req.on('error', callback);
    req.write(lessonData);
    req.end();
}

// Main execution
login((err, token) => {
    if (err) {
        console.error('✗ Login error:', err.message);
        process.exit(1);
    }

    getCourseId(token, (err, courseId) => {
        if (err) {
            console.error('✗ Course lookup error:', err.message);
            process.exit(1);
        }

        console.log('📝 Creating lessons...\n');

        let completed = 0;
        lessons.forEach((lesson, index) => {
            setTimeout(() => {
                createLesson(token, courseId, lesson, (err) => {
                    if (err) {
                        console.error(`✗ Error creating ${lesson.title}:`, err.message);
                    }

                    completed++;
                    if (completed === lessons.length) {
                        console.log('\n✅ All lessons created successfully!');
                        console.log(`\n📊 Summary:`);
                        console.log(`   - Total lessons: ${lessons.length}`);
                        console.log(`   - Total duration: ${lessons.reduce((sum, l) => sum + l.duration, 0)} minutes`);
                        console.log(`\n🎉 Your Kinyarwanda Email course is now complete!`);
                    }
                });
            }, index * 500); // Stagger requests by 500ms
        });
    });
});
