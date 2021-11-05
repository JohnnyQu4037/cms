import { message } from "antd";
import axios from "axios";

const baseURL = "https://cms.chtoma.com/api/";
var successRegEx = /^[1-2][0-9][0-9]$/;

const getToken = () => {
  return localStorage.getItem("cms_token")
    ? JSON.parse(localStorage.getItem("cms_token")).token
    : null;
};

const errorHandler = (error) => {
  alert("Oops, there's something wrong.\n" + error.response.data.msg);
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
  if (successRegEx.test(res.code)) {
    message.success(res.msg);
  } else {
    message.warning(res.msg);
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
    return res.data;
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
