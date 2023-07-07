import { Request, Response } from 'express';
import { createUser, deleteUser, loginUser, refreshToken } from '../services/user.service';
import { RequestExt } from '../interfaces/RequestExt.interface';
import { JwtPayload } from 'jsonwebtoken';

const registerCtrl = async ({ body }: Request, res: Response) => {
   try {
      const newUser = await createUser(body);
      res.status(201).send(newUser);
   } catch (err: any) {
      console.log('Auth Controller:', err);
      if (err.code === 11000) {
         res.status(400).send('USER_EMAIL_ALREADY_EXISTS');
      } else {
         res.status(500).send('SERVER_ERROR');
      }
   }
};

const loginCtrl = async ({ body }: Request, res: Response) => {
   try {
      const responseUser = await loginUser(body);

      if (responseUser === 'USER_NOT_FOUND' || responseUser === 'INCORRECT_PASSWORD') {
         res.status(400).send(responseUser);
      } else {
         res.status(200).send(responseUser);
      }
   } catch (err) {
      console.error(err);
      res.status(500).send('SERVER_ERROR');
   }
};

const deleteCtrl = async ({ userPayload }: RequestExt, res: Response) => {
   try {
      const payload = <JwtPayload>userPayload;
      const deleteResult = await deleteUser(payload.email);

      if (deleteResult === 'USER_NOT_FOUND') res.send(deleteResult);
      else res.status(200).send(deleteResult);
   } catch (err) {
      console.error(err);
      res.status(500).send('SERVER_ERROR');
   }
};

const refreshTokenCtrl = async ({ userPayload }: RequestExt, res: Response) => {
   try {
      const payload = <JwtPayload>userPayload;
      const responseUser = await refreshToken(payload.email);

      if (responseUser === 'USER_NOT_FOUND')
         return res.status(401).send({ error: 'UNAUTHORIZED', message: 'User not found.' });

      res.status(200).send(responseUser);
   } catch (err) {
      console.error(err);
      res.status(500).send('SERVER_ERROR');
   }
};

export { loginCtrl, registerCtrl, deleteCtrl, refreshTokenCtrl };
