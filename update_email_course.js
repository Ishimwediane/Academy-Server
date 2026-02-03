const https = require('https');

// Login credentials - using admin account
const email = 'admin@iremecorner.com';
const password = 'Admin123!';

// Server configuration
const SERVER_HOST = 'academy-server-f60a.onrender.com';
const SERVER_PORT = 443;

// Step 1: Login
function login(callback) {
    const loginData = JSON.stringify({ email, password });

    const options = {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    };

    console.log('🔐 Logging in as admin...');
    console.log(`   Server: ${SERVER_HOST}`);

    const req = https.request(options, (res) => {
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
                console.error('Response data:', data);
                callback(error);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request error:', error.message);
        callback(error);
    });
    req.write(loginData);
    req.end();
}

// Step 2: Get course ID
function getCourseId(token, callback) {
    const options = {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path: '/api/courses',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    console.log('📚 Finding your course...');

    const req = https.request(options, (res) => {
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

// Step 3: Update course with learning outcomes
function updateCourse(token, courseId, callback) {
    const updateData = JSON.stringify({
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
    });

    const options = {
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path: `/api/courses/${courseId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': updateData.length
        }
    };

    console.log('📝 Updating course with learning outcomes...');

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.success) {
                    console.log('✓ Course updated successfully!\n');
                    console.log('Added:');
                    console.log('  - 6 learning outcomes (What You\'ll Learn)');
                    console.log('  - 6 learning objectives');
                    console.log('  - Instructor bio');
                    console.log('  - Course outcome');
                    console.log('  - Short description');
                    callback(null);
                } else {
                    callback(new Error(response.message || 'Failed to update course'));
                }
            } catch (error) {
                callback(error);
            }
        });
    });

    req.on('error', callback);
    req.write(updateData);
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

        updateCourse(token, courseId, (err) => {
            if (err) {
                console.error('✗ Update error:', err.message);
                process.exit(1);
            }

            console.log('\n✅ Course update complete!');
            console.log('\n🎉 The "Isomo rya Email" course now has:');
            console.log('   ✓ Learning outcomes for "What You\'ll Learn" tab');
            console.log('   ✓ Learning objectives');
            console.log('   ✓ Instructor bio');
            console.log('   ✓ Course outcome description');
            console.log('   ✓ 6 lessons with detailed descriptions');
            console.log('\n📱 You can now view the course on the frontend!');
        });
    });
});
