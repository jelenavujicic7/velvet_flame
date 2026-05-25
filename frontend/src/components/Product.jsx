import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className="product-card my-3 p-3">
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
