import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICinema } from "@/types/backend";
import { callFetchCinemaById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)


const ClientCinemaDetailPage = (props: any) => {
    const [cinemaDetail, setCinemaDetail] = useState<ICinema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // cinema id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCinemaById(id);
                if (res?.data) {
                    setCinemaDetail(res.data)
                    console.log(res.data);
                    
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-cinema-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <>
                    {cinemaDetail && cinemaDetail._id && (
                        <>
                            <div className={styles["detail-container"]}>
                                <div className={styles["detail-slide"]}>
                                    <div className={styles["slider-container"]}>
                                        <img
                                            alt="detail-film"
                                            className={styles["slide-image"]}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/cinema/${cinemaDetail.logo
                                                }`}
                                        />
                                    </div>
                                </div>
                                <div className={styles["detail-info"]}>
                                    <div className={styles["info-top"]}>
                                        <div className={styles["info-content"]}>
                                            <div className={styles["info-text"]}>
                                                <div className={styles["name"]}>
                                                    <div className={styles["header"]}>
                                                        Rạp chiếu phim: {cinemaDetail.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["info-address"]}>
                                    <strong>Địa chỉ: </strong> {cinemaDetail.address}
                                </div>
                                <div className={styles["info-bot"]}>
                                    {parse(cinemaDetail.description)}
                                </div>
                            </div>
                        </>
                    )}
                </>
            }
        </div >
    )
}
export default ClientCinemaDetailPage;