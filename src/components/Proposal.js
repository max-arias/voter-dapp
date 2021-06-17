import { Card, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Meta } = Card;

const Proposal = ({ item }) => {
  const shortDesc =
    item.description.length > 32
      ? item.description.slice(0, 32) + "..."
      : item.description;

  return (
    <Card hoverable actions={[<EyeOutlined key="view" />]}>
      <Meta
        avatar={
          <Avatar
            src={`https://avatars.dicebear.com/api/bottts/${item.owner}.svg`}
          />
        }
        title={item.name}
        description={shortDesc}
      />
    </Card>
  );
};

export default Proposal;
