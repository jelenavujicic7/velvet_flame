import { Button, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { data: products = [], isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Da li zelite da obrisete proizvod?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success('Proizvod je obrisan.');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Proizvod nije obrisan.');
      }
    }
  };

  return (
    <main className="admin-screen">
      <div className="container">
        <div className="screen-title-row admin-title-row">
          <h1>Proizvodi</h1>
          <Button as={Link} to="/admin/product/create">
            <FaPlus /> Dodaj proizvod
          </Button>
        </div>

        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Proizvodi nisu ucitani.'}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Naziv</th>
                <th>Cena</th>
                <th>Kategorija</th>
                <th>Stanje</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price} RSD</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant="light"
                      className="btn-sm mx-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </main>
  );
};

export default ProductListScreen;
