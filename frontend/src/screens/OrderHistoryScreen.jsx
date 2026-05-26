import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { FaClipboardList } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';

const getOrders = () => {
  try {
    const orders = sessionStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    sessionStorage.removeItem('orders');
    return [];
  }
};

const OrderHistoryScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userKey = userInfo?._id || userInfo?.email || userInfo?.name;
  const orders = getOrders()
    .filter((order) => {
      const orderUserKey =
        order.user?._id || order.user?.email || order.user?.name;

      return !orderUserKey || orderUserKey === userKey;
    })
    .slice()
    .reverse();

  return (
    <main className="order-history-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>
            <FaClipboardList /> Istorija porudžbina
          </h1>
        </div>

        {orders.length === 0 ? (
          <Message>
            Još nema porudžbina. <Link to="/">Pogledaj proizvode</Link>
          </Message>
        ) : (
          <Row className="gy-3">
            {orders.map((order) => (
              <Col key={order._id} xs={12}>
                <Card className="order-history-card">
                  <Card.Body>
                    <div className="order-history-head">
                      <div>
                        <h2>Porudžbina #{order._id}</h2>
                        <p>
                          {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <strong>{order.totalPrice} RSD</strong>
                    </div>

                    <ListGroup variant="flush">
                      {order.orderItems.map((item) => (
                        <ListGroup.Item key={item._id}>
                          {item.qty} x {item.name} -{' '}
                          {(item.qty * item.price).toFixed(2)} RSD
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
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
