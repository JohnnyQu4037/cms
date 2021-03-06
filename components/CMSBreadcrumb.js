import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { routes } from "../constant/routes";
import { Fragment } from "react";

export default function CMSBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);
  const root = "/" + paths.slice(0, 2).join("/");
  const remainingPath = paths.slice(2);

  const userRole = path.split("/")[2];
  const data = routes[userRole];

  const generateBreadCrumbList = (pathList) => {
    let possiblePaths = data;
    pathList.map((item, index) => {
      const currentBC = possiblePaths.filter(
        (i) => i.path === pathList[index]
      )[0];
      if (currentBC?.subNav) {
        pathList[index] = {
          main: currentBC.label,
          sub: currentBC.subNav.filter((i) => i.path === "")[0].label,
          link: currentBC.path,
        };
        possiblePaths = currentBC.subNav;
      } else {
        if (item === "[id]") {
          pathList[index] = "Detail";
        } else {
          if (index !== 0) {
            pathList[index - 1] = pathList[index - 1].main;
          }
          pathList[index] = currentBC.label;
        }
      }
    });
    return pathList;
  };

  const extraBreadcrumbItems = () => {
    if (remainingPath.length === 0) {
      return <Breadcrumb.Item key="root">Overview</Breadcrumb.Item>;
    } else {
      const translatedBCList = generateBreadCrumbList(remainingPath);
      return translatedBCList.map((item, index) => {
        if (typeof item === "object" && index === translatedBCList.length - 1) {
          return (
            <Fragment key={item.main}>
              <Breadcrumb.Item>{item.main}</Breadcrumb.Item>
              <Breadcrumb.Item>{item.sub}</Breadcrumb.Item>
            </Fragment>
          );
        } else {
          if (typeof item === "object") {
            return (
              <Fragment key={item.main}>
                <Breadcrumb.Item>{item.main}</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link href={root + "/" + item.link}>{item.sub}</Link>
                </Breadcrumb.Item>
              </Fragment>
            );
          } else {
            return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
          }
        }
      });
    }
  };

  const breadcrumbItems = [
    <Breadcrumb.Item key="CMS System">
      <Link href={root}>{`CMS ${userRole.toUpperCase()} SYSTEM`}</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems());

  return (
    <Breadcrumb key={root} style={{ margin: "0 16px", padding: 16 }}>
      {breadcrumbItems}
    </Breadcrumb>
  );
}
