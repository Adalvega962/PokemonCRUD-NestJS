import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    // Show error if the value is not a valid MongoID
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ID: ${value}`);
    }
    return value.toUpperCase();
  }
}
