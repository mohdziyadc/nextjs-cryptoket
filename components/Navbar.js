import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

import { ConnectButton } from "@web3uikit/web3";
const Navbar = () => {
    // const { address, connectWallet, error } = useWeb3();

    // error ? console.log(error) : null;

    return (
        <nav className="p-2 border-b-2 flex flex-row justify-between items-center bg-gradient-to-r from-gray-900 to-gray-600">
            <div className="px-4 flex flex-row justify-center items-center">
                <img src="/images/ape.png" />
                <h1 className="py-4 px-2 font-mono font-bold text-3xl text-white">
                    CryptoKet
                </h1>
            </div>

            <div className="flex flex-row justify-center items-center flex-1">
                <NavBarItem href="/">Buy</NavBarItem>
                <NavBarItem href="/owned-nft">Owned</NavBarItem>
                <NavBarItem href="/create-nft">Create</NavBarItem>
            </div>
            <ConnectButton moralisAuth={false}></ConnectButton>
        </nav>
    );
};

const NavBarItem = (props) => {
    const { href, children } = props;
    const router = useRouter();
    const activeRoute = router.route.split("/")[1];
    const isActive = href == `/${activeRoute}`;

    return (
        <Link
            href={href}
            className={classNames(
                "rounded-lg px-4 py-2 font-semibold text-white",
                {
                    "bg-gradient-to-r from-cyan-200 to-cyan-400 text-black":
                        isActive,
                }
            )}
        >
            {children}
        </Link>
    );
};
export default Navbar;
