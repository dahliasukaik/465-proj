import { Box, Button, Card, Checkbox, Container, Dialog, DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, List, TextField, Typography } from '@mui/material';
import { MovieEntry } from 'src/models/movieEntry';
import { subDays } from 'date-fns';
import useApiService from 'src/hooks/useApiService';
import { useEffect, useState } from 'react';
import { OptionsHttpMethods } from 'src/models/optionsValues';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { SimpleDialog } from 'src/content/pages/Components/Modals';
import MovieInventoryTable from './MovieInventoryTable';

const MOVIES: MovieEntry[] = [
  {
    id: 1,
    name: 'Gladiator',
    posterImg: '',
    coverImg: '',
    description: "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos.  Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor.  As Marcus' devious son Commodus ascends to the throne, Maximus is set to be executed.  He escapes, but is captured by slave traders.  Renamed Spaniard and forced to become a gladiator, Maximus must battle to the death with other men for the amusement of paying audiences.",
    rating: 4.11,
    genres: ["adventure", "action", "drama"],
    year: 2000,
    tagLine: "Awesome",
    minutes: 200
  },
  {
    id: 2,
    name: 'La La Land',
    posterImg: '',
    coverImg: '',
    description: "Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair, and the dreams they worked so hard to maintain in each other threaten to rip them apart.",
    rating: 4.09,
    genres: ['music', 'drama', 'romance', 'comedy'],
    year: 2016,
    tagLine: "Awesome",
    minutes: 200
  },
  {
    id: 3,
    name: "Apollo 11",
    posterImg: '',
    coverImg: '',
    description: "A look at the Apollo 11 mission to land on the moon led by commander Neil Armstrong and pilot Buzz Aldrin.",
    rating: 4.09,
    genres: ['documentary', 'drama', 'history'],
    year: 2019,
    tagLine: "Awesome",
    minutes: 200
  },
  {
    id: 4,
    name: 'Nightcrawler',
    posterImg: '',
    coverImg: '',
    description: "When Lou Bloom, desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant to become the star of his own story. Aiding him in his effort is Nina, a TV-news veteran.",
    rating:4.04,
    genres: ['drama', 'thriller', 'crime'],
    year: 2014,
    tagLine: "Awesome",
    minutes: 200
  },
  {
    id: 5,
    name: 'Godzilla',
    posterImg: '',
    coverImg: '',
    description: "Japan is thrown into a panic after several ships explode and are sunk near Odo Island. An expedition to the island led by paleontologist Professor Kyohei Yemani soon discover something more devastating than imagined in the form of a 50 meter tall monster whom the natives call Gojira. Now the monster begins a rampage that threatens to destroy not only Japan, but the rest of the world as well.",
    rating: 4.04,
    genres: ['horror'],
    year: 1954,
    tagLine: "Awesome",
    minutes: 200
  },
  {
    id: 6,
    name: 'Shrek 2',
    posterImg: '',
    coverImg: '',
    description: "Shrek, Fiona and Donkey set off to Far, Far Away to meet Fiona's mother and father. But not everyone is happy. Shrek and the King find it hard to get along, and there's tension in the marriage. The fairy godmother discovers that Shrek has married Fiona instead of her Son Prince Charming and sets about destroying their marriage.",
    rating: 4.04,
    genres: ['adventure', 'fantasy', 'family', 'animation', 'comedy'],
    year: 2004,
    tagLine: "Awesome",
    minutes: 200
  },
];

const user = {
  name: 'Catherine Pike',
  avatar: '/static/images/avatars/1.jpg'
};

function MovieInventory() {
  const { httpRequest } = useApiService();
  const [movies, setMovies] = useState<MovieEntry[]>([]);
  const [newMovie, setNewMovie] = useState<MovieEntry>(new MovieEntry());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const formTemplate = new MovieEntry();

  useEffect(() => {
    getMovieData();
  }, []);

  const getMovieData = () => {
    httpRequest(OptionsHttpMethods.GET, `/api/inventory`)
    .then((_response) => {
      console.log(_response);
      setMovies(_response);
    }).catch((error) => {
      console.log(error);
      setMovies(MOVIES);
    })
  }

  const addMovieEntry = () => {
    setMovies((prev) => [{...newMovie, id: movies.length + 1}, ...prev]);
    handleClose();
    httpRequest(OptionsHttpMethods.POST, `/api/inventory`, newMovie)
    .then((_response) => {
      console.log(_response);
      getMovieData();
    }).catch((error) => {
      console.log(error);
    })
  }

  const deleteMovieEntry = (movie: MovieEntry) => {
    setMovies((prev) => [...prev.filter((_entry) => _entry.id !== movie.id )]);
    httpRequest(OptionsHttpMethods.DELETE, `/api/inventory/${movie.id}`)
    .then((_response) => {
      console.log(_response);
      getMovieData();
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleOpen = () => {
    setNewMovie(new MovieEntry());
    setOpenDialog(true);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "checkbox") {
      if (newMovie.genres.some(_g => _g === event.target.name)) {
        setNewMovie((prev) =>
          ({...prev, genres: prev.genres.filter((_entry) => _entry !== event.target.name)})
        )
      } else {
        setNewMovie((prev) =>
          ({...prev, genres: prev.genres.concat(event.target.name)})
        )
      }
    } else {
      setNewMovie({...newMovie, [event.target.name]: event.target.value });
    }
  }

  const areAllPropertiesFilled = (obj: MovieEntry): boolean => {
    return Object.values(obj).every(value => {
      if (Array.isArray(value)) return value.length > 0;
      else return value !== null && value !== undefined && value !== '';
    });
  }

  return (
    <>
      <PageTitleWrapper>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Movie Inventory
          </Typography>
          <Typography variant="subtitle2">
            Explore the Current Movie Collection
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            onClick={handleOpen}
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Add Movie
          </Button>
        </Grid>
      </Grid>
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <MovieInventoryTable movieInventory={movies} deleteMovieEntry={deleteMovieEntry}/>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog fullWidth maxWidth={"xs"} onClose={handleClose} open={openDialog}>
        <DialogTitle>Enter Movie Information</DialogTitle>
        <Box sx={{ px: 2, pb: 2 }}>
          {Object.keys(formTemplate).map((_entry, _index) => {
            return _entry !== "id" &&
              <Box key={`${_entry}_${_index}`} sx={{ p: 1 }}>
                {_entry !== "genres" && <TextField
                  id="outlined-controlled"
                  fullWidth
                  label={_entry}
                  name={_entry}
                  value={newMovie ? newMovie[_entry] : ""}
                  onChange={handleChange}
                />}
                {_entry === "genres" &&
                <FormControl>
                  <FormLabel component="legend">Genres</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} color="primary" name="action" />}
                      label="Action"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} color="primary" name="horror" />}
                      label="Horror"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} color="primary" name="comedy" />}
                      label="Comedy"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleChange} color="primary" name="drama" />}
                      label="Drama"
                    />
                  </FormGroup>
                </FormControl>}
              </Box>
          })}
          <Box sx={{ p: 1 }}>
            <Button fullWidth disabled={!areAllPropertiesFilled(newMovie)} variant='contained' onClick={addMovieEntry}>Submit</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default MovieInventory;
