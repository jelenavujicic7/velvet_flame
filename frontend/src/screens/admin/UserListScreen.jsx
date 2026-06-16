import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Da li zelite da obrisete korisnika?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success('Korisnik je obrisan.');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Korisnik nije obrisan.');
      }
    }
  };

  return (
    <main className="admin-screen">
      <div className="container">
        <div className="screen-title-row">
          <h1>Korisnici</h1>
        </div>

        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error || 'Korisnici nisu ucitani.'}
          </Message>
        ) : (
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ime</th>
                <th>Email</th>
                <th>Admin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck className="text-success" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/user/${user._id}/edit`}
                      variant="light"
                      className="btn-sm mx-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
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

export default UserListScreen;
