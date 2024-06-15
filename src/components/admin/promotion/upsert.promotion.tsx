import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { LOCATION_LIST } from "@/config/utils";
import { IFilmSelect } from "../user/modal.user";
import { useState, useEffect } from "react";
import {
  callCreatePromotion,
  callFetchFilm,
  callFetchPromotionById,
  callUpdatePromotion,
  callUploadSingleFile,
} from "@/config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { IPromotion } from "@/types/backend";
import { isMobile } from "react-device-detect";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IPromotion | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface IPromotionForm {
  name: string;
  link: string;
  endDate: Date;
  startDate: Date;
}

interface IPromotionLogo {
  name: string;
  uid: string;
}

const ModalPromotion = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  //modal animation
  const [animation, setAnimation] = useState<string>("open");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataLogo, setDataLogo] = useState<IPromotionLogo[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [value, setValue] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?._id && dataInit?.description) {
      setValue(dataInit.description);
    }
  }, [dataInit]);

  const submitPromotion = async (valuesForm: IPromotionForm) => {
    const { name, link, endDate, startDate } = valuesForm;

    if (dataLogo.length === 0) {
      message.error("Vui lòng upload ảnh Logo");
      return;
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdatePromotion(
        dataInit._id,
        name,
        startDate,
        endDate,
        value,
        dataLogo[0].name,
        link
      );
      if (res.data) {
        message.success("Cập nhật promotion thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const res = await callCreatePromotion(
        name,
        startDate,
        endDate,
        value,
        dataLogo[0].name,
        link
      );
      if (res.data) {
        message.success("Thêm mới promotion thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setValue("");
    setDataInit(null);

    //add animation when closing modal
    setAnimation("close");
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation("open");
  };

  const handleRemoveFile = (file: any) => {
    setDataLogo([]);
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file."
      );
    }
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "promotion");
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={
              <>{dataInit?._id ? "Cập nhật Promotion" : "Tạo mới Promotion"}</>
            }
            open={openModal}
            modalProps={{
              onCancel: () => {
                handleReset();
              },
              afterClose: () => handleReset(),
              destroyOnClose: true,
              width: isMobile ? "100%" : 900,
              footer: null,
              keyboard: false,
              maskClosable: false,
              className: `modal-promotion ${animation}`,
              rootClassName: `modal-promotion-root ${animation}`,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitPromotion}
            initialValues={dataInit?._id ? dataInit : {}}
            submitter={{
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
              searchConfig: {
                resetText: "Hủy",
                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <ProFormText
                  label="Tên khuyến mãi"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập tên khuyến mãi"
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Ảnh Logo"
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                      validator: () => {
                        if (dataLogo.length > 0) return Promise.resolve();
                        else return Promise.reject(false);
                      },
                    },
                  ]}
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="logo"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file)}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.logo ?? "",
                                status: "done",
                                url: `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/promotion/${dataInit?.logo}`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>

              {/* <Col span={16}>
                <ProFormTextArea
                  label="Link"
                  name="link"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập địa chỉ rạp phim"
                  fieldProps={{
                    autoSize: { minRows: 4 },
                  }}
                />
              </Col> */}
              <ConfigProvider locale={enUS}>
                <Row gutter={[20, 20]}>
                  <Col span={24} md={6}>
                    <ProFormDatePicker
                      label="Ngày bắt đầu"
                      name="startDate"
                      normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                      fieldProps={{
                        format: "DD/MM/YYYY",
                      }}
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày cấp" },
                      ]}
                      placeholder="dd/mm/yyyy"
                    />
                  </Col>
                  <Col span={24} md={6}>
                    <ProFormDatePicker
                      label="Ngày kết thúc"
                      name="endDate"
                      normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                      fieldProps={{
                        format: "DD/MM/YYYY",
                      }}
                      // width="auto"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày cấp" },
                      ]}
                      placeholder="dd/mm/yyyy"
                    />
                  </Col>
                  <Col span={24}>
                    <ProForm.Item
                      name="description"
                      label="Miêu tả phim"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập miêu tả cinema!",
                        },
                      ]}
                    >
                      <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                      />
                    </ProForm.Item>
                  </Col>
                </Row>
              </ConfigProvider>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalPromotion;
