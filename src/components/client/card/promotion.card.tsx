import { callFetchPromotion } from "@/config/api";
import { colorMethod, convertSlug } from "@/config/utils";
import { IPromotion } from "@/types/backend";
import {
  Card,
  Col,
  Divider,
  Empty,
  Pagination,
  Row,
  Spin,
  Carousel,
} from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";

interface IProps {
  showPagination?: boolean;
}

const PromotionCard = (props: IProps) => {
  const { showPagination = false } = props;

  const [displayPromotion, setDisplayPromotion] = useState<IPromotion[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromotion();
  }, [current, pageSize, filter, sortQuery]);

  const fetchPromotion = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchPromotion(query);
    if (res && res.data) {
      console.log(res.data.result);

      setDisplayPromotion(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: IPromotion) => {
    if (item.name) {
      const slug = convertSlug(item.name);
      navigate(`/promotion/${slug}?id=${item._id}`);
    }
  };

  return (
    <div className={`${styles["promotion-section"]}`}>
      <div className={styles["promotion-content"]}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]
                }
              >
                <span className={styles["title"]}>Rạp phim</span>
                {!showPagination && <Link to="promotion">Xem tất cả</Link>}
              </div>
              <Carousel
                autoplay
                dots={{ className: styles["custom-dots"] }}
                dotPosition="bottom"
              >
                {displayPromotion?.slice(0, 5).map((item) => (
                  <Card
                    onClick={() => handleViewDetailJob(item)}
                    style={{ height: 350 }}
                    bodyStyle={{ padding: 0 }}
                    hoverable
                    cover={
                      <div className={styles["card-customize"]}>
                        <img
                          alt="example"
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/promotion/${item?.logo}`}
                        />
                      </div>
                    }
                    key={item._id}
                  >
                    <Divider />
                  </Card>
                ))}
              </Carousel>
            </Col>

            {(!displayPromotion ||
              (displayPromotion && displayPromotion.length === 0)) &&
              !isLoading && (
                <div className={styles["empty"]}>
                  <Empty description="Không có dữ liệu" />
                </div>
              )}
          </Row>
          {showPagination && (
            <>
              <div style={{ marginTop: 30 }}></div>
              <Row style={{ display: "fill", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default PromotionCard;
