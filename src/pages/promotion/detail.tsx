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
          console.log(res.data);

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
        <>
          {promotionDetail && promotionDetail._id && (
            <>
              <div className={styles["detail-container"]}>
                <div className={styles["detail-title"]}>
                  <div className={styles["header"]}>{promotionDetail.name}</div>
                </div>
                <div className={styles["detail-image"]}>
                  <div className={`${styles["image-container"]}`}>
                    <img
                      alt="example"
                      src={`${import.meta.env.VITE_BACKEND_URL
                        }/images/promotion/${promotionDetail?.logo}`}
                    />
                  </div>
                </div>
                <div className={styles["detail-description"]}>
                  <div className={styles["description"]}>
                    {parse(promotionDetail?.description ?? "")}
                  </div>
                </div>
              </div>
            </>
          )}
        </>

      )}
    </div>
  );
};
export default ClientPromotionDetailPage;
