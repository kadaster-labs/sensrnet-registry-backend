// auth/oidc.strategy.ts
import { Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, UserinfoResponse, TokenSet, Issuer } from 'openid-client';
import { AuthService } from './auth.service';
import { UserToken } from './models/user-token';

export const buildOpenIdClient = async (): Promise<Client> => {
  const TrustIssuer = await Issuer.discover(`${process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER}/.well-known/openid-configuration`);
  const client = new TrustIssuer.Client({
    client_id: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID,
    client_secret: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET,
  });

  return client;
};

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(
    private readonly authService: AuthService, client: Client
  ) {
    super({
      client: client,
      params: {
        redirect_uri: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_REDIRECT_URI,
        scope: process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_SCOPE,
        response_types: ['code', 'token', 'id_token'],
      },
      passReqToCallback: false,
      usePKCE: false,
    });

    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<UserToken> {
    const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);

    try {
      const id_token = tokenset.id_token;
      const access_token = tokenset.access_token;
      const refresh_token = tokenset.refresh_token;
      const user: UserToken = {
        id_token,
        access_token,
        refresh_token,
        userinfo,
      }

      return user;

    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
