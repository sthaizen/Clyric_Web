import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function testEmail() {
  console.log("Testing SMTP Connection...");
  console.log("User:", process.env.SMTP_USER);
  console.log("Host:", process.env.SMTP_HOST);
  console.log("Port:", process.env.SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!");
    
    // Attempt to send a test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM, // Send to self
      subject: "Clyric SMTP Test",
      text: "If you are reading this, your admin auth email system is working correctly!",
    });
    
    console.log("✅ Test email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ SMTP Error:", error.message);
    if (error.message.includes("535-5.7.8")) {
      console.log("\n💡 Possible causes:");
      console.log("1. Incorrect App Password (tqxe jnlt jzhc srng).");
      console.log("2. Incorrect Username (yatharthastha23t@gmail.com). Check for typos!");
      console.log("3. 2-Step Verification is not enabled on the account.");
    }
  }
}

testEmail();
