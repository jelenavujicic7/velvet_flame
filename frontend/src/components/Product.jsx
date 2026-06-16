import { Button, Card } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useAddWishlistItemMutation,
  useRemoveWishlistItemApiMutation,
} from '../slices/usersApiSlice';
import { addWishlistItem, removeWishlistItem } from '../slices/wishlistSlice';
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
        await removeWishlistItemApi(product._id).unwrap();
        dispatch(removeWishlistItem(product._id));
      } else {
        await addWishlistItemApi(product).unwrap();
        dispatch(addWishlistItem(product));
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
        <Card.Img src={product.image} variant="top" className="product-card-image" />
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
