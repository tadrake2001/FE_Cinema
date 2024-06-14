import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IPromotion } from "@/types/backend";
import { callFetchPromotionById } from "@/config/api";
import styles from "styles/client.module.scss";
import parse from "html-react-parser";
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ClientPromotionDetailPage = (props: any) => {
  const [promotionDetail, setPromotionDetail] = useState<IPromotion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // promotion id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true);
        const res = await callFetchPromotionById(id);
        if (res?.data) {
          setPromotionDetail(res.data);
        }
        setIsLoading(false);
      }
    };
    init();
  }, [id]);

  return (
    <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {promotionDetail && promotionDetail._id && (
            <>
              <Col span={24} md={16}>
                <div className={styles["header"]}>{promotionDetail.name}</div>

                <div className={styles["location"]}>
                  <EnvironmentOutlined style={{ color: "#58aaab" }} />
                  &nbsp;{promotionDetail?.name}
                </div>

                <Divider />
                {parse(promotionDetail?.description ?? "")}
              </Col>

              <Col span={24} md={8}>
                <div className={styles["promotion"]}>
                  <div className={`${styles["image-container"]}`}>
                    <img
                      alt="example"
                      src={`${
                        import.meta.env.VITE_BACKEND_URL
                      }/images/promotion/${promotionDetail?.logo}`}
                    />
                  </div>
                  <div>
                    <h3 style={{ textAlign: "center" }}>
                      {promotionDetail.name}
                    </h3>
                  </div>
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
    </div>
  );
};
export default ClientPromotionDetailPage;
