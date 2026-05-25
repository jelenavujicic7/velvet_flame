import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import './styles/bootstrap-custom.css';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <HomeScreen />
      <Footer />
    </div>
  );
}

export default App;
