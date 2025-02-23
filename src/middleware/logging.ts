import { Request, Response, NextFunction } from 'express';

export const logging = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next(); 
};
