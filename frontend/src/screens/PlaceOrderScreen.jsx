import { useEffect } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      toast.success('Porudzbina je uspesno kreirana.');
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Porudzbina nije kreirana.');
    }
  };

  return (
    <main className="place-order-screen">
      <div className="container">
        <CheckoutSteps step1 step2 step3 step4 />

        <Row className="gy-4">
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Podaci za dostavu</h2>
                <p>
                  <strong>Adresa:</strong> {cart.shippingAddress.address},{' '}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Nacin placanja</h2>
                <p>{cart.paymentMethod}</p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Stavke porudzbine</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Korpa je prazna</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center gy-3">
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x {item.price} RSD ={' '}
                            {(item.qty * item.price).toFixed(2)} RSD
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
                  <h2>Rezime porudzbine</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Stavke</Col>
                    <Col>{cart.itemsPrice || '0.00'} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Dostava</Col>
                    <Col>{cart.shippingPrice || '0.00'} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Porez</Col>
                    <Col>{cart.taxPrice || '0.00'} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Ukupno</Col>
                    <Col>{cart.totalPrice || '0.00'} RSD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      disabled={cart.cartItems.length === 0 || isLoading}
                      onClick={placeOrderHandler}
                    >
                      Porucite sada
                    </Button>
                    {isLoading && <Loader />}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default PlaceOrderScreen;
