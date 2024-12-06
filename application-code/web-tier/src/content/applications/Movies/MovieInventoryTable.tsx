import { FC, ChangeEvent, useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Button
} from '@mui/material';

import { NavLink as RouterLink } from 'react-router-dom';
import Label from 'src/components/Label';
import { MovieEntry } from 'src/models/movieEntry';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import useApiService from 'src/hooks/useApiService';
import { OptionsHttpMethods } from 'src/models/optionsValues';

interface Filters {
  genre?: any;
}

const getStatusLabel = (genres: string[]): JSX.Element => {
  const map = {
    horror: {
      text: 'Horror',
      color: 'error'
    },
    comedy: {
      text: 'Comedy',
      color: 'success'
    },
    action: {
      text: 'Action',
      color: 'warning'
    },
    drama: {
      text: 'Drama',
      color: 'primary'
    },
    animation: {
      text: 'Animation',
      color: 'info'
    }
  };

    const labels = [];
    genres.map((_genre, _index) => {
      try {
        const { text, color }: any = map[_genre.toLowerCase()];
        labels.push(<span key={`${_genre}_${_index}`}><Label color={color}>{text.toUpperCase()}</Label>&nbsp;</span>);
      } catch (e) {
        labels.push(<span key={`${_genre}_${_index}`}><Label color={"secondary"}>{_genre.toUpperCase()}</Label>&nbsp;</span>);
      }

    });
    return <>{labels}</>;
};

const applyFilters = (
  movieInventory: MovieEntry[],
  filters: Filters
): MovieEntry[] => {
  return movieInventory.filter((movie) => {
    let matches = true;
    const hasOneOrMore = movie.genres.find((_entry) => _entry === filters.genre);
    if (filters.genre && !Boolean(hasOneOrMore)) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  movieInventory: MovieEntry[],
  page: number,
  limit: number
): MovieEntry[] => {
  return movieInventory.slice(page * limit, page * limit + limit);
};

const GENRE_OPTIONS = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'horror',
    name: 'Horror'
  },
  {
    id: 'comedy',
    name: 'Comedy'
  },
  {
    id: 'action',
    name: 'Action'
  },
  {
    id: 'drama',
    name: 'Drama'
  },
  {
    id: 'animation',
    name: 'Animation'
  }
];

interface Props {
  movieInventory: MovieEntry[],
  deleteMovieEntry: (movie: MovieEntry) => void;
}

const MovieInventoryTable = ({
  movieInventory,
  deleteMovieEntry
}: Props) => {
  const { httpRequest } = useApiService();
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<number[]>([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ genre: null });
  const [genreOptions, setGenreOptions] = useState([{ id: 'all', name: 'All' }]);

  useEffect(() => {
    getCategoryFilters();
  }, []);

  const getCategoryFilters = () => {
      setGenreOptions(GENRE_OPTIONS);
  }

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      genre: value
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? movieInventory.map((movie) => movie.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: number
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(movieInventory, filters);
  const paginateMovies = applyPagination(filteredCryptoOrders, page, limit);
  const selectedSomeCryptoOrders = selectedCryptoOrders.length > 0 && selectedCryptoOrders.length < movieInventory.length;
  const selectedAllCryptoOrders = selectedCryptoOrders.length === movieInventory.length;
  const theme = useTheme();

  return (
    <Card>
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Genres</InputLabel>
                <Select
                  value={filters.genre || 'all'}
                  onChange={handleStatusChange}
                  label="Genre"
                  autoWidth
                >
                  {genreOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Movies"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell> */}
              {/* <TableCell>Movie ID</TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginateMovies.map((movie, _index) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                movie.id
              );
              return (
                <TableRow
                  hover
                  key={`${movie.id}_${_index}`}
                  selected={isCryptoOrderSelected}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, movie.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      <Button
                        disableRipple
                        component={RouterLink}
                        to="/management/profile/details"
                      >
                        {movie.name}
                      </Button>
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {format(movie.orderDate, 'MMMM dd yyyy')}
                    </Typography> */}
                  </TableCell>
                  <TableCell sx={{ maxWidth: "200px" }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {movie.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {movie.rating}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {movie.sourceDesc}
                    </Typography> */}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {getStatusLabel(movie.genres)}
                      {/* {movie.cryptoCurrency} */}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {numeral(movie.amount).format(
                        `${movie.currency}0,0.00`
                      )}
                    </Typography> */}
                  </TableCell>
                  <TableCell>
                    {/* {getStatusLabel(movie.year)} */}
                    {movie.year}
                  </TableCell>
                  <TableCell>
                    {/* <Tooltip title="Edit Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Delete Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => deleteMovieEntry(movie)}
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default MovieInventoryTable;
