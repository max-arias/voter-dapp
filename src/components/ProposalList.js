import { Col } from "antd";

import Proposal from "./Proposal";

const ProposalList = function ({ proposals = [], openProposalModal }) {
  return proposals.map((item) => (
    <Col span={8} key={`${item.owner}-${item.name}`}>
      <Proposal item={item} handleOpen={() => openProposalModal(item)} />
    </Col>
  ));
};

export default ProposalList;
