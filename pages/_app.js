import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { MoralisProvider } from "react-moralis";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NotificationProvider } from "@web3uikit/core";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/40757/cryptoket-v3/v0.0.0.1",
});
export default function App({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <ApolloProvider client={client}>
                <NotificationProvider>
                    <Navbar />
                    <div className="h-full min-h-screen -mt-1  bg-gradient-to-r from-blue-400 to-emerald-400">
                        <Component {...pageProps} />
                    </div>
                </NotificationProvider>
            </ApolloProvider>
        </MoralisProvider>
    );
}
