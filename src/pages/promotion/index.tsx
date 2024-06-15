import SearchClient from "@/components/client/search.client";
import { Col, Divider, Row } from "antd";
import styles from "styles/client.module.scss";
import PromotionCard from "@/components/client/card/promotion.card";

const ClientPromotionPage = (props: any) => {
  return (
    <div className={styles["container"]} style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        {/* <Col span={24}>
          <SearchClient />
        </Col>
        <Divider /> */}
        <Col span={24}>
          <PromotionCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};

export default ClientPromotionPage;
