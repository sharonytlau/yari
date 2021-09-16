import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

// This is a bit of a necessary hack!
// The only reason this list is needed is because of the PageNotFound rendering.
// If someone requests `https://domain/some-random-word` what will happen is that
// Lambda@Edge will send the `build/en-us/_spas/404.html` rendered page. That
// rendered page has all the React stuff like routing.
// The <App/> component can know what it needs to render but what's problematic
// is that all and any other app will think that the locale is `some-random-word`
// just because it's the first portion of the URL.
// So, for example, the top navbar will think it can use the `useLocale()` hook
// and get the current locale from the react-router context. Now the navbar menu
// items, for example, will think the locale is `some-random-word` and make links
// like `/some-random-word/docs/Web`.
import { VALID_LOCALES } from "./constants";
import { useUserData } from "./user-context";

interface UserSettings {
  csrfmiddlewaretoken: string;
}

export function useLocale() {
  const { locale } = useParams();
  return locale && VALID_LOCALES.has(locale) ? locale : "en-US";
}

export function useCSRFMiddlewareToken() {
  const userData = useUserData();
  const userSettingsAPIURL = React.useMemo(() => {
    return userData && userData.isAuthenticated ? "/api/v1/settings" : null;
  }, [userData]);
  const { data, error } = useSWR<UserSettings>(
    userSettingsAPIURL,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.status} on ${url}`);
      }
      return await response.json();
    }
  );

  if (!error) {
    return data?.csrfmiddlewaretoken;
  }
}
