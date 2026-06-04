import { Col, Container, Row } from 'react-bootstrap';
import { FaGift, FaHeart, FaLeaf } from 'react-icons/fa';
import floralCollection from '../assets/a85fefd6-1d2b-4f7a-a989-a86fcc5792e4.jpeg';
import dessertCandle from '../assets/fbcf3dac-0a1e-40dd-b8e5-461b84ebe431.jpeg';

const bestSellers = [
  {
    name: 'Cvetni poklon aranžman',
    image: floralCollection,
    description:
      'Buket nežnih cvetnih sveća, ručno složen kao poseban poklon koji dugo ostaje u sećanju.',
    label: 'Najtraženiji poklon',
  },
  {
    name: 'Ljubičasta desert sveća',
    image: dessertCandle,
    description:
      'Razigrana mirisna sveća inspirisana desertima, napravljena za slatke trenutke i topao dom.',
    label: 'Favorit kupaca',
  },
];

const AboutScreen = () => {
  return (
    <main className="about-screen">
      <section className="about-hero">
        <Container>
          <span className="about-eyebrow">Upoznajte Elena Lux</span>
          <h1>Male stvari koje stvaraju velike trenutke</h1>
          <p>
            Elena Lux je nastao iz ljubavi prema detaljima, toplini doma i poklonima
            koji govore više od reči. Svaki komad biramo i izrađujemo sa pažnjom,
            kako bi uneo malo lepote u svakodnevicu.
          </p>
        </Container>
      </section>

      <Container>
        <section className="about-values" aria-label="Naše vrednosti">
          <Row className="g-4">
            <Col md={4}>
              <div className="about-value-card">
                <FaHeart />
                <h2>Ručno i sa pažnjom</h2>
                <p>Svaki detalj nastaje polako, pažljivo i sa mnogo ljubavi.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="about-value-card">
                <FaLeaf />
                <h2>Nežnost u domu</h2>
                <p>Biramo boje, mirise i oblike koji prostoru daju toplinu.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="about-value-card">
                <FaGift />
                <h2>Pokloni sa značenjem</h2>
                <p>Naše kolekcije su osmišljene da obraduju drage ljude.</p>
              </div>
            </Col>
          </Row>
        </section>

        <section className="best-sellers">
          <div className="about-section-heading">
            <span className="about-eyebrow">Omiljeno iz naše radionice</span>
            <h2>Najprodavaniji proizvodi</h2>
            <p>Dva posebna komada kojima se naši kupci uvek vraćaju.</p>
          </div>

          <Row className="g-4">
            {bestSellers.map((product) => (
              <Col md={6} key={product.name}>
                <article className="best-seller-card">
                  <div className="best-seller-image-wrap">
                    <img src={product.image} alt={product.name} />
                    <span>{product.label}</span>
                  </div>
                  <div className="best-seller-content">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default AboutScreen;
