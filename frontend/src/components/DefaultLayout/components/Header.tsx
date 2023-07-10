import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Navigation } from '~/components/DefaultLayout/components/Navigation';
import { SiteSelect } from '~/components/SiteSelect';
import { ICurrentUserQuery } from '~/gql/user.generated';
import { paths } from '~/lib/paths';
import { title } from '~/lib/title';

interface IHeaderProps {
  user?: ICurrentUserQuery['user'];
}

export const Header: FunctionComponent<IHeaderProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <Box as="header" width="100%" backgroundColor="brand.500" color="white">
      <HStack maxWidth="8xl" marginX="auto" paddingX={4} paddingY={2}>
        <Box>
          <HStack>
            <Box>
              <Link to={paths.home}>
                <Heading as="h1" size="md" fontFamily="monospace">
                  <HStack>
                    <Image src="/burger.png" alt="Burger Logo" />
                    <Text>{title}</Text>
                  </HStack>
                </Heading>
              </Link>
            </Box>

            <Box>
              <Navigation user={user} activeKey={'null'} />
            </Box>
          </HStack>
        </Box>
        <Spacer />
        <Box>
          <HStack>
            {user && (
              <Box>
                <SiteSelect autoUpdateUser={true} />
              </Box>
            )}

            <Box>
              {user ? (
                <HStack>
                  <Box>
                    <Text>
                      {t('components.layout.greeting', {
                        name: user.fullName,
                      })}
                    </Text>
                  </Box>
                  <Box>
                    <Avatar src={user.avatarUrl} size="sm" />
                  </Box>
                </HStack>
              ) : (
                <a href="/oauth2/authorization/oidc">
                  <Button>{t('components.layout.loginButton')}</Button>
                </a>
              )}
            </Box>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
