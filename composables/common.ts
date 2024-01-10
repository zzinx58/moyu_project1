import { useMessage } from "naive-ui";
import { useUserStore } from "../stores/user";

const nuxtApp = useNuxtApp();
// Could not use useRoute() here!
export const route = useState("route", () => useRoute);
// The below two ways will be undefined at first refresh.
// export const router = useState(() => nuxtApp.$router);
// export const router = useState("router", () => useRouter());
export const router = useState("router", () => useRouter);
export const naiveMessage = useState("naiveMessage", () => useMessage);
export const userStore = () => {
  const userStore = useUserStore();
  return userStore;
};
export const reAuthLogin = (currentPath: string) => {
  naiveMessage.value().info("登录信息过期，请您重新登录");
  userStore().$reset();
  navigateTo(`/login?callback=${currentPath}`);
};

import * as JSONPathPlus from "jsonpath-plus";
export const useJSONPath = JSONPathPlus.JSONPath;
import * as _ from "lodash";
export const useLodash = () => _;

export const dictionary_keyValueConvertFunc = (
  dictionary: Record<string, string>,
  value: string
) => {
  const pathToResult = `$[?(@property === "${value}" || @ === "${value}")]`;
  const itemInfos = useJSONPath<Array<any>>({
    path: pathToResult,
    json: dictionary,
    resultType: "all",
  });
  const firstItemInfo = itemInfos[0];
  // const result = [firstItemInfo.parentProperty, firstItemInfo.value];
  let result = undefined;
  if (itemInfos.length) {
    result =
      value === firstItemInfo.parentProperty
        ? firstItemInfo.value
        : firstItemInfo.parentProperty;
  }
  return result;
};
export const dictionary_ObjectKeyMappingConvertFunc = (
  dictionary: Record<string, string>,
  objItemsArr: Array<Object>
) => {
  return objItemsArr.map((objItem) => {
    const itemKVArr = Object.entries(objItem);
    const convertedKVArr = itemKVArr.map((kvItem) => {
      const [key, value] = kvItem;
      return [dictionary_keyValueConvertFunc(dictionary, key), value];
    });
    return Object.fromEntries(convertedKVArr);
  });
};
