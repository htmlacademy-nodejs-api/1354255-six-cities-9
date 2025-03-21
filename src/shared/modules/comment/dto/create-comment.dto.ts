import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import {
  CommentRules,
  RatingRules,
} from '../../../helpers/consts.js';
import { CommentValidationMessage } from './comment-validation-message.js';

export class CreateCommentDto {
  @IsString({ message: CommentValidationMessage.text.invalidFormat })
  @Length(CommentRules.MIN_LENGTH, CommentRules.MAX_LENGTH, { message: CommentValidationMessage.text.invalid })
  @Expose()
  public text: string;

  @IsInt({ message: CommentValidationMessage.rating.invalidFormat })
  @Min(RatingRules.MIN, { message: CommentValidationMessage.rating.minValue })
  @Max(RatingRules.MAX, { message: CommentValidationMessage.rating.maxValue })
  @Expose()
  public rating: number;

  public author: string;

  public offer: string;
}
