import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { globalSetting } from "~/server/db/schema/settings-schema";
import { createLogger } from "~/server/lib/logger";

const logger = createLogger("smtp");

async function getSetting(key: string): Promise<string | null> {
  try {
    const [row] = await db
      .select({ value: globalSetting.value })
      .from(globalSetting)
      .where(eq(globalSetting.key, key));
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function getSmtpConfig() {
  const [host, port, user, pass, secure, from] = await Promise.all([
    getSetting("smtp_host"),
    getSetting("smtp_port"),
    getSetting("smtp_user"),
    getSetting("smtp_pass"),
    getSetting("smtp_secure"),
    getSetting("smtp_from"),
  ]);

  return {
    host: host || process.env.SMTP_HOST || "localhost",
    port: Number(port || process.env.SMTP_PORT) || 587,
    secure: (secure || process.env.SMTP_SECURE) === "true",
    auth: {
      user: user || process.env.SMTP_USER || "",
      pass: pass || process.env.SMTP_PASS || "",
    },
    from: from || process.env.SMTP_FROM || process.env.BETTER_AUTH_EMAIL || "noreply@foreum.com",
  };
}

export async function createTransporter() {
  const config = await getSmtpConfig();
  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    }),
    from: config.from,
  };
}

export async function testSmtpConnection(
  host: string,
  port: number,
  secure: boolean,
  user: string,
  pass: string,
  testRecipient: string,
): Promise<{ success: boolean; error?: string }> {
  const testTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await testTransporter.verify();
    await testTransporter.sendMail({
      from: user || "test@foreum.com",
      to: testRecipient,
      subject: "Foreum SMTP Test",
      text: "This is a test email from Foreum. If you received this, your SMTP configuration is working correctly.",
    });
    logger.info({ testRecipient }, "Test email sent successfully");
    return { success: true };
  } catch (err: any) {
    logger.error({ err, testRecipient }, "Test email failed");
    return { success: false, error: err?.message || "Unknown error" };
  }
}
