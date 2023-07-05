import { Avatar, Box, HStack } from '@chakra-ui/react';
import { TFunction } from 'react-i18next';
import { Timestamp } from './Timestamp';
import { DescriptionItem } from '~/components/DescriptionItem';
import { IUser } from '~/types.generated';

// Workaround for FunctionComponents not allowing array return values
export const getCreatedUpdatedDescriptions = ({
  entity,
  t,
}: {
  entity: {
    createdAt?: number | null;
    createdBy?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
    updatedAt?: number | null;
    updatedBy?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
  };
  t: TFunction;
}) => {
  const items = [];

  if (entity.createdAt) {
    items.push(
      <DescriptionItem key="created" label={t('common.created')}>
        <Timestamp timestamp={entity.createdAt} />
      </DescriptionItem>,
    );
  }

  if (entity.createdBy) {
    items.push(
      <DescriptionItem key="created" label={t('common.createdBy')}>
        <HStack>
          <Avatar src={entity.createdBy.avatarUrl} size="sm" />
          <Box>{entity.createdBy.fullName}</Box>
        </HStack>
      </DescriptionItem>,
    );
  }

  if (entity.updatedAt) {
    items.push(
      <DescriptionItem key="updated" label={t('common.updatedAt')}>
        <Timestamp timestamp={entity.updatedAt} />
      </DescriptionItem>,
    );
  }

  if (entity.updatedBy) {
    items.push(
      <DescriptionItem key="updated" label={t('common.updatedBy')}>
        <HStack>
          <Avatar src={entity.updatedBy.avatarUrl} size="sm" />
          <Box>{entity.updatedBy.fullName}</Box>
        </HStack>
      </DescriptionItem>,
    );
  }

  return items;
};
