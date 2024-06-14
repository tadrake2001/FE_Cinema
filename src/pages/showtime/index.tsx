import ShowtimeCard from "@/components/client/card/showtime.card";
import SearchClient from "@/components/client/search.client";
import { Col, Divider, Row } from "antd";
import styles from "styles/client.module.scss";

const ClientShowtimePage = (props: any) => {
  return (
    <div className={styles["container"]} style={{ marginTop: 20 }}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <ShowtimeCard showPagination={true} />
        </Col>
      </Row>
    </div>
  );
};
export default ClientShowtimePage;
