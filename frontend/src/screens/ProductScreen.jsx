import { useState } from 'react';
import { Badge, Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaRegStar, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import products from '../product_list';
import { addToCart } from '../slices/cartSlice';
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from '../slices/productsApiSlice';
import {
  useAddWishlistItemMutation,
  useRemoveWishlistItemApiMutation,
} from '../slices/usersApiSlice';
import { loadWishlist } from '../slices/wishlistSlice';
import logo from '../styles/logo.svg';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const [qty, setQty] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const [rating, setRating] = useState('');
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
  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

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
        const wishlist = await removeWishlistItemApi(product._id).unwrap();
        dispatch(loadWishlist(wishlist));
      } else {
        const wishlist = await addWishlistItemApi(product).unwrap();
        dispatch(loadWishlist(wishlist));
      }
    } catch (err) {
      setCartMessage(err?.data?.message || err.error || 'Wishlist nije azurirana.');
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
      }).unwrap();
      setRating('');
      setCartMessage('Hvala na oceni proizvoda.');
    } catch (err) {
      const rawMessage = err?.data?.message || err.error || 'Recenzija nije dodata.';
      const message =
        rawMessage === 'Product not found'
          ? 'Samo kupci mogu da ocene ovaj proizvod'
          : rawMessage;
      setCartMessage(message);
      toast.error(message);
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

            <Row className="gy-4 mt-2">
              <Col md={6}>
                <Card className="product-description-card">
                  <Card.Body>
                    <h3>Recenzije</h3>
                    {product.reviews?.length === 0 || !product.reviews ? (
                      <Message>Nema recenzija za ovaj proizvod.</Message>
                    ) : (
                      product.reviews.map((review) => (
                        <div key={review._id} className="product-review">
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} />
                          <p>{review.createdAt?.substring(0, 10)}</p>
                          {review.comment && <p>{review.comment}</p>}
                        </div>
                      ))
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="product-description-card">
                  <Card.Body>
                    <h3>Ocenite proizvod</h3>
                    {userInfo ? (
                      <Form onSubmit={submitReviewHandler}>
                        <Form.Group controlId="rating" className="my-3">
                          <Form.Label>Ocena</Form.Label>
                          <div className="rating-input" aria-label="Izaberite ocenu">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                className="rating-star-btn"
                                onClick={() => setRating(value)}
                                aria-label={`Ocena ${value}`}
                              >
                                {Number(rating) >= value ? <FaStar /> : <FaRegStar />}
                              </button>
                            ))}
                          </div>
                        </Form.Group>

                        <Button type="submit" disabled={loadingReview}>
                          Posalji ocenu
                        </Button>
                        {loadingReview && <Loader />}
                      </Form>
                    ) : (
                      <Message>
                        Prijavite se da biste ocenili proizvod.
                      </Message>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </main>
  );
};

export default ProductScreen;
