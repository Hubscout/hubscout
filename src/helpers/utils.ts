import { v4 } from "uuid";

export const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    const id = v4();
    localStorage.setItem("userId", id);
    userId = id;
  }
  return userId;
};
