import { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteDetailPage } from '~/pages/SitesPage/pages/SiteDetailPage';
import { SiteListPage } from '~/pages/SitesPage/pages/SiteListPage';

export const SitesPage: FunctionComponent = () => (
  <Routes>
    <Route path=":id" element={<SiteDetailPage />} />
    <Route path="/" element={<SiteListPage />} />
  </Routes>
);
