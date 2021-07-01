import { Avatar, Button, Layout, Spin, Typography } from "antd";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../constants";

const { Header: AntdHeader } = Layout;
const { Title } = Typography;

function Header({ isValidating }) {
  const { account, activate } = useWeb3React();

  const connectAccount = () => {
    activate(injectedConnector);
  };

  return (
    <AntdHeader
      className="site-header"
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
      }}
    >
      <Title level={2}>Voter dApp</Title>

      <div className="account-container">
        {isValidating ? <Spin style={{ marginRight: 12 }} /> : null}
        {account ? (
          <>
            <Avatar
              src={`https://avatars.dicebear.com/api/bottts/${account}.svg`}
            />
            <span style={{ color: "#fff", paddingLeft: 12 }}>
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </span>
          </>
        ) : (
          <Button type="primary" shape="round" onClick={connectAccount}>
            Connect
          </Button>
        )}
      </div>
    </AntdHeader>
  );
}

export default Header;
