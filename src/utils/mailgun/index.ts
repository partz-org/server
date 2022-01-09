import * as mailgun from "mailgun-js";

const auth = {
  apiKey: process.env.MAILGUN_KEY!,
  domain: "contact.wej-app.xyz",
  host: "api.eu.mailgun.net",
};
export const mg = mailgun(auth);
