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
  callCreateSnack,
  callFetchFilm,
  callFetchSnackById,
  callUpdateSnack,
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
import { ISnack } from "@/types/backend";
import { isMobile } from "react-device-detect";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: ISnack | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface ISnackForm {
  name: string;
  price: number;
}

interface ISnackImage {
  name: string;
  uid: string;
}

const ModalSnack = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  //modal animation
  const [animation, setAnimation] = useState<string>("open");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataImage, setDataImage] = useState<ISnackImage[]>([]);
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

  const submitSnack = async (valuesForm: ISnackForm) => {
    const { name, price } = valuesForm;

    if (dataImage.length === 0) {
      message.error("Vui lòng upload ảnh Image");
      return;
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdateSnack(
        dataInit._id,
        name,
        price,
        value,
        dataImage[0].name
      );
      if (res.data) {
        message.success("Cập nhật snack thành công");
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
      const res = await callCreateSnack(name, price, value, dataImage[0].name);
      if (res.data) {
        message.success("Thêm mới snack thành công");
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
    setDataImage([]);
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

  const handleUploadFileImage = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "snack");
    if (res && res.data) {
      setDataImage([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataImage([]);
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
            title={<>{dataInit?._id ? "Cập nhật Snack" : "Tạo mới Snack"}</>}
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
              className: `modal-snack ${animation}`,
              rootClassName: `modal-snack-root ${animation}`,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitSnack}
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
                  label="Tên snack"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập tên snack"
                />
                <ProFormText
                  label="Giá"
                  name="price"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập giá"
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Ảnh image"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                      validator: () => {
                        if (dataImage.length > 0) return Promise.resolve();
                        else return Promise.reject(false);
                      },
                    },
                  ]}
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileImage}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file)}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.image ?? "",
                                status: "done",
                                url: `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/snack/${dataInit?.image}`,
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

              <ProCard
                title="Miêu tả"
                // subTitle="mô tả rạp phim"
                headStyle={{ color: "#d81921" }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
              </ProCard>
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

export default ModalSnack;
