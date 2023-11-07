// module.exports = {
//     apps: [
//       {
//         name: 'NuxtAppName',
//         port: '3000',
//         exec_mode: 'cluster',
//         instances: 'max',
//         script: './.output/server/index.mjs'
//       }
//     ]
//   }

module.exports = {
  apps: [
    {
      name: "MOYU",
      env: {
        // 环境参数，当前指定为开发环境
        NODE_ENV: "development",
        PORT: "5050",
        DEV_DATABASE_URL: "mysql://cube_dev:123456@192.168.1.25:3306/cube_dev",
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: "production", //使用production模式 pm2 start ecosystem.config.js --env production
        PORT: "5050",
        DEV_DATABASE_URL: "mysql://cube_dev:123456@127.0.0.1:3306/cube_dev",
        VITE_PROJECT_ENV: "HK_DEV",
      },
      exec_mode: "cluster",
      instances: "2", // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      // exec_mode: "fork",// 自家主机window cluster_mode 模式下启动失败
      script: ".output/server/index.mjs",
      log_date_format: "YYYY-MM-DD HH:mm:ss", // 指定日志文件的时间格式
      args: "", // 传递给脚本的参数

      watch: true, // 开启监听文件变动重启
      ignore_watch: ["node_modules", "public", "logs"], // 不用监听的文件
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: "1G",
      // error_file: './logs/app-err.log', // 错误日志文件
      // out_file: './logs/app-out.log', // 正常日志文件
      merge_logs: true, // 设置追加日志而不是新建日志
      min_uptime: "60s", // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
    },
  ],
};
