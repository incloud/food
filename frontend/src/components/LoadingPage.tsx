import { FunctionComponent } from 'react';
import { DefaultLayout } from './DefaultLayout';
import { Loading } from './Loading';

export const LoadingPage: FunctionComponent = () => (
  <DefaultLayout>
    <Loading />
  </DefaultLayout>
);
