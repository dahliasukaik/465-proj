import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const ProfileCover = ({ movie }) => {
  return (
    <>
      {/* To Be Routed to return to table */}

      <Box display="flex" mb={1} >
        <Card>
            <CardMedia component="img" image={movie.coverImg} height="480"/>
        </Card>
      </Box>

      <Box>
        <Box display="flex" sx={{justifyContent: 'space-between'}}>
          <Box mb={1}>
            <Typography variant="h1" component="h1" gutterBottom>
              {movie.name} ({movie.year})
            </Typography>
            <Typography variant="subtitle2">
              {movie.tagLine.toUpperCase()}
            </Typography>
          </Box>

          <Box display="flex" mb={1} sx={{
            flexDirection: 'column',
            justifyContent: 'center',}}
            >
            <Typography variant="h1" component="h1" gutterBottom>
              {Array.from({length: movie.rating})
                  .map((_, index) => (
                      <StarRateIcon key={index} fontSize='large'/>
                  )
              )}
              {Array.from({length: (5 - movie.rating) })
                  .map((_, index) => (
                      <StarOutlineIcon key={index} fontSize='large'/>
                  )
              )}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{mb: 1}}/>

        <Typography sx={{mb: 1}}>{movie.description}</Typography>

        <Divider sx={{mb: 1}}/>

        <Box display="flex" sx={{justifyContent: 'space-between'}}>
          <Box>
            {Array.from({length: movie.genres.length})
                .map((_, index) => (
                    <Chip label={movie.genres[index]} sx={{mr: 1}} />
                )
            )}
          </Box>


          <Typography variant="subtitle2">
              {movie.minutes} mins
          </Typography>
        </Box>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  // @ts-ignore
  movie: PropTypes.object.isRequired
};

export default ProfileCover;
