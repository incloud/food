import { FunctionComponent, useState } from 'react';
import { DefaultLayout } from 'components/DefaultLayout';
import { Link } from 'react-router-dom';
import { paths } from 'lib/paths';
import { ErrorUnknownPage } from 'components/Error/ErrorUnknownPage';
import { Avatar, Button, Col, Input, List, Row } from 'antd';
import { useDebounce } from 'lib/hooks/useDebounce';
import {
  defaultChildBottomMargin,
  defaultGutter,
  defaultTopMargin,
  textAlignCenter,
} from 'lib/styles';
import { EventForm } from 'components/EventForm';
import { useEventsQuery } from './gql/events.generated';
import { GreenCheckMark, RedStopSign } from 'components/Icons';
import { Timestamp } from 'components/Timestamp';
import { useTranslation } from 'react-i18next';
import { useCurrentUserQuery } from 'gql/user.generated';
import { Fragment } from 'react';

export const HomePage: FunctionComponent = () => {
  const { t } = useTranslation();

  const [searchName, setSearchName] = useState('');
  const searchNameDebounced = useDebounce(searchName);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { data: userData } = useCurrentUserQuery();
  const { data, loading, error, fetchMore, refetch } = useEventsQuery({
    variables: {
      site: userData?.user.site?.id || '',
      name: searchNameDebounced || null,
    },
    skip: !userData?.user.site?.id,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    pollInterval: 5000,
  });

  if (error) {
    return <ErrorUnknownPage />;
  }

  return (
    <DefaultLayout>
      <Row
        justify="space-between"
        gutter={defaultGutter}
        css={defaultChildBottomMargin}
      >
        <Col flex={3}>
          <h2>{t('pages.events.eventList.title')}</h2>
        </Col>
        <Col>
          <Input.Search
            placeholder={t('pages.events.eventList.searchPlaceholder')}
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            loading={loading && !!searchName}
          />
        </Col>
        {!createFormOpen && (
          <Col>
            <Button type="primary" onClick={() => setCreateFormOpen(true)}>
              {t('pages.events.eventList.createEventButton')}
            </Button>
          </Col>
        )}
      </Row>

      {createFormOpen && (
        <EventForm
          onFinish={() => {
            setCreateFormOpen(false);
            refetch();
          }}
          onCancel={() => setCreateFormOpen(false)}
        />
      )}

      <List
        dataSource={data?.events}
        rowKey="id"
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.createdBy.avatarUrl} />}
              title={
                <Fragment>
                  {item.active ? <GreenCheckMark /> : <RedStopSign />}{' '}
                  <Link to={paths.event(item.id)}>{item.name}</Link>
                </Fragment>
              }
              description={
                <Fragment>
                  <Link to={paths.restaurant(item.restaurant.id)}>
                    {item.restaurant.name}
                  </Link>{' '}
                  | <Timestamp timestamp={item.createdAt} />
                </Fragment>
              }
            />
          </List.Item>
        )}
        loading={!data && loading}
        loadMore={
          <div css={textAlignCenter}>
            <Button
              css={defaultTopMargin}
              onClick={() =>
                fetchMore({
                  variables: {
                    offset: data?.events.length,
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                      events: [...prev.events, ...fetchMoreResult.events],
                    });
                  },
                })
              }
              loading={loading}
              disabled={loading}
            >
              {t('pages.events.eventList.loadMoreButton')}
            </Button>
          </div>
        }
      />
    </DefaultLayout>
  );
};
