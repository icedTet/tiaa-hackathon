import { useEffect, useState } from "react";
import { useSelf } from "../utils/hooks/useSelf";

export const PingyPage = () => {
  const user = useSelf()
  return <div>{JSON.stringify(user)}</div>;
};
export default PingyPage;
