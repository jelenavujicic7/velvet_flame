import { Col, Container, Row } from 'react-bootstrap';
import Product from '../components/Product';
import products from '../product_list';

const HomeScreen = () => {
  return (
    <main className="home-screen">
      <Container>
        <h1>Novi proizvodi</h1>

        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default HomeScreen;
