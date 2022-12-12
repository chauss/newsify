import axios from "axios";

const api =
  "https://api.sunrisesunset.io/json?lat=51.181340&lng=6.916040&timezone=CET&date=today";

export type SunlightData = {
  sunrise: string;
  sunset: string;
  first_light: string;
  last_light: string;
  dawn: string;
  dusk: string;
  solar_noon: string;
  golden_hour: string;
  day_length: string;
};

export const getSunlightData = async () => {
  const result = await axios.get(api, {
    headers: {
      "Accept-Encoding": "application/json",
    },
  });

  return result.data.results as SunlightData;
};
