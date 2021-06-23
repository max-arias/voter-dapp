import { Card, Avatar } from "antd";

const { Meta } = Card;

const Proposal = ({ item, handleOpen }) => {
  return (
    <Card hoverable style={{ minHeight: 168 }} onClick={handleOpen}>
      <Meta
        avatar={
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${item.owner}.svg`}
          />
        }
        title={item.name}
        description={item.description}
      />
    </Card>
  );
};

export default Proposal;
