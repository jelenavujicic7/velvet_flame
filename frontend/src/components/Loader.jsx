import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="loader" aria-live="polite">
      <Spinner animation="border" role="status" className="loader-spinner">
        <span className="visually-hidden">Ucitavanje...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
