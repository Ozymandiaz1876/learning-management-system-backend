import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { base64Decode, base64Encode } from 'src/utils';

@Injectable()
export class IdTransformMiddleware implements NestMiddleware {
  private allowedDepth = 10;
  private currentDepth = 0;

  use(req: Request, res: Response, next: NextFunction) {
    // Convert incoming base64 ID to hex for body and query
    if (req.body && typeof req.body === 'object') {
      this.decodeIdFromBase64(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      this.decodeIdFromBase64(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      this.decodeIdFromBase64(req.params);
    }

    const originalJson = res.json.bind(res);

    this.currentDepth = 0;

    res.json = (body: any) => {
      if (body && typeof body === 'object') {
        this.convertIdToBase64(body);
      }
      return originalJson(body);
    };

    this.currentDepth = 0;

    next();
  }

  private decodeIdFromBase64(obj: any) {
    this.currentDepth++;
    if (this.currentDepth > this.allowedDepth) {
      return;
    }
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        this.decodeIdFromBase64(obj[key]);
      } else if (
        key === '_id' ||
        key.toLowerCase().endsWith('id') ||
        key.toLowerCase().endsWith('urlid') ||
        obj[key].toString().toLowerCase().startsWith('tests')
      ) {
        if (typeof obj[key] === 'string') {
          try {
            let base64string = obj[key].toString();

            if (obj[key].toString().toLowerCase().startsWith('tests')) {
              base64string = obj[key].toString().replace('tests/', '');
            }

            const decodedString = base64Decode(base64string);

            if (!obj[key].toString().toLowerCase().startsWith('tests')) {
              obj[key] = new Types.ObjectId(decodedString);
            } else {
              obj[key] = decodedString;
            }
          } catch (e) {
            console.log(e);
            throw new Error(`Invalid ID: ${obj[key]}`);
          }
        }
      }
    }
  }

  private convertIdToBase64(obj: any) {
    this.currentDepth++;
    if (this.currentDepth > this.allowedDepth) {
      return;
    }
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        this.convertIdToBase64(obj[key]);
      } else if (
        key === '_id' ||
        key.toLowerCase().endsWith('id') ||
        key.toLowerCase().endsWith('Id')
      ) {
        if (Types.ObjectId.isValid(obj[key])) {
          const originalString = obj[key];
          const base64String = base64Encode(originalString);
          obj[key] = base64String;
        }
      }
    }
  }
}
