const https = require('http');

// Step 1: Login as trainer
const loginData = JSON.stringify({
    email: 'ishimwediane@gmail.com',
    password: '@Diane123'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

console.log('Logging in as trainer...');

const loginReq = https.request(loginOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);

            if (response.success && response.token) {
                console.log('✓ Login successful!');
                console.log('Token:', response.token.substring(0, 20) + '...');

                // Step 2: Create course
                createCourse(response.token);
            } else {
                console.error('✗ Login failed:', response.message || 'Unknown error');
                process.exit(1);
            }
        } catch (error) {
            console.error('✗ Error parsing login response:', error.message);
            console.error('Response:', data);
            process.exit(1);
        }
    });
});

loginReq.on('error', (error) => {
    console.error('✗ Login request failed:', error.message);
    process.exit(1);
});

loginReq.write(loginData);
loginReq.end();

function createCourse(token) {
    const courseData = JSON.stringify({
        title: 'Isomo rya Email - Urwego rwa Beginner',
        description: 'Iri somo rigamije kwigisha abantu batazi icyo ari cyo email n\'uburyo bayikoresha. Tuziga ibanze byose ku email kuva ku ntangiriro. Uziga gufungura konti ya Gmail, kohereza no kwakira email, kurinda konti yawe, no kwandika email y\'umwuga. Isomo ryose riri mu Kinyarwanda kandi rifite amashusho yerekana buri ntambwe.',
        shortDescription: 'Wiga ibanze byose bya email mu Kinyarwanda - kuva gufungura konti kugeza ku kwandika email y\'umwuga',
        category: 'Digital Tools',
        level: 'Beginner',
        language: 'Kinyarwanda',
        duration: 2,
        type: 'free',
        isFree: true,
        price: 0,
        learningObjectives: [
            'Kumenya icyo email ari cyo n\'akamaro kayo',
            'Gufungura no kurinda konti ya Gmail',
            'Kohereza no kwakira email mu buryo bwizewe',
            'Kumenya no kwirinda email z\'uburiganya',
            'Kwandika email y\'umwuga',
            'Gukoresha attachments neza'
        ],
        whatYouWillLearn: [
            'Gufungura konti ya Gmail',
            'Kohereza no kwakira email',
            'Kurinda konti yawe n\'ijambo ry\'ibanga rikomeye',
            'Kumenya email z\'uburiganya (phishing)',
            'Kwandika email y\'umwuga',
            'Gukoresha attachments'
        ],
        prerequisites: [
            'Mudasobwa cyangwa telefoni igendanwa',
            'Interineti',
            'Nimero ya telefoni (kugira ngo wemeze konti)'
        ]
    });

    const courseOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/courses',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': courseData.length
        }
    };

    console.log('\nCreating course...');

    const courseReq = https.request(courseOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);

                if (response.success) {
                    console.log('✓ Course created successfully!');
                    console.log('\nCourse Details:');
                    console.log('  ID:', response.data._id);
                    console.log('  Title:', response.data.title);
                    console.log('  Language:', response.data.language);
                    console.log('  Level:', response.data.level);
                    console.log('  Category:', response.data.category);
                    console.log('  Status:', response.data.status);
                    console.log('\n✓ The trainer can now see this course in their dashboard!');
                } else {
                    console.error('✗ Course creation failed:', response.message || 'Unknown error');
                    if (response.errors) {
                        console.error('Errors:', response.errors);
                    }
                    process.exit(1);
                }
            } catch (error) {
                console.error('✗ Error parsing course creation response:', error.message);
                console.error('Response:', data);
                process.exit(1);
            }
        });
    });

    courseReq.on('error', (error) => {
        console.error('✗ Course creation request failed:', error.message);
        process.exit(1);
    });

    courseReq.write(courseData);
    courseReq.end();
}
