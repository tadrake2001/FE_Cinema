import {
  Breadcrumb,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  Pagination,
  Row,
  Spin,
  message,
  notification,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FooterToolbar,
  ProForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { LOCATION_LIST, convertSlug } from "@/config/utils";

import { useState, useEffect } from "react";
import {
  callCreateShowtime,
  callFetchCinema,
  callFetchFilm,
  callFetchRoom,
  callFetchShowtimeByDate,
  callFetchShowtimeById,
  callUpdateShowtime,
} from "@/config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { IShowtime } from "@/types/backend";
import {
  ICinemaSelect,
  IFilmSelect,
  IFilmSelect1,
  IRoomSelect,
} from "@/components/admin/user/modal.user";
import { DebounceSelect } from "@/components/admin/user/debouce.select";
import { isMobile } from "react-device-detect";

interface IProps {
  showPagination?: boolean;
}
const ShowtimeCard = (props: IProps) => {
  const { showPagination = false } = props;
  const [showtimes, setShowtimes] = useState([]);
  const [rooms, setRooms] = useState<IRoomSelect[]>([]);
  const [films, setFilms] = useState<IFilmSelect1[]>([]);

  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");

  const [displayShowtime, setDisplayShowtime] = useState<IShowtime[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // showtime id
  const [dataUpdate, setDataUpdate] = useState<IShowtime | null>(null);
  const [form] = Form.useForm();

  // useEffect(() => {
  //   fetchShowtime();
  // }, [form]);

  // const fetchShowtime = async () => {
  //   setIsLoading(true);
  //   const cinemaId = form.getFieldValue("cinema")?.value;
  //   const filmId = form.getFieldValue("film")?.key;
  //   const date = form.getFieldValue("date");
  //   let query = `page=1&limit=10&date=${date}&filmId=${filmId}&${cinemaId}&`;
  //   const res = await callFetchShowtimeByDate(query);
  // if (res && res.data) {
  //   setDisplayShowtime(res.data.items);
  //   // setTotal(res.data.meta.total);
  // }
  // setIsLoading(false);
  // };
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

  const handleViewDetailShowtime = (item: IShowtime) => {
    const slug = convertSlug(item._id as string);
    navigate(`/showtime/${slug}?id=${item._id}`);
  };

  const onFinish = async (values: any) => {
    const { cinema, film, date } = values;
    const showtime = {
      cinema: cinema.value,
      film: film.value,
      date: date,
    };
    let query = `page=1&limit=10&date=${date}&filmId=${film.key}&cinemaId=${cinema.value}&`;
    const res = await callFetchShowtimeByDate(query);
    console.log("🚀 ~ onFinish ~ cinema:", cinema.value);
    console.log("🚀 ~ onFinish ~ film:", film.key);
    console.log("🚀 ~ onFinish ~ date:", date);
    if (res && res.data) {
      setDisplayShowtime(res.data.items);
      // setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  async function fetchFilmList(name: string): Promise<ICinemaSelect[]> {
    const res = await callFetchFilm(`current=1&pageSize=100&name=/${name}/i`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          key: item._id as string,
          value: item.time as number,
        };
      });
      return temp;
    } else return [];
  }

  async function fetchCinemaList(name: string): Promise<ICinemaSelect[]> {
    const res = await callFetchCinema(`current=1&pageSize=100&name=/${name}/i`);
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      return temp;
    } else return [];
  }

  return (
    <div className={styles["upsert-showtime-container"]}>
      <div>
        <ConfigProvider locale={enUS}>
          <ProForm onFinish={onFinish}>
            <Row gutter={[20, 20]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="cinema"
                  label="Chọn rạp chiếu phim"
                  rules={[
                    { required: true, message: "Vui lòng chọn rạp chiếu!" },
                  ]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={rooms}
                    value={rooms}
                    placeholder="Chọn rạp chiếu"
                    fetchOptions={fetchCinemaList}
                    onChange={(newValue: any) => {
                      if (newValue?.length === 0 || newValue?.length === 1) {
                        setRooms(newValue as IFilmSelect[]);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </ProForm.Item>
              </Col>

              <Col lg={12} md={12} sm={24} xs={24}>
                <ProForm.Item
                  name="film"
                  label="Chọn phim"
                  rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
                >
                  <DebounceSelect
                    allowClear
                    showSearch
                    defaultValue={films}
                    value={films}
                    placeholder="Chọn phim"
                    fetchOptions={fetchFilmList}
                    onChange={(newValue: any) => {
                      if (newValue?.length === 0 || newValue?.length === 1) {
                        setRooms(newValue as IFilmSelect[]);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </ProForm.Item>
              </Col>
              <Col span={24} md={6}>
                <ProFormDatePicker
                  label="Chọn ngày chiếu"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày chiếu!",
                    },
                  ]}
                  placeholder="YYYY-MM-DD"
                />
              </Col>
            </Row>
            <Divider />
            <div>
              <Row gutter={[20, 20]}>
                {displayShowtime?.map((item) => {
                  return (
                    <Col span={24} md={12} key={item._id}>
                      <Card
                        size="small"
                        title={item.room?.name}
                        hoverable
                        onClick={() => handleViewDetailShowtime(item)}
                      >
                        <div style={{ textAlign: "center" }}>
                          <h3>{item.room?.name}</h3>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          {item.cinema?.name}
                        </div>
                      </Card>
                    </Col>
                  );
                })}

                {(!displayShowtime ||
                  (displayShowtime && displayShowtime.length === 0)) &&
                  !isLoading && (
                    <div className={styles["empty"]}>
                      <Empty description="Không có lịch chiếu" />
                    </div>
                  )}
              </Row>
              {showPagination && (
                <>
                  <div style={{ marginTop: 30 }}></div>
                  <Row style={{ display: "flex", justifyContent: "center" }}>
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
            </div>
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ShowtimeCard;
