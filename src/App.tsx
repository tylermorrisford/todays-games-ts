import './App.css';
import { TodayGames } from './Components/TodayGames';
import { Standings } from './Components/Standings';
import { Box, Flex, Link } from '@commercetools/nimbus';
import { teefDev } from './constants';

export default function App() {
  return (
    <Box maxWidth="1200px" margin="0 auto" paddingX="400" paddingTop="400">
      <Flex direction={{ base: 'column', md: 'row' }} gap="800" alignItems="flex-start">
        <Box flex="2" minWidth="0">
          <TodayGames />
        </Box>
        <Box flex="3" minWidth="0">
          <Standings />
        </Box>
      </Flex>
      <Flex justifyContent="center" marginTop="600" marginBottom="2000">
        <Box width={{ base: '100%', md: '50%' }} textAlign="center">
          <hr />
          <small>Info about the developer is <Link href={teefDev} target="_blank" rel="noopener noreferrer">here</Link>.</small>
        </Box>
      </Flex>
    </Box>
  );
}
