import fetch from "cross-fetch";

type ExpoNotification = {
  to: string[];
  badge?: number;
  body: string;
  title: string;
  sound?: string;
};

export const sendExpoMessage = async (expoNotification: ExpoNotification) => {
  const noTokens = expoNotification.to.length === 0;
  if (noTokens) return;

  const result = await fetch("https://exp.host/--/api/v2/push/send", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(expoNotification),
  });

  return result;
};
