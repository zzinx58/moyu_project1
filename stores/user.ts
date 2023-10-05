// Administrator, super administrator, sub account owner, main account owner
export const useUserStore = definePiniaStore("user", {
  persist: true,
  state: (): {
    [key: string]: any;
    isLogin: boolean;
    userInfo: Partial<{
      [key: string]: any;
      username: string;
      user_id: number;
      login_type: string;
      roles: string | number[];
      deleted: boolean;
      inserted_at: string;
      updated_at: string;
    }>;
    token: string;
  } => {
    return {
      isLogin: false,
      userInfo: {},
      token: "",
      // nickName: "请登录..",
      // email: "",
      // token: "",
      // avatarSrc: "",
    };
  },
  actions: {
    /* login: 
        useFetch() => return {code, error?, data?}
    */
    async login(loginFormData: {
      [key: string]: string;
      password: string;
    }): Promise<{
      ok: boolean;
      data?: any;
      code?: number;
      message?: string;
    }> {
      const {
        data: userData,
        error,
        refresh,
        pending,
        status,
      } = await useFetch<{ code: number; data: any }>(
        "/api_cors/admins/login",
        {
          method: "POST",
          body: loginFormData,
        }
      );
      if (error.value?.data) {
        return {
          ok: false,
          data: error.value.data,
          code: error.value.data.code,
          message: `${error.value.data.error}`,
        };
      }
      if (userData.value?.code && userData.value.code === 200) {
        this.token = userData.value.data.access_token;
        this.userInfo = userData.value.data.admin;
        this.isLogin = true;
        return {
          ok: true,
          code: userData.value?.code,
          data: userData.value,
          message: "登录成功",
        };
      }
      return {
        ok: false,
        code: 500,
        message: "Didn't match data and error.",
      };
    },
    //
    async logout(): Promise<{
      ok: boolean;
    }> {
      this.$reset();
      return {
        ok: true,
      };
    },
  },
});
