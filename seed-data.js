// Seed script to populate database with sample courses and content
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Assignment = require('./models/Assignment');
const Quiz = require('./models/Quiz');

const connectDB = async () => {
  try {
    const db_user = process.env.DB_USER;
    const db_pass = encodeURIComponent(process.env.DB_PASS);
    const db_name = process.env.DB_NAME;

    if (!db_user || !db_pass || !db_name) {
      console.error('❌ Missing database credentials in .env file');
      process.exit(1);
    }

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

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing data...');
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Assignment.deleteMany({});
    await Quiz.deleteMany({});
    console.log('✅ Existing courses cleared');

    // Create or get trainer
    console.log('\n👨‍🏫 Creating trainer...');
    let trainer = await User.findOne({ email: 'trainer@iremecorner.com' });

    if (!trainer) {
      const hashedPassword = await bcrypt.hash('Trainer123!', 10);
      trainer = await User.create({
        name: 'John Trainer',
        email: 'trainer@iremecorner.com',
        password: hashedPassword,
        role: 'trainer',
        isActive: true,
      });
      console.log('✅ Trainer created:', trainer.email);
    } else {
      trainer.role = 'trainer';
      trainer.isActive = true;
      await trainer.save();
      console.log('✅ Trainer found:', trainer.email);
    }

    // Create or get admin
    console.log('\n👑 Creating admin...');
    let admin = await User.findOne({ email: 'admin@iremecorner.com' });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@iremecorner.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin created:', admin.email);
    } else {
      // Ensure the existing user has the admin role
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
      console.log('✅ Admin found:', admin.email);
    }

    // Create Diane trainer
    console.log('\n👨‍🏫 Creating Diane trainer...');
    let dianeTrainer = await User.findOne({ email: 'ishimwediane@gmail.com' });

    if (!dianeTrainer) {
      const hashedPassword = await bcrypt.hash('@Diane123', 10);
      dianeTrainer = await User.create({
        name: 'Diane Ishimwe',
        email: 'ishimwediane@gmail.com',
        password: hashedPassword,
        role: 'trainer',
        isActive: true,
      });
      console.log('✅ Diane trainer created:', dianeTrainer.email);
    } else {
      dianeTrainer.role = 'trainer';
      dianeTrainer.isActive = true;
      await dianeTrainer.save();
      console.log('✅ Diane trainer found:', dianeTrainer.email);
    }


    // Course 1: Digital Marketing Basics
    console.log('\n📚 Creating Course 1: Digital Marketing Basics...');
    const course1 = await Course.create({
      title: 'Digital Marketing Basics',
      description: 'Learn the fundamentals of digital marketing including SEO, social media marketing, content marketing, and email marketing. Perfect for beginners who want to start their digital marketing journey. This comprehensive course will teach you everything you need to know to market your business online effectively.',
      shortDescription: 'Master the fundamentals of digital marketing and grow your business online.',
      learningObjectives: [
        'Understand the digital marketing landscape and its importance',
        'Learn SEO fundamentals and keyword research',
        'Master social media marketing strategies',
        'Create effective content marketing campaigns',
        'Understand email marketing best practices'
      ],
      whatYouWillLearn: [
        'Digital marketing fundamentals and strategies',
        'Search Engine Optimization (SEO) techniques',
        'Social media marketing for business growth',
        'Content creation and content marketing',
        'Email marketing campaigns and automation',
        'Analytics and performance measurement',
        'Digital advertising basics',
        'Building a strong online presence'
      ],
      prerequisites: [
        'Basic computer skills',
        'Internet access',
        'Willingness to learn'
      ],
      courseOutcome: 'By the end of this course, you will be able to create and execute a comprehensive digital marketing strategy for your business, understand how to optimize your online presence, and measure the success of your marketing campaigns.',
      instructorBio: 'John Trainer is a digital marketing expert with over 10 years of experience helping businesses grow online. He has successfully managed marketing campaigns for hundreds of companies and has a passion for teaching others how to succeed in the digital world.',
      language: 'English',
      category: 'Marketing',
      trainer: trainer._id,
      level: 'Beginner',
      duration: 20,
      isFree: true,
      price: 0,
      status: 'approved',
    });
    console.log('✅ Course 1 created:', course1.title);

    // Lessons for Course 1
    const lesson1_1 = await Lesson.create({
      course: course1._id,
      title: 'Introduction to Digital Marketing',
      description: 'Understanding what digital marketing is and why it matters',
      content: '<h2>What is Digital Marketing?</h2><p>Digital marketing is the promotion of brands using digital channels such as search engines, social media, email, and websites.</p><h3>Key Benefits:</h3><ul><li>Reach a larger audience</li><li>Cost-effective compared to traditional marketing</li><li>Measurable results</li><li>Real-time engagement</li></ul>',
      order: 1,
      duration: 15,
      isPublished: true,
    });

    const lesson1_2 = await Lesson.create({
      course: course1._id,
      title: 'SEO Fundamentals',
      description: 'Learn the basics of Search Engine Optimization',
      content: '<h2>SEO Basics</h2><p>SEO (Search Engine Optimization) helps your website rank higher in search results.</p><h3>Key Concepts:</h3><ul><li>Keywords research</li><li>On-page optimization</li><li>Link building</li><li>Content quality</li></ul>',
      order: 2,
      duration: 25,
      isPublished: true,
    });

    const lesson1_3 = await Lesson.create({
      course: course1._id,
      title: 'Social Media Marketing',
      description: 'Master social media platforms for business growth',
      content: '<h2>Social Media Marketing</h2><p>Social media marketing is essential for modern businesses.</p><h3>Platforms to Focus On:</h3><ul><li>Facebook</li><li>Instagram</li><li>Twitter</li><li>LinkedIn</li></ul>',
      order: 3,
      duration: 30,
      isPublished: true,
    });

    course1.lessons = [lesson1_1._id, lesson1_2._id, lesson1_3._id];
    await course1.save();

    // Assignment for Course 1
    await Assignment.create({
      course: course1._id,
      lesson: lesson1_2._id,
      title: 'SEO Audit Assignment',
      description: 'Perform a basic SEO audit of a website. Identify key areas for improvement including title tags, meta descriptions, and content quality. Submit a 500-word report with your findings and recommendations.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxScore: 100,
    });

    // Quiz for Course 1
    await Quiz.create({
      course: course1._id,
      lesson: lesson1_1._id,
      title: 'Digital Marketing Basics Quiz',
      description: 'Test your understanding of digital marketing fundamentals',
      questions: [
        {
          question: 'What is digital marketing?',
          options: [
            'Traditional advertising',
            'Marketing using digital channels',
            'Email only marketing',
            'Social media only'
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          question: 'Which of these is a benefit of digital marketing?',
          options: [
            'Higher cost',
            'Limited reach',
            'Measurable results',
            'Slow response time'
          ],
          correctAnswer: 2,
          points: 20
        },
        {
          question: 'SEO stands for:',
          options: [
            'Search Engine Optimization',
            'Social Engine Optimization',
            'Search Engine Organization',
            'Social Engine Organization'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'Which platform is best for B2B marketing?',
          options: [
            'Facebook',
            'Instagram',
            'LinkedIn',
            'TikTok'
          ],
          correctAnswer: 2,
          points: 20
        },
        {
          question: 'Content marketing focuses on:',
          options: [
            'Paid advertisements only',
            'Creating valuable content',
            'Email campaigns only',
            'Social media only'
          ],
          correctAnswer: 1,
          points: 20
        }
      ],
      maxScore: 100,
      timeLimit: 15,
    });

    // Course 2: Financial Literacy for Entrepreneurs
    console.log('\n📚 Creating Course 2: Financial Literacy for Entrepreneurs...');
    const course2 = await Course.create({
      title: 'Financial Literacy for Entrepreneurs',
      description: 'Essential financial management skills for entrepreneurs. Learn budgeting, cash flow management, financial planning, and investment basics. Build confidence in managing your business finances. This course provides practical tools and strategies for making informed financial decisions.',
      shortDescription: 'Master financial management skills to grow and sustain your business.',
      learningObjectives: [
        'Understand business financial statements',
        'Master budgeting and forecasting techniques',
        'Learn cash flow management strategies',
        'Understand investment basics for entrepreneurs',
        'Develop financial planning skills'
      ],
      whatYouWillLearn: [
        'Reading and understanding financial statements',
        'Creating and managing business budgets',
        'Cash flow forecasting and management',
        'Financial planning and goal setting',
        'Investment strategies for businesses',
        'Tax planning basics',
        'Financial risk management',
        'Making data-driven financial decisions'
      ],
      prerequisites: [
        'Basic math skills',
        'Interest in business management',
        'Calculator or spreadsheet software'
      ],
      courseOutcome: 'Upon completion, you will have the knowledge and skills to effectively manage your business finances, make informed financial decisions, and plan for long-term financial success.',
      instructorBio: 'John Trainer is a certified financial advisor and business consultant with extensive experience in helping entrepreneurs manage their finances. He specializes in financial planning and business growth strategies.',
      language: 'English',
      category: 'Financial Literacy',
      trainer: trainer._id,
      level: 'Intermediate',
      duration: 30,
      isFree: true,
      price: 0,
      status: 'approved',
    });
    console.log('✅ Course 2 created:', course2.title);

    // Lessons for Course 2
    const lesson2_1 = await Lesson.create({
      course: course2._id,
      title: 'Understanding Business Finances',
      description: 'Introduction to business financial management',
      content: '<h2>Business Financial Management</h2><p>Proper financial management is crucial for business success.</p><h3>Key Components:</h3><ul><li>Income statements</li><li>Balance sheets</li><li>Cash flow statements</li><li>Financial ratios</li></ul>',
      order: 1,
      duration: 20,
      isPublished: true,
    });

    const lesson2_2 = await Lesson.create({
      course: course2._id,
      title: 'Budgeting and Forecasting',
      description: 'Learn to create and manage budgets',
      content: '<h2>Budgeting Basics</h2><p>Budgeting helps you plan and control your business finances.</p><h3>Budgeting Steps:</h3><ol><li>Estimate revenue</li><li>List expenses</li><li>Create budget categories</li><li>Monitor and adjust</li></ol>',
      order: 2,
      duration: 25,
      isPublished: true,
    });

    const lesson2_3 = await Lesson.create({
      course: course2._id,
      title: 'Cash Flow Management',
      description: 'Master cash flow to keep your business running',
      content: '<h2>Cash Flow Management</h2><p>Cash flow is the lifeblood of your business.</p><h3>Best Practices:</h3><ul><li>Monitor cash flow regularly</li><li>Maintain cash reserves</li><li>Speed up receivables</li><li>Delay payables when possible</li></ul>',
      order: 3,
      duration: 30,
      isPublished: true,
    });

    const lesson2_4 = await Lesson.create({
      course: course2._id,
      title: 'Investment Basics',
      description: 'Introduction to business investments',
      content: '<h2>Investment Basics</h2><p>Smart investments can grow your business.</p><h3>Investment Types:</h3><ul><li>Equipment and technology</li><li>Marketing and advertising</li><li>Employee training</li><li>Research and development</li></ul>',
      order: 4,
      duration: 20,
      isPublished: true,
    });

    course2.lessons = [lesson2_1._id, lesson2_2._id, lesson2_3._id, lesson2_4._id];
    await course2.save();

    // Assignment for Course 2
    await Assignment.create({
      course: course2._id,
      lesson: lesson2_2._id,
      title: 'Create a Business Budget',
      description: 'Create a monthly budget for a hypothetical business. Include all revenue sources and expense categories. Provide explanations for each budget item. Submit a 1000-word budget plan with justifications.',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      maxScore: 100,
    });

    // Quiz for Course 2
    await Quiz.create({
      course: course2._id,
      lesson: lesson2_1._id,
      title: 'Financial Literacy Quiz',
      description: 'Test your financial management knowledge',
      questions: [
        {
          question: 'What is a balance sheet?',
          options: [
            'A statement of income',
            'A snapshot of assets, liabilities, and equity',
            'A cash flow statement',
            'A budget document'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'Cash flow is:',
          options: [
            'Total revenue',
            'Money coming in and going out',
            'Profit only',
            'Expenses only'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'Why is budgeting important?',
          options: [
            'It increases revenue',
            'It helps plan and control finances',
            'It reduces taxes',
            'It attracts investors only'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'What should you monitor regularly?',
          options: [
            'Only revenue',
            'Only expenses',
            'Cash flow',
            'Only profits'
          ],
          correctAnswer: 2,
          points: 25
        }
      ],
      maxScore: 100,
      timeLimit: 20,
    });

    // Course 3: Business Management Essentials
    console.log('\n📚 Creating Course 3: Business Management Essentials...');
    const course3 = await Course.create({
      title: 'Business Management Essentials',
      description: 'Master the fundamentals of business management including leadership, team management, strategic planning, and operations. Perfect for new entrepreneurs and managers. This comprehensive course covers all the essential skills needed to run a successful business.',
      shortDescription: 'Learn essential business management skills to lead and grow your organization.',
      learningObjectives: [
        'Understand core business management principles',
        'Develop leadership and team management skills',
        'Master strategic planning and execution',
        'Learn operations management fundamentals',
        'Build effective communication and decision-making skills'
      ],
      whatYouWillLearn: [
        'Core business management principles',
        'Leadership styles and techniques',
        'Team building and management strategies',
        'Strategic planning and goal setting',
        'Operations and process management',
        'Effective communication in business',
        'Decision-making frameworks',
        'Problem-solving techniques',
        'Performance management',
        'Building a positive work culture'
      ],
      prerequisites: [
        'Basic understanding of business concepts',
        'Interest in management and leadership',
        'Willingness to learn and apply new skills'
      ],
      courseOutcome: 'After completing this course, you will be equipped with essential management skills to lead teams effectively, make strategic decisions, and manage business operations successfully.',
      instructorBio: 'John Trainer is an experienced business consultant and management coach with over 15 years of experience. He has helped hundreds of entrepreneurs and managers develop their leadership and management skills.',
      language: 'English',
      category: 'Business Management',
      trainer: trainer._id,
      level: 'Beginner',
      duration: 25,
      isFree: true,
      price: 0,
      status: 'approved',
    });
    console.log('✅ Course 3 created:', course3.title);

    // Lessons for Course 3
    const lesson3_1 = await Lesson.create({
      course: course3._id,
      title: 'Introduction to Business Management',
      description: 'Learn what business management entails',
      content: '<h2>Business Management Fundamentals</h2><p>Effective business management is key to success.</p><h3>Core Functions:</h3><ul><li>Planning</li><li>Organizing</li><li>Leading</li><li>Controlling</li></ul>',
      order: 1,
      duration: 15,
      isPublished: true,
    });

    const lesson3_2 = await Lesson.create({
      course: course3._id,
      title: 'Leadership Skills',
      description: 'Develop your leadership abilities',
      content: '<h2>Leadership Essentials</h2><p>Great leaders inspire and guide their teams.</p><h3>Key Leadership Traits:</h3><ul><li>Communication</li><li>Decision-making</li><li>Empathy</li><li>Vision</li><li>Integrity</li></ul>',
      order: 2,
      duration: 30,
      isPublished: true,
    });

    const lesson3_3 = await Lesson.create({
      course: course3._id,
      title: 'Team Management',
      description: 'Learn to build and manage effective teams',
      content: '<h2>Team Management</h2><p>Managing teams requires skill and understanding.</p><h3>Best Practices:</h3><ul><li>Clear communication</li><li>Set expectations</li><li>Provide feedback</li><li>Recognize achievements</li><li>Resolve conflicts</li></ul>',
      order: 3,
      duration: 25,
      isPublished: true,
    });

    const lesson3_4 = await Lesson.create({
      course: course3._id,
      title: 'Strategic Planning',
      description: 'Create and execute business strategies',
      content: '<h2>Strategic Planning</h2><p>Strategic planning sets your business direction.</p><h3>Planning Process:</h3><ol><li>Define mission and vision</li><li>Analyze current situation</li><li>Set goals and objectives</li><li>Develop strategies</li><li>Implement and monitor</li></ol>',
      order: 4,
      duration: 35,
      isPublished: true,
    });

    const lesson3_5 = await Lesson.create({
      course: course3._id,
      title: 'Operations Management',
      description: 'Manage day-to-day business operations',
      content: '<h2>Operations Management</h2><p>Efficient operations drive business success.</p><h3>Key Areas:</h3><ul><li>Process optimization</li><li>Quality control</li><li>Supply chain management</li><li>Resource allocation</li></ul>',
      order: 5,
      duration: 20,
      isPublished: true,
    });

    course3.lessons = [lesson3_1._id, lesson3_2._id, lesson3_3._id, lesson3_4._id, lesson3_5._id];
    await course3.save();

    // Assignment for Course 3
    await Assignment.create({
      course: course3._id,
      lesson: lesson3_4._id,
      title: 'Strategic Plan Assignment',
      description: 'Create a strategic plan for a hypothetical business. Include mission, vision, SWOT analysis, goals, and action plans. Submit a comprehensive 1500-word strategic plan document.',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      maxScore: 100,
    });

    // Quiz for Course 3
    await Quiz.create({
      course: course3._id,
      lesson: lesson3_1._id,
      title: 'Business Management Quiz',
      description: 'Test your business management knowledge',
      questions: [
        {
          question: 'What are the four core functions of management?',
          options: [
            'Planning, Organizing, Leading, Controlling',
            'Selling, Marketing, Finance, HR',
            'Production, Sales, Marketing, Finance',
            'Vision, Mission, Goals, Objectives'
          ],
          correctAnswer: 0,
          points: 25
        },
        {
          question: 'What is leadership?',
          options: [
            'Managing tasks only',
            'Inspiring and guiding teams',
            'Controlling employees',
            'Setting rules only'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'Strategic planning helps:',
          options: [
            'Set daily tasks',
            'Set business direction',
            'Manage employees',
            'Control expenses only'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'Effective team management requires:',
          options: [
            'Micromanagement',
            'Clear communication',
            'No feedback',
            'Avoiding conflicts'
          ],
          correctAnswer: 1,
          points: 25
        }
      ],
      maxScore: 100,
      timeLimit: 15,
    });

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 3 Courses created`);
    console.log(`   - ${course1.lessons.length + course2.lessons.length + course3.lessons.length} Lessons created`);
    console.log(`   - 3 Assignments created`);
    console.log(`   - 3 Quizzes created`);
    console.log(`   - Trainer: ${trainer.email}`);
    console.log('\n🎓 Courses created:');
    console.log(`   1. ${course1.title} (${course1.lessons.length} lessons)`);
    console.log(`   2. ${course2.title} (${course2.lessons.length} lessons)`);
    console.log(`   3. ${course3.title} (${course3.lessons.length} lessons)`);
    console.log('\n✅ You can now browse and enroll in these courses!');

    mongoose.connection.close();
    process.exit(0);
  }
  catch (error) {
    console.error('❌ Seed Data Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};