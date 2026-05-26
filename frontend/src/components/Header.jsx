import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaShoppingBag, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import logo from '../styles/logo.svg';

const Header = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar className="elena-navbar" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Elena Lux logo"
              width="34"
              height="34"
              className="d-inline-block align-top me-2"
            />
            <span className="fw-semibold">Elena Lux</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="elena-navbar-nav" />

          <Navbar.Collapse id="elena-navbar-nav">
            <Nav className="ms-auto align-items-md-center">
              <Nav.Link as={Link} to="/cart" className="d-flex align-items-center gap-1">
                <FaShoppingBag /> Korpa
                {cartItemsCount > 0 && (
                  <Badge pill bg="light" text="dark" className="ms-1">
                    {cartItemsCount}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item href="/profile">Profil</NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>Odjava</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
                  <FaUser /> Prijava
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
