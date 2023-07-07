import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = <string>process.env.JWT_SECRET;

const generateToken = (email: string): string => {
   const jwt = sign({ email }, JWT_SECRET, { expiresIn: '30 days' });
   return jwt;
};

const verifyToken = (token: string) => {
   const tokenPayload = verify(token, JWT_SECRET);
   return tokenPayload;
};

export { generateToken, verifyToken };
