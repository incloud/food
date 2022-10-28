import { LinkOutlined, PhoneOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Descriptions } from 'antd';
import { paths } from 'lib/paths';
import { TFunction } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IRestaurant, ISite } from 'types.generated';
import { GreenCheckMark, RedStopSign } from './Icons';
import { Fragment } from 'react';

// Workaround for FunctionComponents not allowing array return values
export const getCommonRestaurantDescriptions = ({
  restaurant,
  showName = true,
  t,
}: {
  restaurant: Pick<
    IRestaurant,
    'id' | 'name' | 'website' | 'phone' | 'address' | 'comment' | 'delivery'
  > & {
    site: Pick<ISite, 'name'>;
  };
  showName?: boolean;
  t: TFunction;
}) => {
  const items = showName
    ? [
        <Descriptions.Item key="name" label={t('common.restaurant')}>
          <Link to={paths.restaurant(restaurant.id)}>
            <strong>{restaurant.name}</strong>
          </Link>
        </Descriptions.Item>,
      ]
    : [];

  if (restaurant.website) {
    items.push(
      <Descriptions.Item
        key="name"
        label={t('common.restaurantDescription.website')}
      >
        <LinkOutlined />{' '}
        <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
          {restaurant.website}
        </a>
      </Descriptions.Item>,
    );
  }

  if (restaurant.phone) {
    items.push(
      <Descriptions.Item
        key="phone"
        label={t('common.restaurantDescription.phone')}
      >
        <PhoneOutlined />{' '}
        <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
      </Descriptions.Item>,
    );
  }

  if (restaurant.address) {
    items.push(
      <Descriptions.Item
        key="address"
        label={t('common.restaurantDescription.address')}
      >
        <address
          css={css`
            white-space: pre-wrap;
          `}
        >
          {restaurant.address}
        </address>
      </Descriptions.Item>,
    );
  }

  if (restaurant.comment) {
    items.push(
      <Descriptions.Item
        key="comment"
        label={t('common.restaurantDescription.comment')}
      >
        <span
          css={css`
            white-space: pre-wrap;
          `}
        >
          {restaurant.comment}
        </span>
      </Descriptions.Item>,
    );
  }

  items.push(
    ...[
      <Descriptions.Item key="site" label={t('common.site')}>
        {restaurant.site.name}
      </Descriptions.Item>,
      <Descriptions.Item
        key="delivery"
        label={t('common.restaurantDescription.delivery')}
      >
        {restaurant.delivery ? (
          <Fragment>
            <GreenCheckMark /> {t('common.yes')}
          </Fragment>
        ) : (
          <Fragment>
            <RedStopSign /> {t('common.no')}
          </Fragment>
        )}
      </Descriptions.Item>,
    ],
  );

  return items;
};
