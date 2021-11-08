import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { routeConstants } from "../constant";
import Link from "next/link";
import { Fragment } from "react";

export default function CMSBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);
  const root = "/" + paths.slice(0, 2).join("/");
  const remainingPath = paths.slice(2);

  const userRole = path.split("/")[2];
  const mainTabRoutes = routeConstants[userRole].mainTab;
  const { breadcrumbNameMap } = routeConstants[userRole];

  const extraBreadcrumbItems =
    remainingPath.length === 0 ? (
      <Breadcrumb.Item key="root">Overview</Breadcrumb.Item>
    ) : (
      remainingPath.map((_, index) => {
        const url = `/${remainingPath.slice(0, index + 1).join("/")}`;
        const mainTab = index === 0 ? remainingPath[0] : null;
        return (
          <Fragment key = {index}>
            {mainTab && mainTabRoutes[mainTab] ? (
              <Breadcrumb.Item key={index}>
                {mainTabRoutes[mainTab]}
              </Breadcrumb.Item>
            ) : (
              <></>
            )}
            {mainTab === "message" ? (
              <></>
            ) : index === remainingPath.length - 1 ? (
              <Breadcrumb.Item key={index}>
                {breadcrumbNameMap[url]}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={index}>
                <Link href={root + url}>{breadcrumbNameMap[url]}</Link>
              </Breadcrumb.Item>
            )}
          </Fragment>
        );
      })
    );

  const breadcrumbItems = [
    <Breadcrumb.Item key="CMS System">
      <Link href={root}>{`CMS ${userRole.toUpperCase()} SYSTEM`}</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <Breadcrumb key = {root} style={{ margin: "0 16px", padding: 16 }}>
      {breadcrumbItems}
    </Breadcrumb>
  );
}
