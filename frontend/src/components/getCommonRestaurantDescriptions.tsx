import { LinkOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from '@chakra-ui/react';
import { TFunction } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { GreenCheckMark, RedStopSign } from './Icons';
import { DescriptionItem } from '~/components/DescriptionItem';
import { paths } from '~/lib/paths';
import { IRestaurant, ISite } from '~/types.generated';

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
        <DescriptionItem key="name" label={t('common.restaurant')}>
          <Link
            colorScheme="brand"
            as={RouterLink}
            to={paths.restaurant(restaurant.id)}
          >
            <strong>{restaurant.name}</strong>
          </Link>
        </DescriptionItem>,
      ]
    : [];

  if (restaurant.website) {
    items.push(
      <DescriptionItem
        key="name"
        label={t('common.restaurantDescription.website')}
      >
        <LinkOutlined />{' '}
        <Link
          isExternal={true}
          href={restaurant.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {restaurant.website}
        </Link>
      </DescriptionItem>,
    );
  }

  if (restaurant.phone) {
    items.push(
      <DescriptionItem
        key="phone"
        label={t('common.restaurantDescription.phone')}
      >
        <PhoneOutlined />{' '}
        <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
      </DescriptionItem>,
    );
  }

  if (restaurant.address) {
    items.push(
      <DescriptionItem
        key="address"
        label={t('common.restaurantDescription.address')}
      >
        <address>{restaurant.address}</address>
      </DescriptionItem>,
    );
  }

  if (restaurant.comment) {
    items.push(
      <DescriptionItem
        key="comment"
        label={t('common.restaurantDescription.comment')}
      >
        <span>{restaurant.comment}</span>
      </DescriptionItem>,
    );
  }

  items.push(
    ...[
      <DescriptionItem key="site" label={t('common.site')}>
        {restaurant.site.name}
      </DescriptionItem>,
      <DescriptionItem
        key="delivery"
        label={t('common.restaurantDescription.delivery')}
      >
        {restaurant.delivery ? (
          <>
            <GreenCheckMark /> {t('common.yes')}
          </>
        ) : (
          <>
            <RedStopSign /> {t('common.no')}
          </>
        )}
      </DescriptionItem>,
    ],
  );

  return items;
};
