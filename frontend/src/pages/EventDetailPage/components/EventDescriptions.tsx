import { Text, VStack, Avatar, HStack, Box } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { IEventQuery } from '../gql/event.generated';
import { DescriptionItem } from '~/components/DescriptionItem';
import { GreenCheckMark, RedStopSign } from '~/components/Icons';
import { getCommonRestaurantDescriptions } from '~/components/getCommonRestaurantDescriptions';
import { getCreatedUpdatedDescriptions } from '~/components/getCreatedUpdatedDescriptions';

export const EventDescriptions: FunctionComponent<{
  event: NonNullable<IEventQuery['event']>;
}> = ({ event }) => {
  const { t } = useTranslation();
  return (
    <VStack width="100%">
      <DescriptionItem
        label={t('pages.events.eventDetail.eventDescriptions.statusLabel')}
        direction="column"
      >
        {event.active ? (
          <HStack>
            <GreenCheckMark />
            <Box>
              {t('pages.events.eventDetail.eventDescriptions.statusActive')}
            </Box>
          </HStack>
        ) : !event.lotteryWinner ? (
          <HStack>
            <RedStopSign />{' '}
            <Box>
              {t('pages.events.eventDetail.eventDescriptions.statusClosed')}
            </Box>
          </HStack>
        ) : (
          <HStack>
            <Avatar src={event.lotteryWinner.avatarUrl} size="sm" />{' '}
            <Box>
              {t('pages.events.eventDetail.eventDescriptions.lotteryWinner', {
                name: event.lotteryWinner.fullName,
              })}
            </Box>
          </HStack>
        )}
      </DescriptionItem>
      {getCommonRestaurantDescriptions({ restaurant: event.restaurant, t })}
      {getCreatedUpdatedDescriptions({ entity: event, t })}
      <DescriptionItem
        label={t('pages.events.eventDetail.eventDescriptions.description')}
        direction="column"
      >
        <Text>{event.description}</Text>
      </DescriptionItem>
    </VStack>
  );
};
