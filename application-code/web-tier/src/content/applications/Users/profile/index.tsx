import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import {
  Grid,
  Container,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import Feed from './Feed';
import PopularTags from './PopularTags';
import MyCards from './MyCards';
import Addresses from './Addresses';

function ManagementUserProfile() {
  const movie = {
    id: '1',
    name: 'Whiplash',
    posterImg: 'https://image.tmdb.org/t/p/original/E1fpfU9cMCgFYL3QPvJr3vt20X.jpg',
    coverImg: 'https://image.tmdb.org/t/p/original/vNXGrknx4GjWLgmuNTftWZluIUl.jpg',
    description: 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.',
    rating: 5,
    genres: ['Drama', 'Music'],
    year: 2014,
    tagLine: "The Road to Greatness Can Take You To the Edge",
    minutes: 107
  };

  return (
    <>
      <Helmet>
        <title>User Details - Management</title>
      </Helmet>
      <Container sx={{ mt: 1 }} maxWidth="lg">
        <Box>
          <Tooltip arrow placement="top" title="Go back">
            <IconButton color="primary" sx={{ mr: 2, mb: 1 }}>
              <ArrowBackTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <ProfileCover movie={movie} />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid> */}
          {/* <Grid item xs={12} md={8}>
            <Feed />
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid> */}
          {/* <Grid item xs={12} md={7}>
            <MyCards />
          </Grid> */}
          {/* <Grid item xs={12} md={5}>
            <Addresses />
          </Grid> */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
