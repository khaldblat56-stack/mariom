import { NextResponse } from "next/server";
import net from "node:net";
import tls from "node:tls";

export const runtime = "nodejs";

type ContactRequest = {
  name?: unknown;
  phone?: unknown;
  service?: unknown;
  project?: unknown;
  challenge?: unknown;
  locale?: unknown;
};

type ContactDetails = {
  name: string;
  phone: string;
  service: string;
  project: string;
  challenge: string;
  locale: string;
};

const REQUIRED_FIELDS: Array<keyof Omit<ContactDetails, "locale" | "challenge">> = [
  "name",
  "phone",
  "service",
  "project",
];

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createEmailText(details: ContactDetails) {
  return [
    "New consulting session request",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Service: ${details.service}`,
    `Project: ${details.project}`,
    `Challenge: ${details.challenge}`,
    `Locale: ${details.locale}`,
  ].join("\n");
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function createEmailMessage(details: ContactDetails, from: string, to: string) {
  const subject = `New booking request from ${details.name}`;
  const boundary = `boundary-${Date.now().toString(36)}`;

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    createEmailText(details),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    createEmailHtml(details),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

type SmtpClient = net.Socket | tls.TLSSocket;

class SmtpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmtpError";
  }
}

function createDebugId() {
  return `contact-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

function getResponseDebug(error: unknown) {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  return {
    error: formatError(error),
    smtp: getSmtpConfigDebugInfo(),
  };
}

function redactSmtpCommand(command: string) {
  if (/^AUTH\b/i.test(command)) {
    return "AUTH <redacted>";
  }

  if (!command.includes(" ")) {
    return "<redacted>";
  }

  return command;
}

function readSmtpResponse(socket: SmtpClient) {
  return new Promise<string>((resolve, reject) => {
    let response = "";

    function cleanup() {
      socket.off("data", onData);
      socket.off("error", onError);
    }

    function onError(error: Error) {
      cleanup();
      reject(error);
    }

    function onData(chunk: Buffer) {
      response += chunk.toString("utf8");
      const lines = response.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(response);
      }
    }

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendSmtpCommand(socket: SmtpClient, command: string, expectedCodes: string[]) {
  socket.write(`${command}\r\n`);
  const response = await readSmtpResponse(socket);

  if (!expectedCodes.some((code) => response.startsWith(code))) {
    throw new SmtpError(
      `SMTP command failed: ${redactSmtpCommand(command)}. Expected ${expectedCodes.join(
        ", "
      )}, received: ${response.trim()}`
    );
  }

  return response;
}

function connectSmtp(host: string, port: number) {
  return new Promise<net.Socket>((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => resolve(socket));
    socket.setTimeout(15000);
    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("SMTP connection timed out"));
    });
    socket.once("error", reject);
  });
}

function upgradeToTls(socket: net.Socket, host: string) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const secureSocket = tls.connect({ socket, servername: host }, () => resolve(secureSocket));
    secureSocket.once("error", reject);
  });
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.MTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const recipient = process.env.RECIPIENT_EMAIL || process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || user;

  if (!host || !port || !user || !password || !recipient || !from) {
    return null;
  }

  return { host, port, user, password, recipient, from };
}

function getSmtpConfigDebugInfo() {
  return {
    hasHost: Boolean(process.env.SMTP_HOST),
    port: process.env.SMTP_PORT || process.env.MTP_PORT || "587",
    hasUser: Boolean(process.env.SMTP_USER),
    hasPassword: Boolean(process.env.SMTP_PASSWORD),
    hasRecipient: Boolean(process.env.RECIPIENT_EMAIL || process.env.CONTACT_TO_EMAIL),
    hasFrom: Boolean(process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER),
  };
}

async function sendSmtpEmail(details: ContactDetails, debugId: string) {
  const config = getSmtpConfig();

  if (!config) {
    console.warn("[api/contact] SMTP is not fully configured", {
      debugId,
      smtp: getSmtpConfigDebugInfo(),
    });

    return { configured: false, sent: false };
  }

  console.info("[api/contact] Sending SMTP email", {
    debugId,
    host: config.host,
    port: config.port,
    recipient: config.recipient,
    from: config.from,
  });

  let socket: SmtpClient | null = await connectSmtp(config.host, config.port);

  try {
    const greeting = await readSmtpResponse(socket);

    if (!greeting.startsWith("220")) {
      throw new Error("SMTP greeting failed");
    }

    await sendSmtpCommand(socket, `EHLO ${config.host}`, ["250"]);
    await sendSmtpCommand(socket, "STARTTLS", ["220"]);
    socket = await upgradeToTls(socket as net.Socket, config.host);
    await sendSmtpCommand(socket, `EHLO ${config.host}`, ["250"]);
    await sendSmtpCommand(socket, "AUTH LOGIN", ["334"]);
    await sendSmtpCommand(socket, Buffer.from(config.user, "utf8").toString("base64"), ["334"]);
    await sendSmtpCommand(socket, Buffer.from(config.password, "utf8").toString("base64"), ["235"]);
    await sendSmtpCommand(socket, `MAIL FROM:<${config.user}>`, ["250"]);
    await sendSmtpCommand(socket, `RCPT TO:<${config.recipient}>`, ["250", "251"]);
    await sendSmtpCommand(socket, "DATA", ["354"]);
    await sendSmtpCommand(
      socket,
      `${createEmailMessage(details, config.from, config.recipient)}\r\n.`,
      ["250"]
    );
    await sendSmtpCommand(socket, "QUIT", ["221"]);

    console.info("[api/contact] SMTP email sent", {
      debugId,
      recipient: config.recipient,
    });

    return { configured: true, sent: true };
  } finally {
    socket?.destroy();
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createEmailHtml(details: ContactDetails) {
  const rows = [
    ["Name", details.name],
    ["Phone", details.phone],
    ["Service", details.service],
    ["Project", details.project],
    ["Challenge", details.challenge],
    ["Locale", details.locale],
  ];

  return `
    <h2>New consulting session request</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <th align="left" style="border: 1px solid #ddd; background: #f7f7f7;">${label}</th>
              <td style="border: 1px solid #ddd;">${escapeHtml(value)}</td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

export async function POST(request: Request) {
  const debugId = createDebugId();
  let body: ContactRequest;

  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/contact] Invalid JSON request body", {
      debugId,
      error: formatError(error),
    });

    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_JSON",
        debugId,
        message: "Request body must be valid JSON.",
      },
      { status: 400 }
    );
  }

  const details: ContactDetails = {
    name: normalizeText(body.name),
    phone: normalizeText(body.phone),
    service: normalizeText(body.service),
    project: normalizeText(body.project),
    challenge: normalizeText(body.challenge),
    locale: normalizeText(body.locale) || "unknown",
  };

  const missingFields = REQUIRED_FIELDS.filter((field) => !details[field]);

  if (missingFields.length > 0) {
    console.warn("[api/contact] Validation failed", {
      debugId,
      missingFields,
    });

    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        debugId,
        message: "Please fill all required fields.",
        errors: missingFields.map((field) => ({ field, message: "Required field." })),
      },
      { status: 400 }
    );
  }

  try {
    console.info("[api/contact] Contact request received", {
      debugId,
      service: details.service,
      locale: details.locale,
      hasPhone: Boolean(details.phone),
    });

    const email = await sendSmtpEmail(details, debugId);

    if (email.configured && !email.sent) {
      console.error("[api/contact] Email sending failed without thrown error", {
        debugId,
        email,
      });

      return NextResponse.json(
        {
          ok: false,
          code: "EMAIL_SEND_FAILED",
          debugId,
          message: "The request was valid, but the email could not be sent.",
          email,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      code: "CONTACT_REQUEST_RECEIVED",
      debugId,
      message: email.sent
        ? "Booking request sent by email."
        : "Booking request received. Configure email environment variables to send emails.",
      email,
      data: {
        name: details.name,
        phone: details.phone,
        service: details.service,
        project: details.project,
        challenge: details.challenge,
        locale: details.locale,
      },
    });
  } catch (error) {
    const isSmtpError = error instanceof SmtpError;

    console.error("[api/contact] Unexpected contact request failure", {
      debugId,
      error: formatError(error),
      smtp: getSmtpConfigDebugInfo(),
      request: {
        service: details.service,
        locale: details.locale,
        hasName: Boolean(details.name),
        hasPhone: Boolean(details.phone),
        hasProject: Boolean(details.project),
        hasChallenge: Boolean(details.challenge),
      },
    });

    return NextResponse.json(
      {
        ok: false,
        code: isSmtpError ? "EMAIL_SEND_FAILED" : "CONTACT_REQUEST_FAILED",
        debugId,
        message: isSmtpError
          ? "The request was valid, but the email could not be sent."
          : "Unexpected error while handling the booking request.",
        debug: getResponseDebug(error),
      },
      { status: isSmtpError ? 502 : 500 }
    );
  }
}
