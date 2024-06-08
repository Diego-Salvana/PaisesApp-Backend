import cors from 'cors'
import { RequestHandler } from 'express'
import { CorsError } from '../utils/error-handler'

const ACCEPTED_ORIGINS = JSON.parse(process.env.ACCEPTED_ORIGINS ?? '[]')

const corsMiddleware = (acceptedOrigins: string[] = ACCEPTED_ORIGINS): RequestHandler => cors({
   origin: (requestOrigin, callback) => {
      requestOrigin === undefined || acceptedOrigins.includes(requestOrigin)
         ? callback(null, true)
         : callback(new CorsError('Not allowed by CORS'))
   }
})

export { corsMiddleware }
