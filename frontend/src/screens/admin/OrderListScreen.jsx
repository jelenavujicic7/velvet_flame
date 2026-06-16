import { Button, Table } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  return (
    <main className="admin-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>Porudzbine</h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Porudzbine nisu ucitane.'}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Korisnik</th>
                <th>Datum</th>
                <th>Ukupno</th>
                <th>Placeno</th>
                <th>Dostavljeno</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || order.user}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice} RSD</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant="light"
                      className="btn-sm"
                    >
                      Detalji
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

export default OrderListScreen;
