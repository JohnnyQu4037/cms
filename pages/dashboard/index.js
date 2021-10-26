import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  // if the cms_token doesn't exist, return to the login page.
  // otherwise lead user to pages based on their role
  const router = useRouter();
  useEffect(() => {
    const cmsToken = JSON.parse(localStorage.getItem("cms_token"))
      ? JSON.parse(localStorage.getItem("cms_token"))
      : null;
    if (!cmsToken) {
      router.push("/");
      return;
    }
    if (!!cmsToken.role) {
      router.push(`/dashboard/${cmsToken.role}`);
    }
  }, []);

  return null;
}
