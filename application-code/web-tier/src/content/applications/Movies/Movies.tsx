import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import MovieInventory from './MovieInventory';

function Movies() {
  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <MovieInventory />
      <Footer />
    </>
  );
}

export default Movies;
