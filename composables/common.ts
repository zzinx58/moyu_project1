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
