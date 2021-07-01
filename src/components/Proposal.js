import { Card as AntdCard, Avatar } from "antd";
import styled from "styled-components";

const Card = styled(AntdCard)`
  .ant-card-body p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 0;
    min-height: 66px;
    overflow: hidden;
  }
`;

const Proposal = ({ item, handleOpen }) => {
  return (
    <Card
      hoverable
      onClick={handleOpen}
      avatar={
        <Avatar
          src={`https://avatars.dicebear.com/api/bottts/${item.owner}.svg`}
        />
      }
      title={item.name}
    >
      <p>{item.description}</p>
    </Card>
  );
};

export default Proposal;
