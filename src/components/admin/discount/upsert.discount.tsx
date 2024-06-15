import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Row,
  message,
  notification,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import {
  FooterToolbar,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { ICinemaSelect, IFilmSelect } from "../user/modal.user";
import { useState, useEffect } from "react";
import {
  callCreateDiscount,
  callFetchCinema,
  callFetchFilm,
  callFetchDiscountById,
  callUpdateDiscount,
} from "@/config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { IDiscount } from "@/types/backend";

const ViewUpsertDiscount = (props: any) => {
  const [cinemas, setCinemas] = useState<ICinemaSelect[]>([]);
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // discount id
  const [dataUpdate, setDataUpdate] = useState<IDiscount | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await callFetchDiscountById(id);
        if (res && res.data) {
          setDataUpdate(res.data);

          form.setFieldsValue({
            ...res.data,
          });
        }
      }
    };
    init();
    return () => form.resetFields();
  }, [id]);

  const onFinish = async (values: any) => {
    const { name, typeDiscount, discount } = values;
    if (dataUpdate?._id) {
      //update
      const cp = values?.film?.value?.split("@#$");
      const discount1 = {
        _id: dataUpdate._id,
        name,
        typeDiscount,
        discount,
      };

      const res = await callUpdateDiscount(discount1, dataUpdate._id);
      if (res.data) {
        message.success("Cập nhật discount thành công");
        navigate("/admin/discount");
      } else {
        notification.error({
          message: "Có lỗi xẩy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const discount1 = {
        name,
        typeDiscount,
        discount,
      };

      const res = await callCreateDiscount(discount1);
      if (res.data) {
        message.success("Tạo mới discount thành công");
        navigate("/admin/discount");
      } else {
        notification.error({
          message: "Có lỗi xẩy ra",
          description: res.message,
        });
      }
    }
  };

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
    <div className={styles["upsert-room-container"]}>
      <div className={styles["title"]}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to="/admin/discount">Manage Discount</Link>,
            },
            {
              title: "Upsert Discount",
            },
          ]}
        />
      </div>
      <div>
        <ConfigProvider locale={enUS}>
          <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                resetText: "Hủy",
                submitText: (
                  <>
                    {dataUpdate?._id ? "Cập nhật Discount" : "Tạo mới Discount"}
                  </>
                ),
              },
              onReset: () => navigate("/admin/discount"),
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={24} md={12}>
                <ProFormText
                  label="Tên Discount"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập tên Discount"
                />
              </Col>
              <Col span={24} md={12}>
                <ProFormSelect
                  label="Chọn kiểu discount"
                  name="typeDiscount"
                  rules={[
                    { required: true, message: "Vui lòng chọn kiểu discount" },
                  ]}
                  placeholder="Chọn kiểu discount"
                  options={[
                    { label: "MINUS", value: "MINUS" },
                    { label: "PERCENT", value: "PERCENT" },
                  ]}
                />
              </Col>

              <Col span={24} md={12}>
                <ProFormDigit
                  label="Nhập disccount"
                  name="discount"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập discount"
                />
              </Col>
            </Row>
            <Divider />
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ViewUpsertDiscount;
