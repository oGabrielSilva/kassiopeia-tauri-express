import type { Request } from 'express';
import url from 'url';

export class Protocol {
  public static serverURI(req: Request | IRequest<unknown>) {
    // return req.protocol + '://' + req.get('host');
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });
  }
}
