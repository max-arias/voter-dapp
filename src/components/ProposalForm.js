import { useState } from "react";
import { DatePicker, Form, Input, Modal, notification } from "antd";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

import fetcher from "../utils/swr";

const { RangePicker } = DatePicker;

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const ProposalForm = ({ isOpen, handleClose }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { account, library } = useWeb3React();

  const fetch = fetcher(library);

  const [form] = Form.useForm();

  // Process form
  const onCreate = async (values) => {
    const [voteStart, voteEnd] = values.voting_range;
    setConfirmLoading(true);

    const voteStartUtc = moment(voteStart)
      .add(voteStart.utcOffset(), "m")
      .utc()
      .startOf("day")
      .unix();

    const voteEndUtc = moment(voteEnd)
      .add(voteStart.utcOffset(), "m")
      .utc()
      .startOf("day")
      .unix();

    fetch(
      "createProposal",
      values.proposal_name,
      values.proposal_description,
      voteStartUtc,
      voteEndUtc
    )
      .then(() => {
        notification.success({
          message: `Proposal "${values.proposal_name}" created!`,
        });
      })
      .catch((e) => {
        notification.error({
          message: "There was an error processing your vote",
          description: e?.message || e?.data?.message || "",
        });
      })
      .finally(() => {
        form.resetFields();
        handleClose();
        setConfirmLoading(false);
      });
  };

  // Voting can only happen in the future 🤯
  const disabledDate = (current) => {
    return current.endOf("day") < moment();
  };

  // Validate fields on modal submit
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="New Proposal"
      visible={isOpen}
      okText="Create"
      cancelText="Cancel"
      onOk={handleFormSubmit}
      onCancel={handleClose}
      destroyOnClose
      okButtonProps={{ disabled: !account }}
      confirmLoading={confirmLoading}
    >
      <Form
        name="time_related_controls"
        form={form}
        preserve={false}
        scrollToFirstError
        {...layout}
      >
        <Form.Item
          name="proposal_name"
          label="Proposal Name"
          rules={[
            { required: true, message: "Your proposal requires a name." },
          ]}
        >
          <Input name="proposal_name" />
        </Form.Item>
        <Form.Item
          name="voting_range"
          label="Voting Start & End"
          rules={[
            {
              required: true,
              message: "Your proposal requires a Start and End date.",
            },
          ]}
        >
          <RangePicker
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            name="voting_range"
          />
        </Form.Item>
        <Form.Item
          name="proposal_description"
          label="Proposal Description"
          rules={[
            {
              required: true,
              max: 250,
              message: "Your proposal cannot exceed 250 characters.",
            },
          ]}
        >
          <Input.TextArea name="proposal_description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProposalForm;
