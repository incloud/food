import { Box, Heading, List, ListItem } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ISiteQuery } from '~/pages/SitesPage/pages/SiteDetailPage/gql/site.generated';

interface ISiteDetailDisplayProps {
  site: ISiteQuery['site'];
}

export const SiteDetailDisplay: FunctionComponent<ISiteDetailDisplayProps> = ({
  site,
}) => {
  const { t } = useTranslation();

  if (site == null) {
    return null;
  }

  return (
    <Box width="100%">
      <Heading as="h3">{t('common.webhook_plural')}</Heading>
      <List>
        {site.webhooks.map(webhook => (
          <ListItem>
            {webhook.name} ({webhook.url})
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
