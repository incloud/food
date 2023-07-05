import { SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  HStack,
  VStack,
  Box,
  Heading,
  Spacer,
  Link,
  List,
  ListItem,
  Button,
  Divider,
  Input,
  InputGroup,
  InputRightAddon,
  Flex,
  StackDivider,
} from '@chakra-ui/react';
import { FunctionComponent, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useEventsQuery } from './gql/events.generated';
import { DefaultLayout } from '~/components/DefaultLayout';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { EventForm } from '~/components/EventForm';
import { GreenCheckMark, RedStopSign } from '~/components/Icons';
import { LinkButton } from '~/components/LinkButton';
import { PageTitle } from '~/components/PageTitle';
import { Timestamp } from '~/components/Timestamp';
import { useCurrentUserQuery } from '~/gql/user.generated';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { paths } from '~/lib/paths';

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
    //pollInterval: 5000,
  });

  const handleLoadMore = useCallback(
    () =>
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
      }),
    [data?.events.length, fetchMore],
  );

  if (error) {
    return <ErrorUnknownPage />;
  }

  return (
    <DefaultLayout>
      <VStack width="100%" maxWidth="8xl" marginX="auto" paddingX={4}>
        <PageTitle title={t('pages.events.eventList.title')}>
          <Box>
            <InputGroup>
              <Input
                placeholder={t('pages.events.eventList.searchPlaceholder')}
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
              <InputRightAddon>
                <SearchOutlined />
              </InputRightAddon>
            </InputGroup>
          </Box>
          <Box>
            <Button
              colorScheme="brand"
              onClick={() => setCreateFormOpen(true)}
              isDisabled={createFormOpen}
            >
              {t('pages.events.eventList.createEventButton')}
            </Button>
          </Box>
        </PageTitle>
        {createFormOpen && (
          <>
            <EventForm
              onFinish={() => {
                setCreateFormOpen(false);
                void refetch();
              }}
              onCancel={() => setCreateFormOpen(false)}
            />
            <Divider />
          </>
        )}

        <List>
          {data?.events.map(item => (
            <ListItem key={item.id}>
              <HStack>
                <Box>
                  <Avatar src={item.createdBy.avatarUrl} />
                </Box>
                <Heading as="h4" size="md" width="100%">
                  <HStack>
                    <Box>
                      {item.active ? <GreenCheckMark /> : <RedStopSign />}
                    </Box>
                    <Box>
                      <Link as={RouterLink} to={paths.event(item.id)}>
                        {item.name}
                      </Link>
                    </Box>
                  </HStack>
                </Heading>
                <Spacer />
                <Flex flex="1 0 auto">
                  <HStack divider={<StackDivider borderColor="black" />}>
                    <Link
                      as={RouterLink}
                      to={paths.restaurant(item.restaurant.id)}
                    >
                      {item.restaurant.name}
                    </Link>
                    <Timestamp timestamp={item.createdAt} />
                  </HStack>
                </Flex>
                <Box>
                  <LinkButton to={paths.event(item.id)}>
                    {t('pages.events.eventList.gotoButton')}
                  </LinkButton>
                </Box>
              </HStack>
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => void handleLoadMore()}
          isLoading={loading}
          disabled={loading}
        >
          {t('pages.events.eventList.loadMoreButton')}
        </Button>
      </VStack>
    </DefaultLayout>
  );
};
