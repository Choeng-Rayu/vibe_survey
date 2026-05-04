// Requirement 3: JWT configuration for authentication
export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
});
