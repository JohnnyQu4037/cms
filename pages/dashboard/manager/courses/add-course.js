import { useState } from "react";
import { Steps } from "antd";
import CourseDetailForm from "../../../../components/CourseDetailForm";
import CourseScheduleForm from "../../../../components/CourseScheduleForm";
import SuccessPage from "../../../../components/SuccessPage";
import { cloneDeep } from "lodash";

const { Step } = Steps;

export default function AddCourse() {
  const [stageDetail, setStageDetail] = useState({
    current: 0,
    stages: { 0: true, 1: false, 2: false },
  });
  const [courseId,setCourseId] = useState(null)

  const onStageChange = (currentSelectedStage) => {
    if (stageDetail.stages[currentSelectedStage]) {
      const changedStage = cloneDeep(stageDetail);
      changedStage.current = currentSelectedStage;
      setStageDetail(changedStage);
    }
  };
  const changeStage = (next) => {
    const changedStage = cloneDeep(stageDetail);
    changedStage.current = next;
    changedStage.stages[changedStage.current] = true;
    setStageDetail(changedStage);
  };

  return (
    <>
      <Steps
        type="navigation"
        current={stageDetail.current}
        onChange={onStageChange}
        style={{ margin: "20px 0", padding: "1em 1.6%" }}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>

      <CourseDetailForm
        style={{ display: stageDetail.current === 0 ? "block" : "none" }}
        setStage={changeStage}
        setId = {setCourseId}
      />

      <CourseScheduleForm
        style={{ display: stageDetail.current === 1 ? "block" : "none" }}
        setStage={changeStage}
        courseId = {courseId}
      />

      <SuccessPage
        style={{ display: stageDetail.current === 2 ? "block" : "none" }}
        courseId = {courseId}
      />
    </>
  );
}
