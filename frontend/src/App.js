import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import Product from './components/Product';
import products from './product_list';
import './style/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="home-screen">
        <Container>
          <section className="home-title">
            <h1>Elena Lux</h1>
            <p>Rucno izradjene svece za elegantan, topao i mirisan dom.</p>
          </section>

          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
