import { AuthFlowType, B2BProducts, StytchB2B } from '@stytch/nextjs/b2b';

const config = {
  authFlowType: AuthFlowType.Discovery,
  products: [B2BProducts.emailMagicLinks, B2BProducts.oauth],
  emailMagicLinksOptions: {
    discoveryRedirectURL: 'https://localhost:3000/authenticate',
  },
  oauthOptions: {
    discoveryRedirectURL: 'https://localhost:3000/authenticate',
    providers: ['google'],
  },
  sessionOptions: {
    sessionDurationMinutes: 60,
  },
};

export const LoginOrSignupDiscoveryForm = () => {
  return <StytchB2B config={config} />;
};