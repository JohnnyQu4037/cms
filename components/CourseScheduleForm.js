import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  Select,
  TimePicker,
} from "antd";
import { useState } from "react";
import { cloneDeep } from "lodash";
import { addSchedule } from "../pages/api/api-service";

export default function CourseScheduleForm({ style, setStage, courseId }) {
  const [form] = Form.useForm();
  const [weekdaySelected, setWeekdaySelected] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [selected, setSelected] = useState(null);

  const onFinish = () => {
    let data =cloneDeep(form.getFieldsValue());
    data =  { ...data, ...courseId }
    data["chapters"].map((item, index) => {
      item.order = index + 1;
    });
    data.classTime.map((item, index) => {
      data.classTime[index] = item.weekDay + " " + item.time.format("HH:mm:ss");
    });

    addSchedule(data).then((res)=>{
      if(res){
        setStage(2);
      }
    })
    
  };
  return (
    <Form
      style={{ ...style, padding: "0px 1.6%" }}
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={16} style={{ marginBottom: "30px" }}>
        <Col span={12} style={{ padding: "8px 3px" }}>
          <h2>Chapters</h2>
          <Form.List
            name={"chapters"}
            initialValue={[{ name: "", content: "" }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        name={[field.name, "name"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name={[field.name, "content"]}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn(
                                "You must set at least one chapter."
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12} style={{ padding: "8px 3px" }}>
          <h2>Class times</h2>
          <Form.List
            name={"classTime"}
            initialValue={[{ weekDay: null, time: null }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        name={[field.name, "weekDay"]}
                        rules={[{ required: true }]}
                      >
                        <Select
                          className="weekday-selections"
                          size="large"
                          onClick={(item) => {
                            if (
                              item.target.className ===
                              "ant-select-selection-item"
                            ) {
                              setSelected(item.target.innerText);
                            }
                          }}
                          onChange={(selection) => {
                            const update = cloneDeep(weekdaySelected);
                            update[selection] = true;
                            if (selected) {
                              update[selected] = false;
                            }
                            setWeekdaySelected(update);
                          }}
                        >
                          {Object.keys(weekdaySelected).map((item) => {
                            return (
                              <Select.Option
                                value={item}
                                key={item}
                                disabled={weekdaySelected[item]}
                              >
                                {item}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name={[field.name, "time"]}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              const selectedField = document
                                .getElementsByClassName("weekday-selections")
                                [field.name].getElementsByClassName(
                                  "ant-select-selection-item"
                                )[0]?.innerHTML;
                              if (!!selectedField) {
                                const update = cloneDeep(weekdaySelected);
                                update[selectedField] = false;
                                setWeekdaySelected(update);
                              }
                              remove(field.name);
                            } else {
                              message.warn(
                                "You must set at least one class time."
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
