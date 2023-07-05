import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Error404Page } from '~/components/Error/Error404Page';
import { apolloClient } from '~/lib/apolloClient';
import { paths } from '~/lib/paths';
import { EventDetailPage } from '~/pages/EventDetailPage';
import { HomePage } from '~/pages/HomePage';
import { RestaurantsPage } from '~/pages/RestaurantsPage';
import { theme } from '~/theme';

export const App = () => (
  <ChakraProvider theme={theme}>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Error404Page />} />
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.event(':id')} element={<EventDetailPage />} />
          <Route path={paths.restaurant('*')} element={<RestaurantsPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </ChakraProvider>
);
