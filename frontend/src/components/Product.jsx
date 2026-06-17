import { Button, Card } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useAddWishlistItemMutation,
  useRemoveWishlistItemApiMutation,
} from '../slices/usersApiSlice';
import { loadWishlist } from '../slices/wishlistSlice';
import logo from '../styles/logo.svg';
import Rating from './Rating';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);
  const [addWishlistItemApi] = useAddWishlistItemMutation();
  const [removeWishlistItemApi] = useRemoveWishlistItemApiMutation();

  const wishlistHandler = async () => {
    if (!userInfo) {
      toast.warning('Morate da se prijavite da biste dodali proizvod u wishlistu.');
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
      toast.error(err?.data?.message || err.error || 'Wishlist nije azurirana.');
    }
  };

  return (
    <Card className="product-card my-3 p-3">
      <Button
        type="button"
        variant="light"
        className={`wishlist-btn ${isInWishlist ? 'wishlist-btn-active' : ''}`}
        onClick={wishlistHandler}
        aria-label={
          isInWishlist
            ? `Ukloni ${product.name} iz wishliste`
            : `Dodaj ${product.name} u wishlistu`
        }
      >
        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
      </Button>

      <Link to={`/product/${product._id}`} className="product-card-link">
        <Card.Img
          src={product.image}
          variant="top"
          className="product-card-image"
          onError={(e) => {
            e.currentTarget.src = logo;
          }}
        />
      </Link>

      <Card.Body className="px-0 pb-0">
        <Link to={`/product/${product._id}`} className="product-card-link">
          <Card.Title as="div" className="product-card-title product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="p" className="product-card-description">
          {product.description}
        </Card.Text>

        <Rating
          value={product.rating}
          text={`${product.numReviews} recenzija`}
        />

        <Card.Text as="h3" className="product-card-price">
          {product.price} RSD
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
