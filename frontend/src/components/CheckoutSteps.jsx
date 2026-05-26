import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <Nav.Link as={Link} to="/login">
            Prijava
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Prijava</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <Nav.Link as={Link} to="/shipping">
            Podaci o dostavi
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Podaci o dostavi</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <Nav.Link as={Link} to="/payment">
            Plaćanje
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Plaćanje</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <Nav.Link as={Link} to="/placeorder">
            Pregled porudžbine
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Pregled porudžbine</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
