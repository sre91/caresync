import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Appointment Confirmation
export const sendBookingConfirmation = async (
  patientEmail: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  fees: number,
) => {
  try {
    await transporter.sendMail({
      from: `"CareSync AI" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: "Appointment Booking Confirmation - CareSync AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">

          <div style="background: #1a73e8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">CareSync AI</h1>
            <p style="color: #e8f0fe; margin: 5px 0 0 0;">AI Powered Healthcare</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333;">Appointment Confirmed!</h2>
            <p style="color: #666;">Dear ${patientName},</p>
            <p style="color: #666;">Your appointment has been successfully booked. Here are your details:</p>

            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a73e8;">
              <p style="margin: 8px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 8px 0;"><strong>Fees:</strong> Rs. ${fees}</p>
              <p style="margin: 8px 0;"><strong>Status:</strong> Pending Confirmation</p>
            </div>

            <p style="color: #666;">Please arrive 10 minutes before your appointment time.</p>
            <p style="color: #666;">If you need to cancel, please do so at least 24 hours in advance.</p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">This is an automated email from CareSync AI</p>
            </div>
          </div>

        </div>
      `,
    });
    console.log("Booking confirmation email sent!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Send Appointment Confirmed by Doctor
export const sendAppointmentConfirmed = async (
  patientEmail: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
) => {
  try {
    await transporter.sendMail({
      from: `"CareSync AI" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: "Appointment Confirmed by Doctor - CareSync AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">

          <div style="background: #1a73e8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">CareSync AI</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2e7d32;">Your Appointment is Confirmed!</h2>
            <p style="color: #666;">Dear ${patientName},</p>
            <p style="color: #666;">Great news! Dr. ${doctorName} has confirmed your appointment.</p>

            <div style="background: #f1f8f1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32;">
              <p style="margin: 8px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 8px 0;"><strong>Status:</strong> Confirmed</p>
            </div>

            <p style="color: #666;">We look forward to seeing you!</p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">CareSync AI - AI Powered Healthcare</p>
            </div>
          </div>

        </div>
      `,
    });
    console.log("Confirmation email sent!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

// Send Cancellation Email
export const sendCancellationEmail = async (
  patientEmail: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
) => {
  try {
    await transporter.sendMail({
      from: `"CareSync AI" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: "Appointment Cancellation - CareSync AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">

          <div style="background: #1a73e8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">CareSync AI</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #c62828;">Appointment Cancelled</h2>
            <p style="color: #666;">Dear ${patientName},</p>
            <p style="color: #666;">Your appointment has been cancelled.</p>

            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c62828;">
              <p style="margin: 8px 0;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin: 8px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 8px 0;"><strong>Status:</strong> Cancelled</p>
            </div>

            <p style="color: #666;">You can book a new appointment anytime on CareSync AI.</p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">CareSync AI - AI Powered Healthcare</p>
            </div>
          </div>

        </div>
      `,
    });
    console.log("Cancellation email sent!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
