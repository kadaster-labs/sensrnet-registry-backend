import { v4 } from 'uuid';

export const jwtConstants = {
    secret: process.env.JWT_SECRET || v4(),
};
