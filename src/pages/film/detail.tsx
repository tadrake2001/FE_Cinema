import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IFilm } from "@/types/backend";
import { callFetchFilmById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

const images = [
  'quatrung-1713314131413.jpg',
  'doahoa-1713314216210.jpg',
  'quatrung-1713314131413.jpg',
  'doahoa-1713314216210.jpg',
  'quatrung-1713314131413.jpg',
  'doahoa-1713314216210.jpg',
];

const ClientFilmDetailPage = (props: any) => {
  const [filmDetail, setFilmDetail] = useState<IFilm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const chooseSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Auto-slide interval (e.g., 3 seconds)
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const navigate = useNavigate();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // film id

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true)
        const res = await callFetchFilmById(id);
        if (res?.data) {
          setFilmDetail(res.data)
        }
        setIsLoading(false)
      }
    }
    init();
  }, [id]);

  return (
    <div
      className={`${styles["container"]} ${styles["detail-film-section"]}`}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {filmDetail && filmDetail._id && (
            <>
              <div className={styles["detail-container"]}>
                <div className={styles["detail-slide"]}>
                  <div className={styles["slider-container"]}>
                    <button className={styles["button-left"]} onClick={prevSlide}>❮</button>
                    <div className={styles["slider-wrapper"]}>
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`${styles["slide"]} ${index === currentIndex ? styles['active'] : ''}`}
                        >
                          <img
                            alt="detail-film"
                            className={styles["slide-image"]}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/film/${image
                              }`}
                          />
                        </div>
                      ))}
                    </div>
                    <button className={styles["button-right"]} onClick={nextSlide}>❯</button>
                  </div>
                </div>
                <div className={styles["detail-info"]}>
                  <div className={styles["info-slide"]}>
                    <div className={styles["info-wrapper"]}>
                      {images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => chooseSlide(index)}
                          className={`${styles["slide"]} ${index === currentIndex ? styles['active'] : ''}`}
                        >
                          <img
                            alt="detail-film"
                            className={styles["info-image"]}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/film/${image
                              }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles["info-top"]}>
                    <div className={styles["info-content"]}>
                      <div className={styles["info-image"]}>
                        <img
                          width={200}
                          height={200}
                          alt="detail-film"
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/film/${filmDetail.logo
                            }`}
                        />
                        <div>
                          <button className={styles["btn-apply"]}>Mua vé</button>
                        </div>
                      </div>
                      <div className={styles["info-text"]}>
                        <div className={styles["name"]}>
                          <div className={styles["header"]}>
                            Phim: {filmDetail.name}
                          </div>
                        </div>
                        <div className={styles["type"]}>
                          Giám đốc sản xuất: {filmDetail.director}
                        </div>
                        <div className={styles["type"]}>
                          Diễn viên: {filmDetail?.actors?.map((item, index) => {
                            return (
                              <Tag key={`${index}-key`} color="blue">
                                {item}
                              </Tag>
                            );
                          })}
                        </div>
                        <div className={styles["type"]}>
                          <div className={styles["genres"]}>
                            {" "}
                            Thể loại:
                            {filmDetail?.genres?.map((item, index) => {
                              return (
                                <Tag key={`${index}-key`} color="gold">
                                  {item}
                                </Tag>
                              );
                            })}
                          </div>
                        </div>
                        <div className={styles["time"]}>
                          <div>
                            <HistoryOutlined /> {filmDetail.time} phút
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles["info-bot"]}>
                    {parse(filmDetail.description)}
                  </div>
                </div>
              </div>
            </>
          )}
        </>

      )}
    </div>
  );
}
export default ClientFilmDetailPage;