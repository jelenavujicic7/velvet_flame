import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { usersApiSlice, useLoginMutation } from '../slices/usersApiSlice';
import { loadWishlist } from '../slices/wishlistSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      const wishlist = await dispatch(
        usersApiSlice.endpoints.getWishlist.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      dispatch(loadWishlist(wishlist));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Prijava nije uspela.');
    }
  };

  return (
    <main className="login-screen">
      <FormContainer>
        <h1>Prijavite se</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Upišite email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control
              type="password"
              placeholder="Upišite lozinku"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2" disabled={isLoading}>
            Prijava
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
          <Col>
            Nemate nalog?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
              Registrujte se
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </main>
  );
};

export default LoginScreen;
