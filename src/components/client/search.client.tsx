import { Button, Col, Form, Row, Select } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from "@/config/utils";
import { ProForm } from "@ant-design/pro-components";

const SearchClient = () => {
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {};

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => <></>,
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24} md={16}>
          <ProForm.Item name="skills">
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: "100%" }}
              placeholder={
                <>
                  <MonitorOutlined /> Tìm theo kỹ năng...
                </>
              }
              optionLabelProp="label"
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <ProForm.Item name="location">
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: "100%" }}
              placeholder={
                <>
                  <EnvironmentOutlined /> Địa điểm...
                </>
              }
              optionLabelProp="label"
              options={optionsLocations}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <Button type="primary" onClick={() => form.submit()}>
            Search
          </Button>
        </Col>
      </Row>
    </ProForm>
  );
};
export default SearchClient;