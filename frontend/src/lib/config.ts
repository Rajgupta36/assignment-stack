import { useCookies } from "react-cookie";

export const COOKIE_NAME = "app_config_key";

export function useConfigKey() {
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME]);

  const key = (cookies[COOKIE_NAME] as string | undefined) ?? null;
  const hasKey = typeof key === "string" && key.length >= 100 && key.length <= 1000;

  const setKey = (value: string, days = 30) => {
    const maxAge = days * 24 * 60 * 60;
    setCookie(COOKIE_NAME, value, {
      path: "/",
      maxAge,
      sameSite: "none",
      secure: true,
    });
  };

  const clearKey = () => {
    removeCookie(COOKIE_NAME, { path: "/" });
  };

  return { key, hasKey, setKey, clearKey };
}

