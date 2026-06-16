import { useState } from 'react';
import { Badge, Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import products from '../product_list';
import { addToCart } from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import {
  useAddWishlistItemMutation,
  useRemoveWishlistItemApiMutation,
} from '../slices/usersApiSlice';
import { addWishlistItem, removeWishlistItem } from '../slices/wishlistSlice';
import logo from '../styles/logo.svg';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [qty, setQty] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const localProduct = products.find((item) => item._id === productId);
  const {
    data: backendProduct,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId, {
    skip: Boolean(localProduct),
  });
  const product = localProduct || backendProduct;
  const isInWishlist = wishlistItems.some((item) => item._id === product?._id);
  const [addWishlistItemApi] = useAddWishlistItemMutation();
  const [removeWishlistItemApi] = useRemoveWishlistItemApiMutation();

  const addToCartHandler = () => {
    if (!userInfo) {
      setCartMessage('Morate da se ulogujete da biste dodali proizvod u korpu.');
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const wishlistHandler = async () => {
    if (!userInfo) {
      setCartMessage('Morate da se ulogujete da biste dodali proizvod u wishlistu.');
      return;
    }

    try {
      if (isInWishlist) {
        await removeWishlistItemApi(product._id).unwrap();
        dispatch(removeWishlistItem(product._id));
      } else {
        await addWishlistItemApi(product).unwrap();
        dispatch(addWishlistItem(product));
      }
    } catch (err) {
      setCartMessage(err?.data?.message || err.error || 'Wishlist nije azurirana.');
    }
  };

  return (
    <main className="product-screen" aria-busy={isLoading}>
      <div className="container">
        <Link className="btn btn-outline-secondary product-back-btn mb-4" to="/">
          &larr; Nazad
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Proizvod nije pronadjen.'}
          </Message>
        ) : !product ? (
          <Message variant="danger">Proizvod nije pronadjen.</Message>
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
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
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
                        <span>Kolicina:</span>
                        <Form.Select
                          value={qty}
                          onChange={(event) => setQty(Number(event.target.value))}
                          className="qty-select"
                          aria-label="Izaberi kolicinu"
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
