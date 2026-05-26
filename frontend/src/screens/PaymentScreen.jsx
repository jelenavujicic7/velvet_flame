import { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <main className="payment-screen">
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Način plaćanja</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Odaberite način plaćanja</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                className="my-2"
                label="PayPal ili kreditna kartica"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                className="my-2"
                label="Plaćanje pouzećem"
                id="CashOnDelivery"
                name="paymentMethod"
                value="Plaćanje pouzećem"
                checked={paymentMethod === 'Plaćanje pouzećem'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Nastavite
          </Button>
        </Form>
      </FormContainer>
    </main>
  );
};

export default PaymentScreen;
