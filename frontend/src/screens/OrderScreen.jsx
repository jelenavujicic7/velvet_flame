import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';

const formatPrice = (price) => Number(price || 0).toFixed(2);

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const markAsPaidHandler = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          id: `manual-${Date.now()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          payer: {
            email_address: order.user?.email,
          },
        },
      }).unwrap();

      refetch();
      toast.success('Porudzbina je oznacena kao placena.');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Placanje nije sacuvano.');
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Porudzbina je oznacena kao dostavljena.');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Status nije sacuvan.');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <main className="order-screen">
        <div className="container">
          <Message variant="danger">
            {error?.data?.message || error.error || 'Porudzbina nije ucitana.'}
          </Message>
        </div>
      </main>
    );
  }

  return (
    <main className="order-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>Porudzbina #{order._id}</h1>
        </div>

        <Row className="gy-4">
          <Col md={8}>
            <ListGroup variant="flush" className="checkout-list">
              <ListGroup.Item>
                <h2>Adresa za isporuku</h2>
                <p>
                  <strong>Ime:</strong> {order.user?.name}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
                </p>
                <p>
                  <strong>Adresa:</strong> {order.shippingAddress.address},{' '}
                  {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant="success">
                    Dostavljeno: {new Date(order.deliveredAt).toLocaleDateString('sr-RS')}
                  </Message>
                ) : (
                  <Message variant="danger">Nije dostavljeno</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Nacin placanja</h2>
                <p>
                  <strong>Metod:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant="success">
                    Placeno: {new Date(order.paidAt).toLocaleDateString('sr-RS')}
                  </Message>
                ) : (
                  <Message variant="danger">Nije placeno</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Proizvodi</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Porudzbina je prazna</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
                      <ListGroup.Item key={item._id || item.product}>
                        <Row className="align-items-center gy-3">
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x {formatPrice(item.price)} RSD ={' '}
                            {formatPrice(item.qty * item.price)} RSD
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Ukupno</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Proizvodi</Col>
                    <Col>{formatPrice(order.itemsPrice)} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Dostava</Col>
                    <Col>{formatPrice(order.shippingPrice)} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Porez</Col>
                    <Col>{formatPrice(order.taxPrice)} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Ukupno</Col>
                    <Col>{formatPrice(order.totalPrice)} RSD</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    <div className="d-grid">
                      <Button onClick={markAsPaidHandler} disabled={loadingPay}>
                        Oznaci kao placeno
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <Loader />}
                    <div className="d-grid">
                      <Button onClick={deliverHandler} disabled={loadingDeliver}>
                        Oznaci kao dostavljeno
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default OrderScreen;
