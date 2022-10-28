import { Avatar, Descriptions } from 'antd';
import { defaultBottomMargin } from '../../../lib/styles';
import { GreenCheckMark, RedStopSign } from '../../../components/Icons';
import { IEventQuery } from '../gql/event.generated';
import { useTranslation } from 'react-i18next';
import { getCommonRestaurantDescriptions } from 'components/getCommonRestaurantDescriptions';
import { getCreatedUpdatedDescriptions } from 'components/getCreatedUpdatedDescriptions';
import { FunctionComponent } from 'react';
import { Fragment } from 'react';

export const EventDescriptions: FunctionComponent<{
  event: NonNullable<IEventQuery['event']>;
}> = ({ event }) => {
  const { t } = useTranslation();
  return (
    <Descriptions
      size="small"
      column={{ xs: 1, sm: 2, md: 3 }}
      css={defaultBottomMargin}
      bordered
    >
      <Descriptions.Item
        label={t('pages.events.eventDetail.eventDescriptions.statusLabel')}
      >
        {event.active ? (
          <Fragment>
            <GreenCheckMark />{' '}
            {t('pages.events.eventDetail.eventDescriptions.statusActive')}
          </Fragment>
        ) : !event.lotteryWinner ? (
          <Fragment>
            <RedStopSign />{' '}
            {t('pages.events.eventDetail.eventDescriptions.statusClosed')}
          </Fragment>
        ) : (
          <Fragment>
            <Avatar src={event.lotteryWinner.avatarUrl} size="small" />{' '}
            {t('pages.events.eventDetail.eventDescriptions.lotteryWinner', {
              name: event.lotteryWinner.fullName,
            })}
          </Fragment>
        )}
      </Descriptions.Item>

      {getCommonRestaurantDescriptions({ restaurant: event.restaurant, t })}

      {getCreatedUpdatedDescriptions({ entity: event, t })}
    </Descriptions>
  );
};
