import { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { RestaurantListPage } from './pages/RestaurantListPage';

export const RestaurantsPage: FunctionComponent = () => (
  <Routes>
    <Route path={':id'} element={<RestaurantDetailPage />} />
    <Route path={'/'} element={<RestaurantListPage />} />
  </Routes>
);
