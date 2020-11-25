export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'dev-secret',
    enabled: process.env.REQUIRE_AUTHENTICATION ? process.env.REQUIRE_AUTHENTICATION !== 'false' : true,
};
