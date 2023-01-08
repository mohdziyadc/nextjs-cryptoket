import {
  HomeOutlined,
  PropertySafetyOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Col, Row } from "antd";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const { Header } = Layout;
const items = [
  {
    label: <Link href="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link href="/owned-nft">Owned NFTS</Link>,
    key: "owned",
    icon: <PropertySafetyOutlined />,
  },
  {
    label: <Link href="/list-nft">List NFTs</Link>,
    key: "list",
    icon: <UnorderedListOutlined />,
  },
];
const connectWallet = () => {
  console.log("Button Clicked");
};

const Navbar = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const menuItemClick = (element) => {
    console.log(element.key);
    setCurrentPage(element.key);
    console.log(`Current Page: ${currentPage}`);
  };

  return (
    <Layout className="layout">
      <Header>
        <Row>
          <Col span={8}>
            <div className="Logo justify-center items-center my-4">
              <div className="flex flex-row flex-initial items-center text-white font-mono font-semibold text-xl">
                <Image
                  src="/images/ape.png"
                  alt="ape"
                  height="32"
                  width="32"
                  className="mx-2"
                />
                CryptoKet
              </div>
            </div>
          </Col>
          <Col span={12}>
            <Menu
              onClick={menuItemClick}
              theme="dark"
              mode="horizontal"
              items={items}
              selectedKeys={[currentPage]}
            ></Menu>
          </Col>
          <Col span={4}>
            <div>
              <button
                className="text-white font-mono font-semibold text-base rounded-full bg-blue-600 py-1 px-4 hover:bg-blue-800"
                onClick={connectWallet}
              >
                Connect
              </button>
            </div>
          </Col>
        </Row>
        <div></div>
      </Header>
    </Layout>
  );
};
export default Navbar;
