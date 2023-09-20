import { rest } from "msw";
import { fakerZH_CN as faker } from "@faker-js/faker";

const ProvinceData = [
  {
    name: "云南省",
    code: 530000,
    value: 17881.12,
  },
  {
    name: "黑龙江省",
    code: 230000,
    value: 16361.62,
  },
  {
    name: "贵州省",
    code: 520000,
    value: 14806.45,
  },
  {
    name: "北京市",
    code: 110000,
    value: 30319.98,
  },
  {
    name: "河北省",
    code: 130000,
    value: 36010.27,
  },
  {
    name: "山西省",
    code: 140000,
    value: 16818.11,
  },
  {
    name: "吉林省",
    code: 220000,
    value: 15074,
  },
  {
    name: "宁夏回族自治区",
    code: 640000,
    value: 3705.18,
  },
  {
    name: "辽宁省",
    code: 210000,
    value: 25315.35,
  },
  {
    name: "海南省",
    code: 460000,
    value: 4832.05,
  },
  {
    name: "内蒙古自治区",
    code: 150000,
    value: 17289.22,
  },
  {
    name: "天津市",
    code: 120000,
    value: 18809.64,
  },
  {
    name: "新疆维吾尔自治区",
    code: 650000,
    value: 12199.08,
  },
  {
    name: "上海市",
    code: 310000,
    value: 32679.87,
  },
  {
    name: "陕西省",
    code: 610000,
    value: 24438.32,
  },
  {
    name: "甘肃省",
    code: 620000,
    value: 8246.07,
  },
  {
    name: "安徽省",
    code: 340000,
    value: 30006.82,
  },
  {
    name: "香港特别行政区",
    code: 810000,
    value: 0,
  },
  {
    name: "广东省",
    code: 440000,
    value: 97277.77,
  },
  {
    name: "河南省",
    code: 410000,
    value: 48055.86,
  },
  {
    name: "湖南省",
    code: 430000,
    value: 36425.78,
  },
  {
    name: "江西省",
    code: 360000,
    value: 21984.78,
  },
  {
    name: "四川省",
    code: 510000,
    value: 40678.13,
  },
  {
    name: "广西壮族自治区",
    code: 450000,
    value: 20353.51,
  },
  {
    name: "江苏省",
    code: 320000,
    value: 92595.4,
  },
  {
    name: "澳门特别行政区",
    code: 820000,
    value: null,
  },
  {
    name: "浙江省",
    code: 330000,
    value: 56197.15,
  },
  {
    name: "山东省",
    code: 370000,
    value: 76469.67,
  },
  {
    name: "青海省",
    code: 630000,
    value: 2865.23,
  },
  {
    name: "重庆市",
    code: 500000,
    value: 20363.19,
  },
  {
    name: "福建省",
    code: 350000,
    value: 35804.04,
  },
  {
    name: "湖北省",
    code: 420000,
    value: 39366.55,
  },
  {
    name: "西藏自治区",
    code: 540000,
    value: 1477.63,
  },
  {
    name: "台湾省",
    code: 710000,
    value: null,
  },
];

const {
  person,
  phone,
  number,
  date,
  string,
  seed,
  setDefaultRefDate,
  location,
  helpers,
  lorem,
  finance,
} = faker;

const dateSequence1 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const dateSequence2 = structuredClone(dateSequence1);

const datetimeSequence1 = Array.from({ length: 12 }, (item, index) => {
  return `${(item = index * 2)}`;
});
// const datetimeSequence2 = structuredClone(datetimeSequence1);

const dateNumSequence1 = Array.from({ length: 31 }, (item, index) => {
  return `${(item = index + 1)}`;
});
const dateNumSequence2 = Array.from({ length: 31 }, (item, index) => {
  return `${(item = index + 1)}`;
});
const dateNumSequence3 = Array.from({ length: 31 }, (item, index) => {
  return `${(item = index + 1)}`;
});

export const handlers = [
  rest.get("/getPart1Choropleth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        ...ProvinceData.map((item) => {
          return {
            ...item,
            value: string.numeric(5),
          };
        }),
      ])
    );
  }),
  rest.get("/getPart2MonthlyOnlineData", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        [
          helpers.multiple(
            () => {
              const dateNumTemp = dateNumSequence3.shift();
              return {
                date: `${
                  dateNumTemp?.length === 1
                    ? `0${dateNumTemp}`
                    : `${dateNumTemp}`
                }`,
                type: "上上月",
                value: +string.numeric(4),
              };
            },
            { count: 31 }
          ),
          helpers.multiple(
            () => {
              const dateNumTemp = dateNumSequence2.shift();
              return {
                date: `${
                  dateNumTemp?.length === 1
                    ? `0${dateNumTemp}`
                    : `${dateNumTemp}`
                }`,
                type: "上月",
                value: +string.numeric(4),
              };
            },
            { count: 31 }
          ),
          helpers.multiple(
            () => {
              const dateNumTemp = dateNumSequence1.shift();
              return {
                date: `${
                  dateNumTemp?.length === 1
                    ? `0${dateNumTemp}`
                    : `${dateNumTemp}`
                }`,
                type: "本月",
                value: +string.numeric(4),
              };
            },
            { count: 31 }
          ),
        ].flat()
      )
    );
  }),
  rest.get("/index_preview_part1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total_registered: number.int(21265661),
        new_registered_per_day: number.int(1000),
        avg_online_per_day: number.int(30000),
        total_activated_rubik_cubes: number.int(10000000),
        total_existed_team: number.int(1000),
        new_team_per_day: string.numeric(3),
        total_competitions: string.numeric(8),
        total_competition_players: string.numeric(5),
      })
    );
  }),
  rest.get("/index_preview_part_column", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        helpers.multiple(
          () => {
            const dateTemp = dateSequence2.shift();
            return [
              {
                date: dateTemp,
                type: "上周",
                value: +string.numeric(4),
              },
            ];
          },
          { count: 7 }
        ),
        helpers.multiple(
          () => {
            const dateTemp = dateSequence1.shift();
            return [
              {
                date: dateTemp,
                type: "本周",
                value: +string.numeric(4),
              },
            ];
          },
          { count: 7 }
        ),
      ])
    );
  }),
  rest.get("/index_preview_part_line", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        helpers.multiple(
          () => {
            const datetimeTemp = datetimeSequence1.shift();
            return {
              datetime: `${
                datetimeTemp?.length === 2
                  ? `${datetimeTemp}`
                  : `0${datetimeTemp}`
              }:00`,
              value: +string.numeric(5),
            };
          },
          { count: 12 }
        )
      )
    );
  }),
  rest.get("/users_list", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        helpers.multiple(
          () => {
            return {
              id: +string.numeric(5),
              nick_name: person.fullName(),
              location_city: location.country() + location.city(),
              register_time: date.recent({ days: 10 }),
              phone: phone.number("+86 153 #### ####"),
              online_status: helpers.arrayElement([0, 1]),
              identity_info: {
                status: number.int({ min: 0, max: 1 }),
                name: person.fullName(),
                identity_number: string.alphanumeric(18),
                location:
                  location.country() +
                  location.city() +
                  location.streetAddress(),
              },
              points_count: +string.numeric(3),
              vocher_count: +string.numeric(2),
              login_type: helpers.arrayElement([
                // { label: '微信', value: 1 },
                // { label: 'QQ', value: 2 },
                // { label: '手机', value: 3 },
                // { label: '邮箱', value: 4 },
                1, 2, 3, 4,
              ]),
              // login_type: helpers.arrayElement([1, 2, 3, 4]),
              // login_type: helpers.arrayElement(['微信', 'QQ', '手机', '邮箱']),
              download_channel: helpers.arrayElement(["扫码", "链接", "市场"]),
            };
          },
          { count: 50 }
        )
      )
    );
  }),
  rest.get("/test1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
        message: "Success!!",
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      })
    );
  }),
  rest.get("/user_detail/:userId", (req, res, ctx) => {
    // rest.get('/users/:userId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        gender: person.gender(),
        sex: person.sex(),
        id: number.int(),
        nick_name: person.fullName({}),
        wcu_id: number.int(),
        register_time: date.recent({ days: 5 }),
        location:
          location.country() + location.city() + location.streetAddress(),
        classroom: helpers.arrayElement([
          "魔域魔方",
          "魔魔魔方",
          "域域魔方",
          "域魔魔方",
        ]),
        squad_name: helpers.arrayElement([
          "魔域梦之队",
          "魔魔梦之队",
          "域域梦之队",
        ]),
        phone: phone.number("+86 153 #### ####"),
        identity_info: {
          status: number.int({ min: 0, max: 1 }),
          name: person.fullName(),
          identity_number: string.alphanumeric(18),
          phone: string.numeric(11),
          location:
            location.country() + location.city() + location.streetAddress(),
        },
        points_count: number.int({ max: 1000 }),
        voucher_count: number.int({ max: 100 }),
        binded_qq: string.numeric(11),
        binded_wechat: string.numeric(11),
        download_channel: helpers.arrayElement(["扫码", "用户推荐"]),
        login_method: helpers.arrayElement(["微信", "QQ", "小程序"]),
        wca_authentication: null,
        online_time_count: number.int(),
        last_login_time: date.recent({ days: 3 }),
        last_logout_time: date.recent({ days: 3 }),
        device_agent: helpers.arrayElement(["ios", "android", "web"]),
        device_type: helpers.arrayElement([
          "ipad",
          "iphone",
          "android-pad",
          "android-phone",
          "pc",
        ]),
        cpu_model: string.alphanumeric(3),
        devicePixelRatio: `${number.int({ min: 1000, max: 5000 })}x${number.int(
          { min: 1000, max: 5000 }
        )}`,
        binded_rubik_cube_model: string.alphanumeric(6),
        mac_address: string.alphanumeric(17),
        binding_time: date.recent({ days: 10 }),
        unbinding_time: date.recent({ days: 5 }),
      })
    );
  }),
  //
  rest.get("/user_related_data/:userId", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        timed_race_data: {
          best_duration: number.int({ min: 4000, max: 60000 }),
          completion_rate:
            number.float({ min: 0, max: 100, precision: 0.01 }) + "%",
          current_ranking: number.int({ min: 1, max: 100 }),
          highest_ranking: number.int({ min: 1, max: 100 }),
          best_ao5_duration: number.int({ min: 4000, max: 60000 }),
          best_ao12_duration: number.int({ min: 4000, max: 60000 }),
          best_ao100_duration: number.int({ min: 4000, max: 60000 }),
          completions_count: number.int({ min: 0, max: 10000 }),
        },
        t_rank_data: {
          monthly_highest1_rank: number.int({ min: 0, max: 3 }),
          monthly_rank: number.int({ min: 0, max: 3 }),
          monthly_win_total: number.int({ min: 0, max: 2000 }),
          wins_total: number.int({ min: 0, max: 2000 }),
          lose_total: number.int({ min: 0, max: 2000 }),
          monthly_lose_total: number.int({ min: 0, max: 2000 }),
          draw_total: number.int({ min: 0, max: 2000 }),
          monthly_draw_total: number.int({ min: 0, max: 2000 }),
          highest_winning_streak: number.int({ min: 0, max: 200 }),
          monthly_winning_streak: number.int({ min: 0, max: 2000 }),
        },
        multi_race_speed_data: {
          participate_count: number.int({ min: 0, max: 200 }),
          completions_count: number.int({ min: 0, max: 200 }),
          best_ranking: number.int({ min: 0, max: 200 }),
          best_ao5: number.int({ min: 4000, max: 60000 }),
        },
        squad_info: {
          squad_id: number.int({ min: 0, max: 2000 }),
          squad_name: helpers.arrayElement([
            "魔域梦之队",
            "魔魔梦之队",
            "域域梦之队",
          ]),
          squad_level: number.int({ min: 1, max: 10 }),
          squad_members_count: number.int({ min: 1, max: 20 }),
          squad_max_merbers: 20,
          self_title_in_team: helpers.arrayElement(["队员", "队长", "教练"]),
          squad_region: location.country() + location.city(),
          squad_combat_value: number.int({ min: 1000, max: 20000 }),
          squad_combat_value_rank: number.int({ min: 1, max: 200 }),
          self_combat_value: number.int({ min: 1000, max: 20000 }),
          self_combat_value_rank: number.int({ min: 1, max: 200 }),
          squad_join_time: date.recent({ days: 1000 }),
          squad_leaving_time: date.recent({ days: 1000 }),
        },
        pratice_task_info: {
          achievements_count: number.int({ min: 1, max: 20 }),
          task_completions_count: number.int({ min: 1, max: 20 }),
          practice_completions_count: number.int({ min: 0, max: 1 }),
          cfop_formula_id: string.alphanumeric(10),
        },
        wcu_t_data: {
          name: string.alphanumeric(10),
          mode: number.int({ min: 0, max: 1 }),
          p_name: helpers.arrayElement(["三阶", "四阶", "智能三阶"]),
          rank: number.int({ min: 1, max: 30 }),
          best_duration: number.int({ min: 4000, max: 60000 }),
          avg_duration: number.int({ min: 4000, max: 60000 }),
          rounds_duration_detail: [
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
          ].join(","),
          update_date: date.recent({ days: 5 }),
        },
        wca_t_data: {},
        account_info: {
          points_count: number.int({ min: 4000, max: 60000 }),
          vocher_count: number.int({ min: 4, max: 60 }),
          award_record_id: string.alpha(7),
          //拥有物品id
        },
        order_info: {
          receiver_name: person.fullName(),
          phone: phone.number("+86 153 #### ####"),
          order_status: number.int({ min: 0, max: 3 }),
          receive_location:
            location.country() +
            location.city() +
            location.county() +
            location.street(),
        },
      })
    );
  }),
  //
];
