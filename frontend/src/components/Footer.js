import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="elena-footer">
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p className="mb-0">
              &copy; {currentYear} Elena Lux. Sva prava zadrzana.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
