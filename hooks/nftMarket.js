const useNftMarket = () => {
  const createNftTokenUri = async (values) => {
    try {
      const metadata = new FormData();
      metadata.append("name", values.name);
      metadata.append("description", values.desc);
      metadata.append("image", values.image);

      const response = await fetch("/api/nft-storage", {
        method: "POST",
        body: metadata,
      });

      if (response.status == 201) {
        const json = await response.json();
        // console.log(`Token URI: ${json.uri}`);
        return json.uri;
      }
    } catch (e) {
      console.log(e);
    }
  };
  return { createNftTokenUri };
};

export default useNftMarket;
