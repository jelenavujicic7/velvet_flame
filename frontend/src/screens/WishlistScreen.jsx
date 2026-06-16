import { Button, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import {
  useGetWishlistQuery,
  useRemoveWishlistItemApiMutation,
} from '../slices/usersApiSlice';
import { loadWishlist, removeWishlistItem } from '../slices/wishlistSlice';
import { useEffect } from 'react';

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { data: wishlistData = [], isLoading, error } = useGetWishlistQuery();
  const [removeWishlistItemApi] = useRemoveWishlistItemApiMutation();

  useEffect(() => {
    dispatch(loadWishlist(wishlistData));
  }, [dispatch, wishlistData]);

  const removeHandler = async (productId) => {
    try {
      await removeWishlistItemApi(productId).unwrap();
      dispatch(removeWishlistItem(productId));
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Proizvod nije uklonjen.');
    }
  };

  const addToCartHandler = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
  };

  return (
    <main className="wishlist-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>
            <FaHeart /> Wishlist
          </h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Wishlist nije ucitana.'}
          </Message>
        ) : wishlistItems.length === 0 ? (
          <Message>
            Wishlist je prazna. <Link to="/">Pogledaj proizvode</Link>
          </Message>
        ) : (
          <ListGroup variant="flush" className="checkout-list">
            {wishlistItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center gy-3">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={4}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price} RSD</Col>
                  <Col md={4} className="d-flex gap-2 justify-content-md-end">
                    <Button type="button" onClick={() => addToCartHandler(item)}>
                      Dodaj u korpu
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeHandler(item._id)}
                      aria-label={`Ukloni ${item.name} iz wishliste`}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </main>
  );
};

export default WishlistScreen;
