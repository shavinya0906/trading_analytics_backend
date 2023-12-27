import jwtWebToken from 'jsonwebtoken';

export function generateToken(data: any): string {
  return jwtWebToken.sign({ ...data }, process.env.JWT_PASSWORD, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
}

export const decodeToken = async (token: string) => {
  return jwtWebToken.verify(token, process.env.JWT_PASSWORD);
};
