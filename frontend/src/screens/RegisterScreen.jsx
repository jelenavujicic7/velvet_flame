import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { useRegisterMutation } from '../slices/usersApiSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (!name || !lastName || !gender || !birthYear || !city || !email || !password) {
      toast.error('Popunite sva polja za registraciju.');
      return;
    }

    if (password.length < 8) {
      toast.error('Lozinka mora imati minimum 8 karaktera.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Lozinke se ne poklapaju.');
      return;
    }

    try {
      const res = await register({
        name,
        lastName,
        gender,
        birthYear,
        city,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Registracija nije uspela.');
    }
  };

  return (
    <main className="register-screen">
      <FormContainer>
        <h1>Registrujte se</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Ime</Form.Label>
            <Form.Control
              type="text"
              placeholder="Upisite ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="lastName" className="my-3">
            <Form.Label>Prezime</Form.Label>
            <Form.Control
              type="text"
              placeholder="Upisite prezime"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="gender" className="my-3">
            <Form.Label>Pol</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              aria-label="Izaberite pol"
            >
              <option value="">Izaberite pol</option>
              <option value="zenski">Zenski</option>
              <option value="muski">Muski</option>
              <option value="drugo">Drugo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="birthYear" className="my-3">
            <Form.Label>Godiste</Form.Label>
            <Form.Control
              type="number"
              placeholder="Upisite godiste"
              min="1900"
              max={new Date().getFullYear()}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="city" className="my-3">
            <Form.Label>Mesto stanovanja</Form.Label>
            <Form.Control
              type="text"
              placeholder="Upisite mesto stanovanja"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email adresa</Form.Label>
            <Form.Control
              type="email"
              placeholder="Upisite email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control
              type="password"
              placeholder="Upisite lozinku"
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Potvrdite lozinku</Form.Label>
            <Form.Control
              type="password"
              placeholder="Potvrdite lozinku"
              minLength="8"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2" disabled={isLoading}>
            Registruj se
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
          <Col>
            Imate nalog?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Prijavite se
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </main>
  );
};

export default RegisterScreen;
