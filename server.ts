import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cron from "node-cron";

interface Appointment {
  id: string;
  userName: string;
  phone: string;
  date: string;
  time: string;
  services: any[];
  reminderSent: boolean;
}

// In-memory store for demo purposes. In production, use a real database like Firebase, PostgreSQL, etc.
const appointments: Appointment[] = [];

// A mock function to simulate sending a reminder
const sendReminder = async (appointment: Appointment) => {
  console.log(`[AUTOMATED REMINDER] Sending SMS/Email to ${appointment.userName} at ${appointment.phone}`);
  console.log(`Message: Reminder: You have an appointment at Nyangie Nail Studio on ${appointment.date} at ${appointment.time}. Please arrive 5 minutes early.`);
  // NOTE: Here is where you would integrate Twilio for SMS or Resend/Nodemailer for Email
  /*
    Example Twilio:
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Reminder: Appointment on ${appointment.date} at ${appointment.time}`,
      from: '+1234567890',
      to: appointment.phone
    });
  */
};

// Start the cron job to check for upcoming appointments every minute
cron.schedule('* * * * *', () => {
  const now = new Date();
  
  appointments.forEach(app => {
    if (app.reminderSent) return;

    // Parse appointment date and time for demonstration logic
    // Currently relying on generic string, for production use ISO dates
    // Doing a simplified mock check - e.g. "is appointment in the next 24 hours?"
    // Since dates from frontend come as "14 May 2026", we can try to parse it
    
    try {
      const appDateStr = `${app.date} ${app.time}`;
      const appDateTime = new Date(appDateStr);
      
      if (!isNaN(appDateTime.getTime())) {
        const diffMs = appDateTime.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Send reminder if appointment is less than 24 hours away and hasn't passed
        if (diffHours > 0 && diffHours <= 24) {
          sendReminder(app);
          app.reminderSent = true;
        }
      } else {
        // If date can't be parsed, just send mock reminder once
        sendReminder(app);
        app.reminderSent = true;
      }
    } catch (err) {
      console.error(err);
    }
  });
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to save appointments and trigger scheduling
  app.post("/api/book", (req, res) => {
    const { userName, phone, date, time, services } = req.body;
    
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      userName,
      phone,
      date,
      time,
      services,
      reminderSent: false,
    };

    appointments.push(newAppointment);
    
    console.log(`[SYSTEM] New appointment saved for ${userName}. Reminder scheduled.`);

    res.json({ success: true, appointmentId: newAppointment.id });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Reminder Scheduler is active.`);
  });
}

startServer();
