import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const activeChainId = ChainId.Goerli;
const connectors = {
  injected: {},
};
export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Navbar />
      <div className="h-screen -mt-1  bg-gradient-to-r from-blue-400 to-emerald-400">
        <Component {...pageProps} />
      </div>
    </ThirdwebProvider>
  );
}
