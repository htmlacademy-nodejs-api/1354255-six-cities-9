export const OfferRoute = {
  INDEX: '/',
  OFFER_ID: '/:offerId',
  PREMIUM: '/premium/:city',
  FAVORITE_OFFER: '/:offerId/favorites',
  FAVORITES: '/favorites',
} as const;

export const UserRoute = {
  LOGIN: '/login',
  REGISTER: '/register',
  UPLOAD_AVATAR: '/:userId/avatar',
} as const;
