import { message } from "antd";
import axios from "axios";

const baseURL = "http://cms.chtoma.com/api/";
var successRegEx = /^[1-2][0-9][0-9]$/;

const getToken = () => {
  return localStorage?.getItem("cms_token")
    ? JSON.parse(localStorage.getItem("cms_token")).token
    : null;
};

const errorHandler = (error) => {
  message.error("unknown error");
};

const deleteRequest = (path) => {
  return axios
    .delete(baseURL + path, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch(errorHandler);
};

const putRequest = (path, data) => {
  return axios
    .put(
      baseURL + path,
      { ...data },
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch(errorHandler);
};

const postRequest = (path, data) => {
  return axios
    .post(
      baseURL + path,
      data,
      getToken()
        ? {
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          }
        : null
    )
    .then((res) => {
      return res.data;
    })
    .catch(errorHandler);
};

const getRequest = (path) => {
  return axios
    .get(baseURL + path, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch(errorHandler);
};

const renderMessage = (res) => {
  if (!res) {
    return
  } else {
    if (successRegEx.test(res.code)) {
      message.success(res.msg);
    } else {
      message.warning(res.msg);
    }
  }
};

export const deleteRecord = (path) => {
  return deleteRequest(path).then((res) => {
    renderMessage(res);
    return res.data;
  });
};

export const editStudent = (path, data) => {
  return putRequest(path, data).then((res) => {
    renderMessage(res);
    return res.data;
  });
};

export const addStudent = (path, data) => {
  return postRequest(path, data).then((res) => {
    renderMessage(res);
    return;
  });
};

export const dataEnquiry = (pageInfo, query) => {
  const path =
    `students?page=${pageInfo.page}&limit=${pageInfo.limit}` +
    (query !== "" ? `&query=${query}` : "");
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const login = (data) => {
  return postRequest("login", data).then((res) => {
    return res;
  });
};

export const logout = () => {
  if (!getToken) {
    return;
  }
  return postRequest("logout", {});
};

export const getStudentInfo = (id) => {
  const path = `students/${id}`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const getAllCourse = (pageNum) => {
  const path = `courses?page=${pageNum + 1}&limit=20`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const getCourseInfo = (id) => {
  const path = `courses/detail?id=${id}`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const getCourseCode = () => {
  const path = `courses/code`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const getCourseType = () => {
  const path = `courses/type`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const getTeacherList = (query) => {
  const path = `teachers?query=${query}`;
  return getRequest(path).then((res) => {
    return res?.data;
  });
};

export const addCourse = (data) => {
  return postRequest("courses", data).then((res) => {
    renderMessage(res);
    return res;
  });
};

export const addSchedule = (data) => {
  return putRequest("courses/schedule", data).then((res) => {
    renderMessage(res);
    return res.data;
  });
};

export const getOverview = () => {
  return getRequest(`statistics/overview`).then((res) => {
    return res?.data;
  });
};