import { InboxOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Spin,
  DatePicker,
  InputNumber,
  Upload,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import {
  getCourseCode,
  getCourseType,
  getTeacherList,
} from "../pages/api/api-service";
import moment from "moment";
import ImgCrop from "antd-img-crop";
import styled from "styled-components";
import { addCourse } from "../pages/api/api-service";

const { Option } = Select;

const DescriptionAndCoverArea = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 30px 0 24px 0;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content {
    height: 100%;
  }
`;

const DeleteButton = styled(CloseCircleOutlined)`
  color: red;
  position: absolute;
  right: -10px;
  top: 20px;
  font-size: 20px;
`;

const UploadDragger = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 30px 0 24px 0;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-list-picture .ant-upload-list-item-thumbnail img,
  .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
    object-fit: cover;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

function disabledDate(current) {
  return current && current < moment().endOf("day");
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function CourseDetailForm({ style, setStage,setId }) {
  const [form] = Form.useForm();
  const [courseType, setCourseType] = useState(null);
  const [teacherList, setTeacherList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isExisted, setIsExisted] = useState(false);

  const defaultDurationUnit = 2;
  useEffect(() => {
    getCourseCode().then((res) => {
      form.setFieldsValue({ uid: res });
    });
    getCourseType().then((res) => {
      setCourseType(res);
    });
    // delete the next line to get back to production
    form.setFieldsValue({
      durationUnit: 2,
      uid: "7ca07c43-4c21-4a03-8066-2df6e68c286f",
      name: "1dsaf d",
      teacherId: 13,
      type: [2],
      price: 0,
      maxStudents: 1,
      duration: 1,
      detail:
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    });
  }, []);

  const onFinish = () => {
    let clone = { ...form.getFieldsValue() };
    const startDate = form.getFieldsValue()["startTime"];
    if (!!startDate) {
      clone["startTime"] = startDate.format("YYYY-MM-DD");
    }
    addCourse(clone).then((res) => {
      if (res) {
        const {id,scheduleId} = res.data
        setIsExisted(true);
        setId({courseId: id,scheduleId: scheduleId})
        setStage(1);
      }
    });
  };

  return (
    <Form
      style={style}
      labelCol={{ offset: 1 }}
      wrapperCol={{ offset: 1 }}
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={16} style={{ marginBottom: "30px" }}>
        <Col span={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input placeholder="course name" />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Row gutter={6}>
            <Col span={8}>
              <Form.Item
                label="Teacher"
                name="teacherId"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select teacher"
                  showSearch
                  filterOption={false}
                  notFoundContent={isSearching ? <Spin size="small" /> : null}
                  onSearch={(query) => {
                    if (query === "") {
                      setTeacherList([]);
                    } else {
                      setIsSearching(true);
                      getTeacherList(query).then((res) => {
                        if (!!res) {
                          setTeacherList(res.teachers);
                        }
                        setIsSearching(false);
                      });
                    }
                  }}
                >
                  {teacherList.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select mode="multiple">
                  {courseType?.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="uid"
                label="Course Code"
                rules={[{ required: true }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD "
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Student Limit"
            name="maxStudents"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={10} />
          </Form.Item>
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              addonAfter={
                <Form.Item
                  style={{ margin: "-2px" }}
                  name="durationUnit"
                  initialValue={defaultDurationUnit}
                >
                  <Select>
                    <Option value={1}>year</Option>
                    <Option value={2}>month</Option>
                    <Option value={3}>day</Option>
                    <Option value={4}>week</Option>
                    <Option value={5}>hour</Option>
                  </Select>
                </Form.Item>
              }
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <DescriptionAndCoverArea
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                max: 1000,
                min: 100,
                message:
                  "Description length must between 100 - 1000 characters.",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Course description"
              style={{ height: "100%" }}
            />
          </DescriptionAndCoverArea>
        </Col>

        <Col span={8}>
          <UploadDragger label="Cover" name="cover">
            <ImgCrop rotate aspect={16 / 9}>
              <Upload.Dragger
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                onChange={(info) => {
                  const { status } = info.file;
                  if (status === "uploading") {
                    setIsLoaded(true);
                    setIsUploading(true);
                  } else {
                    if (status === "done") {
                      form.setFieldsValue({ cover: info.file.response.url });
                    } else {
                      form.setFieldsValue({ cover: "" });
                    }
                    setIsUploading(false);
                  }
                }}
                onRemove={() => {
                  setTimeout(function () {
                    setIsLoaded(false);
                  }, 200);
                }}
                style={{ display: isLoaded ? "none" : "block" }}
                onPreview={async (file) => {
                  if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                  }

                  setPreviewImage(file.url || file.preview);
                  setPreviewVisible(true);
                  setPreviewTitle(
                    file.name ||
                      file.url.substring(file.url.lastIndexOf("/") + 1)
                  );
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p
                  className="ant-upload-text"
                  style={{ fontSize: "24px", color: "rgb(153, 153, 153)" }}
                >
                  Click or drag file to this area to upload
                </p>
              </Upload.Dragger>
            </ImgCrop>
          </UploadDragger>
          {isUploading && (
            <DeleteButton
              onClick={() => {
                setIsUploading(false);
              }}
            />
          )}
        </Col>
      </Row>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
        }}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      <Row gutter={20}>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isExisted ? "Update Course" : "Create Course"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
