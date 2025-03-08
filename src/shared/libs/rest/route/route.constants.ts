export const OfferRoute = {
  INDEX: '/',
  OFFER_ID: '/:offerId'
} as const;

export const UserRoute = {
  LOGIN: '/login',
  REGISTER: '/register',
  UPLOAD: '/:userId/avatar',
} as const;
