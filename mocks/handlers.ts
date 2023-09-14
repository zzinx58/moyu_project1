import { rest } from 'msw';
import { fakerZH_CN as faker } from '@faker-js/faker';

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

enum Boolean {
  true,
  false,
}

export const handlers = [
  rest.get('/users_list', (req, res, ctx) => {
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
              phone: phone.number('+86 153 #### ####'),
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
              download_channel: helpers.arrayElement(['扫码', '链接', '市场']),
            };
          },
          { count: 50 }
        )
      )
    );
  }),
  rest.get('/test1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
        message: 'Success!!',
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      })
    );
  }),
  rest.get('/user_detail/:userId', (req, res, ctx) => {
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
          '魔域魔方',
          '魔魔魔方',
          '域域魔方',
          '域魔魔方',
        ]),
        squad_name: helpers.arrayElement([
          '魔域梦之队',
          '魔魔梦之队',
          '域域梦之队',
        ]),
        phone: phone.number('+86 153 #### ####'),
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
        download_channel: helpers.arrayElement(['扫码', '用户推荐']),
        login_method: helpers.arrayElement(['微信', 'QQ', '小程序']),
        wca_authentication: null,
        online_time_count: number.int(),
        last_login_time: date.recent({ days: 3 }),
        last_logout_time: date.recent({ days: 3 }),
        device_agent: helpers.arrayElement(['ios', 'android', 'web']),
        device_type: helpers.arrayElement([
          'ipad',
          'iphone',
          'android-pad',
          'android-phone',
          'pc',
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
  rest.get('/user_related_data/:userId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        timed_race_data: {
          best_duration: number.int({ min: 4000, max: 60000 }),
          completion_rate:
            number.float({ min: 0, max: 100, precision: 0.01 }) + '%',
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
            '魔域梦之队',
            '魔魔梦之队',
            '域域梦之队',
          ]),
          squad_level: number.int({ min: 1, max: 10 }),
          squad_members_count: number.int({ min: 1, max: 20 }),
          squad_max_merbers: 20,
          self_title_in_team: helpers.arrayElement(['队员', '队长', '教练']),
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
          p_name: helpers.arrayElement(['三阶', '四阶', '智能三阶']),
          rank: number.int({ min: 1, max: 30 }),
          best_duration: number.int({ min: 4000, max: 60000 }),
          avg_duration: number.int({ min: 4000, max: 60000 }),
          rounds_duration_detail: [
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
            number.int({ min: 4000, max: 60000 }),
          ].join(','),
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
          phone: phone.number('+86 153 #### ####'),
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
