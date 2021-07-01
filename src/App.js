import { SWRConfig } from "swr";
import { useWeb3React } from "@web3-react/core";

import fetcher from "./utils/swr";
import Content from "./layout/Content";

import "./App.css";

const App = () => {
  const { library } = useWeb3React();

  return (
    <SWRConfig value={{ fetcher: fetcher(library), refreshInterval: 30000 }}>
      <Content />
    </SWRConfig>
  );
};

export default App;
