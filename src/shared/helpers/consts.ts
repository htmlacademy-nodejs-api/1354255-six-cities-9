export const TitleRules = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 100
} as const;

export const DescriptionRules = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 1023
} as const;

export const ImageUrlRules = {
  MAX_LENGTH: 256
} as const;

export const RatingRules = {
  MIN: 1,
  MAX: 5
} as const;

export const RoomRules = {
  MIN: 1,
  MAX: 8
} as const;

export const GuestRules = {
  MIN: 1,
  MAX: 10
} as const;

export const PriceRules = {
  MIN: 100,
  MAX: 100_000
} as const;

export const CommentRules = {
  MIN: 0,
  MAX: 10
};
