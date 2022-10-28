import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { paths } from './lib/paths';
import { apolloClient } from './lib/apolloClient';
import './lib/i18n';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { Error404Page } from './components/Error/Error404Page';
import { HomePage } from 'pages/HomePage';
import { EventDetailPage } from 'pages/EventDetailPage';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  // Currently causes problems with:
  // * Apollo: https://github.com/apollographql/apollo-client/issues/6832
  // * Ant Design: https://github.com/ant-design/ant-design/issues/22493
  // Try to reactivate when solved
  // <StrictMode>
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error404Page />} />
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.event(':id')} element={<EventDetailPage />} />
        <Route path={paths.restaurant('*')} element={<RestaurantsPage />} />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>,
  // </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
