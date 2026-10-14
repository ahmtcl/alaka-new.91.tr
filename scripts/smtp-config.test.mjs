import assert from "node:assert/strict";
import test from "node:test";
import { getSmtpConfig, getSmtpErrorDetails } from "../src/lib/smtp-config.ts";

test("SMTP dashboard whitespace and literal quotes are normalized", () => {
  const config = getSmtpConfig({
    SMTP_HOST: ' "mail.91.com.tr"\n', SMTP_PORT: " '587' ",
    SMTP_USER: ' "alaka@91.com.tr" ', SMTP_PASS: ' "example-password"\n',
    CONTACT_RECEIVER_EMAIL: " 'receiver@example.com' ",
  });
  assert.equal(config.host, "mail.91.com.tr");
  assert.equal(config.port, 587);
  assert.equal(config.user, "alaka@91.com.tr");
  assert.equal(config.pass, "example-password");
  assert.equal(config.receiver, "receiver@example.com");
  assert.equal(config.normalizedSettings.length, 5);
});

test("inner password whitespace and unmatched quotes are preserved", () => {
  assert.equal(getSmtpConfig({ SMTP_PASS: ' "inner space" ' }).pass, "inner space");
  assert.equal(getSmtpConfig({ SMTP_PASS: '"unmatched' }).pass, '"unmatched');
  assert.equal(getSmtpConfig({ SMTP_PASS: '""quoted""' }).pass, '"quoted"');
});

test("missing settings retain defaults and don't invent credentials", () => {
  const config = getSmtpConfig({});
  assert.equal(config.host, "mail.91.com.tr");
  assert.equal(config.port, 587);
  assert.equal(config.user, undefined);
  assert.equal(config.pass, undefined);
  assert.deepEqual(config.normalizedSettings, []);
  assert.equal(getSmtpConfig({ SMTP_USER: "sender@example.com" }).receiver, "alaka@alakamedia.com");
});

test("diagnostics retain the SMTP rejection but redact credentials and AUTH tokens", () => {
  const config = getSmtpConfig({ SMTP_USER: "sender@example.com", SMTP_PASS: ' "secret-example" ' });
  const encodedPassword = Buffer.from(config.pass).toString("base64");
  const plainToken = Buffer.from(`\0${config.user}\0${config.pass}`).toString("base64");
  const error = {
    code: "EAUTH", command: `AUTH PLAIN ${plainToken}`, responseCode: 535,
    response: `535 Authentication failed ${config.pass} ${encodedPassword}`,
    message: `Invalid login ${config.rawPassword}`,
  };
  const details = getSmtpErrorDetails(error, config);
  const logged = JSON.stringify(details);
  assert.equal(details.responseCode, 535);
  assert.match(details.response, /535 Authentication failed/);
  assert.match(details.command, /AUTH PLAIN \[REDACTED\]/);
  for (const secret of [config.pass, config.rawPassword, encodedPassword, plainToken]) {
    assert.equal(logged.includes(secret), false);
  }
  assert.equal("pass" in details, false);
  assert.equal("rawPassword" in details, false);
});
