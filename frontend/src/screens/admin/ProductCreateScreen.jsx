import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import { BASE_URL, PRODUCT_URL } from '../../constants';

const ProductCreateScreen = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !price || !image || !category || !description) {
      toast.error('Popunite sva obavezna polja.');
      return;
    }

    const product = {
        name,
        price: Number(price),
        image,
        category,
        countInStock: Number(countInStock || 0),
        description,
      };

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}${PRODUCT_URL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Proizvod nije dodat.');
      }

      toast.success('Proizvod je dodat.');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err.message || 'Proizvod nije dodat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-screen">
      <Link to="/admin/productlist" className="btn btn-outline-secondary mb-4">
        Nazad
      </Link>
      <FormContainer>
        <h1>Dodavanje proizvoda</h1>
        {isLoading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Naziv</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="price" className="my-3">
            <Form.Label>Cena</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="image" className="my-3">
            <Form.Label>Slika</Form.Label>
            <Form.Control
              type="text"
              placeholder="Unesite URL slike"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="category" className="my-3">
            <Form.Label>Kategorija</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="countInStock" className="my-3">
            <Form.Label>Stanje</Form.Label>
            <Form.Control
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="my-3">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Dodaj proizvod
          </Button>
        </Form>
      </FormContainer>
    </main>
  );
};

export default ProductCreateScreen;
