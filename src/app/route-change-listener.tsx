"use client";

import { getUserId } from "@/helpers/utils";
import { sendEventToAmplitude } from "@/lib/amplitude";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export function RouteChangeListener() {
  const pathname = usePathname();

  const addPathChangeListener = async (pathname: any) => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      //generate a unique id for the user
      const id = v4();
      localStorage.setItem("userId", id);
      userId = id;
    }
    sendEventToAmplitude(userId, "page_view", { pathname });
  };

  const addPathLeaveListener = async (pathname: any) => {
    const userId = getUserId();
    sendEventToAmplitude(userId, "page_leave", { pathname });
  };

  useEffect(() => {
    addPathChangeListener(pathname);

    return () => {
      addPathLeaveListener(pathname);
    };
  }, [pathname]);

  return <></>;
}
