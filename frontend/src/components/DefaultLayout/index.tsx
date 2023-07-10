import { Box, VStack } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import { Footer } from '~/components/DefaultLayout/components/Footer';
import { Header } from '~/components/DefaultLayout/components/Header';
import { useCurrentUserQuery } from '~/gql/user.generated';

export const DefaultLayout: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const { data } = useCurrentUserQuery();

  return (
    <VStack height="100vh">
      <Header user={data?.user} />

      <Box as="main" width="100%" flex="auto">
        <VStack width="100%" maxWidth="8xl" marginX="auto" paddingX={4}>
          {children}
        </VStack>
      </Box>

      <Footer />
    </VStack>
  );
};
