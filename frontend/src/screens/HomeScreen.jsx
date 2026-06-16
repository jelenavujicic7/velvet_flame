import { Col, Container, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import products from '../product_list';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const {
    data: backendProducts = [],
    isLoading,
    error,
  } = useGetProductsQuery();
  const localProductIds = products.map((product) => product._id);
  const adminProducts = backendProducts.filter(
    (product) =>
      !localProductIds.includes(product._id) &&
      !product.image?.startsWith('/images/')
  );
  const displayedProducts = [...adminProducts, ...products];
  const hasProducts = displayedProducts.length > 0;

  return (
    <main className="home-screen" aria-busy={isLoading}>
      <Container>
        <div className="home-title">
          <h1>Novi proizvodi</h1>
          <p>Ručno birani komadi za toplinu, stil i male svakodnevne rituale.</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Proizvodi nisu ucitani.'}
          </Message>
        ) : hasProducts ? (
          <Row>
            {displayedProducts.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Message>Nema dostupnih proizvoda.</Message>
        )}
      </Container>
    </main>
  );
};

export default HomeScreen;
