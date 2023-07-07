import { Response } from 'express';
import { RequestExt } from '../interfaces/RequestExt.interface';
import { JwtPayload } from 'jsonwebtoken';
import { addOneFavorite, removeFavorite } from '../services/user.service';

const addFavoriteCountry = async ({ body, userPayload }: RequestExt, res: Response) => {
   try {
      const payload = <JwtPayload>userPayload;
      const updatedFavorites = await addOneFavorite(payload.email, body.cca3Code);

      if (updatedFavorites === 'USER_NOT_FOUND' || updatedFavorites === 'FAVORITE_ALREADY_EXISTS')
         return res.status(400).send({ error: updatedFavorites });

      res.status(200).send({ updatedFavorites });
   } catch (err) {
      console.log(err);
      res.status(500).send(err);
   }
};

const removeFavoriteCountry = async ({ body, userPayload }: RequestExt, res: Response) => {
   try {
      const payload = <JwtPayload>userPayload;
      const updatedFavorites = await removeFavorite(payload.email, body.cca3Code);

      if (updatedFavorites === 'USER_NOT_FOUND') return res.status(400).send({ error: updatedFavorites });

      res.status(200).send({ updatedFavorites });
   } catch (err) {
      console.log(err);
      res.status(500).send(err);
   }
};

export { addFavoriteCountry, removeFavoriteCountry };
