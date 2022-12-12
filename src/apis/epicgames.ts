import axios from "axios";

const api =
  "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=DE";

type Offer = {
  title: string;
};

type UpcomingOffer = {
  title: string;
  startDate: string;
  endDate: string;
};

type GetOffersResult = {
  offers: Offer[];
  upcomingOffers: UpcomingOffer[];
};

const getDateTimeString = (date: Date) => {
  return date.getHours() + ":" + date.getMinutes() + " - " + date.getDate();
};

const extractOffer = (element: any, upcoming: boolean) => {
  if (upcoming) {
    const startDate = new Date(
      element.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0]?.startDate
    );
    const endDate = new Date(
      element.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate
    );
    return {
      title: element.title,
      startDate: getDateTimeString(startDate),
      endDate: getDateTimeString(startDate),
    } as UpcomingOffer;
  } else {
    return {
      title: element.title,
    } as Offer;
  }
};

export const getOffers = async () => {
  const currentOfferElements: Offer[] = [];
  const upcomingOfferElements: Offer[] = [];

  const result = await axios.get(api);

  const json = result.data;
  for (const element of json.data.Catalog.searchStore.elements) {
    if (element.promotions) {
      const offers = element.promotions.promotionalOffers;
      if (offers && offers.length > 0) {
        for (const offer of offers) {
          const innerOffers = offer.promotionalOffers;
          if (innerOffers && innerOffers.length > 0) {
            for (const innerOffer of innerOffers) {
              if (innerOffer.discountSetting.discountPercentage === 0) {
                currentOfferElements.push(extractOffer(element, false));
              }
            }
          }
        }
      }
      const upcomingOffers = element.promotions.upcomingPromotionalOffers;
      if (upcomingOffers && upcomingOffers.length > 0) {
        for (const upcomingOffer of upcomingOffers) {
          const innerOffers = upcomingOffer.promotionalOffers;
          if (innerOffers && innerOffers.length > 0) {
            for (const innerOffer of innerOffers) {
              if (innerOffer.discountSetting.discountPercentage === 0) {
                upcomingOfferElements.push(extractOffer(element, true));
              }
            }
          }
        }
      }
    }
  }
  return {
    offers: currentOfferElements,
    upcomingOffers: upcomingOfferElements,
  } as GetOffersResult;
};
