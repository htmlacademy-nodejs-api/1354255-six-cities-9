import { CommentRules, RatingRules } from '../../../helpers/consts.js';

export const CommentValidationMessage = {
  text: {
    invalidFormat: 'text must be a string',
    invalid: `min length is ${CommentRules.MIN_LENGTH}, max is ${CommentRules.MAX_LENGTH}`,
  },

  rating: {
    invalidFormat: 'rating must be a number',
    minValue: `Rating must be at least ${RatingRules.MIN}`,
    maxValue: `Rating must not be greater than ${RatingRules.MAX}`
  },
} as const;
