export const api_map = {
  formal: {
    baseurl:
      "http://nlb-ay3ua339m68ierzcx7.cn-guangzhou.nlb.aliyuncs.com:4000/api",
    users: {
      // user_detail: token, {user_id}.
      user_detail: "/dashboard/users/",
      // user_filter_by: token, q_phone, q_user_id, q_size, q_current_page.
      user_filter_by: "/dashboard/users/list",
      // list: token, q_page, q_size.
      list: "/dashboard/users/list",
    },
    admin: {
      // signup: token, username, password.
      signup: "/admins",
      // signin: username, password
      signin: "/login",
    },
  },
  dev: {
    baseurl: "https://api.yicloud.vip/api",
    users: {
      // user_detail: token, {user_id}.
      user_detail: "/dashboard/users/",
      // user_filter_by: token, q_phone, q_user_id, q_size, q_current_page.
      user_filter_by: "/dashboard/users/list",
      // list: token, q_page, q_size.
      list: "/dashboard/users/list",
    },
    admin: {
      // signup: token, username, password.
      signup: "/admins",
      // signin: username, password
      signin: "/admins/login",
    },
  },
};
