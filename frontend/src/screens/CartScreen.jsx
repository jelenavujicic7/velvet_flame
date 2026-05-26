import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <main className="cart-screen">
      <div className="container">
        <h1>Korpa</h1>

        <Row className="gy-4">
          <Col md={8}>
            {cartItems.length === 0 ? (
              <Message>
                Korpa je prazna. <Link to="/">Vrati se na proizvode</Link>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center gy-3">
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>

                      <Col md={2}>{item.price} RSD</Col>

                      <Col md={3}>
                        <Form.Select
                          value={item.qty}
                          onChange={(event) =>
                            dispatch(
                              addToCart({
                                ...item,
                                qty: Number(event.target.value),
                              })
                            )
                          }
                          aria-label={`Kolicina za ${item.name}`}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col md={2}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandler(item._id)}
                          aria-label={`Ukloni ${item.name}`}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    Ukupno ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                  {cart.itemsPrice || '0.00'} RSD
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Nastavi na placanje
                    </Button>
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

export default CartScreen;
