import { Col, Container, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import products from '../product_list';

const HomeScreen = () => {
  const isLoading = !products;
  const hasProducts = products?.length > 0;

  return (
    <main className="home-screen" aria-busy={isLoading}>
      <Container>
        <div className="home-title">
          <h1>Novi proizvodi</h1>
          <p>Ručno birani komadi za toplinu, stil i male svakodnevne rituale.</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : hasProducts ? (
          <Row>
            {products.map((product) => (
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
