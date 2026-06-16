import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const OrderHistoryScreen = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();
  const sortedOrders = [...orders].reverse();

  return (
    <main className="order-history-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>
            <FaClipboardList /> Istorija porudzbina
          </h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Porudzbine nisu ucitane.'}
          </Message>
        ) : sortedOrders.length === 0 ? (
          <Message>
            Jos nema porudzbina. <Link to="/">Pogledaj proizvode</Link>
          </Message>
        ) : (
          <Row className="gy-3">
            {sortedOrders.map((order) => (
              <Col key={order._id} xs={12}>
                <Card className="order-history-card">
                  <Card.Body>
                    <div className="order-history-head">
                      <div>
                        <h2>Porudzbina #{order._id}</h2>
                        <p>
                          {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <strong>{order.totalPrice} RSD</strong>
                    </div>

                    <ListGroup variant="flush">
                      {order.orderItems.map((item) => (
                        <ListGroup.Item key={item._id || item.product}>
                          {item.qty} x {item.name} -{' '}
                          {(item.qty * item.price).toFixed(2)} RSD
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant="primary"
                      className="mt-3"
                    >
                      Detalji
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </main>
  );
};

export default OrderHistoryScreen;
