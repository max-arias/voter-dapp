import { DatePicker, Form, Input, Modal } from "antd";
import moment from "moment";

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
  const [form] = Form.useForm();

  // Process form
  const onCreate = (values) => {
    console.log({ values });
    // TODO: Hook up to web3
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
        form.resetFields();
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
          rules={[{ required: true }]}
        >
          <Input name="proposal_name" />
        </Form.Item>
        <Form.Item
          name="voting_range"
          label="Voting Start & End"
          rules={[{ required: true }]}
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
