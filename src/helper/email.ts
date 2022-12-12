import nodemailer from "nodemailer";
import { readFile } from "fs";
import { TemplateEngine } from "thymeleaf";
import { SunlightData } from "../apis/sunlight";

type MailContent = {
  currentFreeGames: object;
  upcomingFreeGames: object;
  publicIpAdress: string;
  sunlightData: SunlightData;
};

const getHtmlTempalte = async () => {
  const templateFile = new URL(
    "../../assets/emailTemplate.html",
    import.meta.url
  );

  return new Promise<string>((resolve, reject) => {
    readFile(templateFile, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const processTemplate = async (content: MailContent) => {
  const template = await getHtmlTempalte();
  let templateEngine = new TemplateEngine();

  return new Promise<string>((resolve, reject) => {
    templateEngine
      .process(template, content)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sender-email-address",
    pass: "password",
  },
});

export const sendMail = async (content: MailContent) => {
  const email = await processTemplate(content);

  console.log({ games: content.upcomingFreeGames });
  console.log(email);

  const mailOptions = {
    to: "your-email-address",
    subject: "Your Daily Newsletter",
    html: email,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + JSON.stringify(info, null, 2));
    }
  });
};
