import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaClipboardList, FaHeart, FaInfoCircle, FaShoppingBag, FaUser } from 'react-icons/fa';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { clearWishlist, loadWishlist } from '../slices/wishlistSlice';
import logo from '../styles/logo.svg';

const Header = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const userKey = userInfo?._id || userInfo?.email || userInfo?.name;

  useEffect(() => {
    if (userInfo) {
      dispatch(loadWishlist(userKey));
    } else {
      dispatch(clearWishlist());
    }
  }, [dispatch, userInfo, userKey]);

  const logoutHandler = () => {
    dispatch(clearWishlist());
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
              <Nav.Link as={Link} to="/about" className="d-flex align-items-center gap-1">
                <FaInfoCircle /> O nama
              </Nav.Link>

              <Nav.Link
                as={Link}
                to={userInfo ? '/wishlist' : '/login?redirect=/wishlist'}
                className="d-flex align-items-center gap-1"
              >
                <FaHeart /> Wishlist
                {userInfo && wishlistItems.length > 0 && (
                  <Badge pill bg="light" text="dark" className="ms-1">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Nav.Link>

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
                  <NavDropdown.Item as={Link} to="/orderhistory">
                    <FaClipboardList className="me-2" />
                    Istorija porudžbina
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
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
