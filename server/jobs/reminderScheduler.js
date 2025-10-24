// server/jobs/reminderScheduler.js

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Question = require('../models/Question');
const User = require('../models/User');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('📧 Nodemailer transporter configured.');

// Function to send reminder emails
async function sendReminders() {
  console.log('⏰ Running reminder job at:', new Date().toLocaleTimeString());
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    // Find questions due today (nextRevisionDate >= today and < tomorrow)
    const dueQuestions = await Question.find({
      nextRevisionDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('userId', 'email name'); // Populate user's email and name

    if (dueQuestions.length === 0) {
      console.log('✅ No questions due for revision today.');
      return;
    }

    console.log(`🔍 Found ${dueQuestions.length} questions due today.`);

    // Group questions by user
    const remindersByUser = {};
    dueQuestions.forEach((q) => {
      if (q.userId && q.userId.email) { // Check if user info is available
        const userIdStr = q.userId._id.toString();
        if (!remindersByUser[userIdStr]) {
          remindersByUser[userIdStr] = {
            email: q.userId.email,
            name: q.userId.name || 'User', // Use name or default
            questions: [],
          };
        }
        remindersByUser[userIdStr].questions.push(q);
      }
    });

    // Send one email per user
    for (const userId in remindersByUser) {
      const userData = remindersByUser[userId];
      const questionTitles = userData.questions.map(q => `- ${q.title}`).join('\n');

      const mailOptions = {
        from: `"DSA Revision Tracker" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: '🚀 Time to Revise Your DSA Questions!',
        text: `Hi ${userData.name},\n\nYou have ${userData.questions.length} question(s) due for revision today:\n\n${questionTitles}\n\nKeep up the great work!\n\nBest,\nYour DSA Revision Tracker`,
        html: `
          <p>Hi ${userData.name},</p>
          <p>You have <strong>${userData.questions.length}</strong> question(s) due for revision today:</p>
          <ul>
            ${userData.questions.map(q => `<li>${q.title}</li>`).join('')}
          </ul>
          <p>Keep up the great work!</p>
          <p>Best,<br/>Your DSA Revision Tracker</p>
        `,
      };

      try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`✅ Reminder email sent to ${userData.email}: ${info.messageId}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${userData.email}:`, emailError);
      }
    }

  } catch (error) {
    console.error('❌ Error fetching or processing due questions:', error);
  }
}

// Schedule the job to run every day at 9:00 AM
// Syntax: second minute hour day-of-month month day-of-week
cron.schedule('0 9 * * *', sendReminders, {
   scheduled: true,
   timezone: "Asia/Kolkata" // Set your timezone
});

console.log('🗓️ Revision reminder job scheduled daily at 9:00 AM IST.');

// Optional: Run once immediately on server start for testing
// sendReminders();