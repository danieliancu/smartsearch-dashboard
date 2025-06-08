// import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Dashboard.css"; // sau unde ai tu stilurile


export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
