import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { MoralisProvider } from "react-moralis";

const connectors = {
  injected: {},
};
export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Navbar />
      <div className="h-screen -mt-1  bg-gradient-to-r from-blue-400 to-emerald-400">
        <Component {...pageProps} />
      </div>
    </MoralisProvider>
  );
}
