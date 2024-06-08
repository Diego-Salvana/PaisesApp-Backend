import { JwtPayload, sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

const generateToken = (email: string): string => {
   const jwt = sign({ email }, JWT_SECRET, { expiresIn: '30 days' })
   return jwt
}

const verifyToken = (token: string): string | JwtPayload => {
   const tokenPayload = verify(token, JWT_SECRET)
   return tokenPayload
}

export { generateToken, verifyToken }
