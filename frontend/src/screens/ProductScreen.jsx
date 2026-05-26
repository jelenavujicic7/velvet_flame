import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import products from '../product_list';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlistItem } from '../slices/wishlistSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [qty, setQty] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const product = products.find((item) => item._id === productId);
  const isLoading = false;
  const userKey = userInfo?._id || userInfo?.email || userInfo?.name;
  const isInWishlist = wishlistItems.some((item) => item._id === product?._id);

  const addToCartHandler = () => {
    if (!userInfo) {
      setCartMessage('Morate da se ulogujete da biste dodali proizvod u korpu.');
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const wishlistHandler = () => {
    if (!userInfo) {
      setCartMessage('Morate da se ulogujete da biste dodali proizvod u wishlistu.');
      return;
    }

    dispatch(toggleWishlistItem({ product, userKey }));
  };

  return (
    <main className="product-screen" aria-busy={isLoading}>
      <div className="container">
        <Link className="btn btn-outline-secondary product-back-btn mb-4" to="/">
          &larr; Nazad
        </Link>

        {isLoading ? (
          <Loader />
        ) : !product ? (
          <Message variant="danger">Proizvod nije pronađen.</Message>
        ) : (
          <>
            {cartMessage && (
              <Message variant="warning">
                {cartMessage} <Link to="/login">Prijavi se</Link>
              </Message>
            )}

            <Card className="product-detail-heading p-4 mb-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <h1>{product.name}</h1>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} recenzija`}
                  />
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <h2>{product.price.toFixed(2)} RSD</h2>
                  <Button
                    type="button"
                    variant="light"
                    className={`wishlist-detail-btn mt-3 ${
                      isInWishlist ? 'wishlist-btn-active' : ''
                    }`}
                    onClick={wishlistHandler}
                  >
                    {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                    <span>
                      {isInWishlist ? 'U wishlisti' : 'Dodaj u wishlistu'}
                    </span>
                  </Button>
                </Col>
              </Row>
            </Card>

            <Row className="gy-4">
              <Col lg={8}>
                <Card className="product-detail-media p-4">
                  <Image src={product.image} alt={product.name} fluid />
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="product-info-card">
                  <Card.Body>
                    <h3>Informacije o proizvodu</h3>

                    <div className="product-info-row">
                      <span>Kategorija:</span>
                      <strong>{product.category}</strong>
                    </div>

                    <div className="product-info-row">
                      <span>Status:</span>
                      {product.countInStock > 0 ? (
                        <Badge className="stock-badge stock-badge-success">
                          Dostupno
                        </Badge>
                      ) : (
                        <Badge className="stock-badge stock-badge-danger">
                          Nije dostupno
                        </Badge>
                      )}
                    </div>

                    {product.countInStock > 0 && (
                      <div className="product-info-row">
                        <span>Količina:</span>
                        <Form.Select
                          value={qty}
                          onChange={(event) => setQty(Number(event.target.value))}
                          className="qty-select"
                          aria-label="Izaberi količinu"
                        >
                          {[...Array(product.countInStock).keys()].map((item) => (
                            <option key={item + 1} value={item + 1}>
                              {item + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    )}

                    <div className="d-grid">
                      <Button
                        className="add-to-cart-btn"
                        type="button"
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Dodaj u korpu
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="product-description-card mt-4">
              <Card.Body>
                <h3>Opis proizvoda</h3>
                <p>{product.description}</p>
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </main>
  );
};

export default ProductScreen;
