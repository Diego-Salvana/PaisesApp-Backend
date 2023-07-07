import { Auth } from '../interfaces/AuthUser.interface';
import { User } from '../interfaces/AuthUser.interface';
import { UserModel } from '../models/user.model';
import { encrypt, verify } from '../utils/bcryptjs.handle';
import { generateToken } from '../utils/jwt.handle';

const createUser = async (user: User) => {
   const passwordHash = await encrypt(user.password);
   const registerUser = { ...user, password: passwordHash };

   const { username, email } = await UserModel.create(registerUser);

   const JWToken = generateToken(email);

   return { username, JWToken };
};

const loginUser = async ({ email, password }: Auth) => {
   const user = await UserModel.findOne({ email });
   if (!user) return 'USER_NOT_FOUND';

   const passwordHash = user.password;
   const passwordIsCorrect = await verify(password, passwordHash);
   if (!passwordIsCorrect) return 'INCORRECT_PASSWORD';

   const JWToken = generateToken(user.email);

   const { username, favorites } = user;
   return { username, favorites, JWToken };
};

const deleteUser = async (email: string) => {
   const cleanUserResult = await UserModel.deleteOne({ email });
   if (cleanUserResult.deletedCount === 0) return 'USER_NOT_FOUND';

   return cleanUserResult;
};

const addOneFavorite = async (email: string, cca3Code: string) => {
   const user = await UserModel.findOne({ email });
   if (!user) return 'USER_NOT_FOUND';
   if (user.favorites.includes(cca3Code)) return 'FAVORITE_ALREADY_EXISTS';

   user.favorites.push(cca3Code);

   const modifiedUser = await UserModel.findOneAndUpdate(
      { email: user.email },
      { favorites: user.favorites },
      { new: true }
   );

   return modifiedUser?.favorites;
};

const removeFavorite = async (email: string, cca3Code: string) => {
   const user = await UserModel.findOne({ email });
   if (!user) return 'USER_NOT_FOUND';

   const updatedFavorites = user.favorites.filter((code) => code !== cca3Code);

   const modifiedUser = await UserModel.findOneAndUpdate(
      { email: user.email },
      { favorites: updatedFavorites },
      { new: true }
   );

   return modifiedUser?.favorites;
};

const refreshToken = async (email: string) => {
   const user = await UserModel.findOne({ email });
   if (!user) return 'USER_NOT_FOUND';

   const JWToken = generateToken(user.email);

   const { username, favorites } = user;
   return { username, favorites, JWToken };
};

export { createUser, loginUser, deleteUser, addOneFavorite, removeFavorite, refreshToken };
