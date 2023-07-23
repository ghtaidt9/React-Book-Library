export const oktaConfig = {
  clientId: "0oaadr0s9bOMX9bed5d7",
  issuer: "https://dev-98048027.okta.com/oauth2/default",
  redirectUri: "https://localhost:3000/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: true,
  disableHttpsCheck: true,
  //useInteractionCodeFlow: false,
   useClassicEngine: true,
};
