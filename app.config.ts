export default defineAppConfig({
  ui: {
    primary: '#ff8f6b',
    orange: '#ff8f6b',
    button: {
      // default: {
      //   color: 'orange',
      // },
      default: {
        color: '#ff8f6b',
      },
    },
    notifications: {
      position: 'top-0 left-0',
    },
    notification: {
      default: {
        color: 'orange',
      },
      progress: {
        base: 'absolute bottom-0 end-0 start-0 h-1',
        background: 'bg-{orange}-500 dark:bg-{color}-400 bg-#ff8f6b',
      },
    },
  },
});
// "default": {
//   "color": "primary",
//   "icon": null,
//   "closeButton": {
//     "icon": "i-heroicons-x-mark-20-solid",
//     "color": "gray",
//     "variant": "link",
//     "padded": false
//   },
//   "actionButton": {
//     "size": "xs",
//     "color": "white"
//   }
// }
