// Administrator, super administrator, sub account owner, main account owner
export const useManagerStore = definePiniaStore('platform-manager', {
  state: () => {
    return {
      nickName: '请登录..',
      email: '',
      token: '',
      avatarSrc: '',
    };
  },
  actions: {
    async login(loginFormData: { accountName: string; password: string }) {
      const { data: managerData } = await useFetch('/api/manager/login', {
        // const { data: managerData } = useFetch('/api/manager/login', {
        // method: 'POST',
        body: {
          data: loginFormData,
        },
      });
      // console.log('manager.ts:', managerData.value);
      // if (managerData.value) {
      //   //替换 State
      //   this.$patch(managerData.value);
      // }
    },
  },
});

// export const useTestStore = defineStore('platform-manager-test', {
//   state: () => {
//     return {
//       count: 0,
//     };
//   },
// });
