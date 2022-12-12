import { getOffers } from "./apis/epicgames.js";
import { getPublicIpAddress } from "./apis/ipaddress.js";
import { getSunlightData } from "./apis/sunlight.js";
import { sendMail } from "./helper/email.js";

const { offers, upcomingOffers } = await getOffers();
for (const offer of offers) {
  console.log("Currently Freegame " + offer.title);
}

for (const offer of upcomingOffers) {
  console.log(
    "Upcoming Freegame from " + offer.startDate + " # " + offer.title
  );
}

const publicIpAdress = await getPublicIpAddress();
console.log("Public ip address: " + publicIpAdress);

const sunlightData = await getSunlightData();
console.log({ sunlightData });

sendMail({
  currentFreeGames: offers,
  upcomingFreeGames: upcomingOffers,
  publicIpAdress,
  sunlightData,
});
