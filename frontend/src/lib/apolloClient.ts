import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

export const gqlFetcher: typeof fetch = async (input, options) => {
  const response = await fetch(input, {
    ...options,
    redirect: 'manual',
  });

  // The backend will try to redirect us when not logged in
  // We can intercept this and redirect the whole browser to the login page
  if (response.type === 'opaqueredirect') {
    window.location.replace('/oauth2/authorization/oidc');
  }

  return response;
};

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: '/graphql',
    fetch: gqlFetcher,
  }),
});
