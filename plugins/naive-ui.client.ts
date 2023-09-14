export default defineNuxtPlugin(async () => {
  const meta = document.createElement('meta');
  meta.name = 'naive-ui-style';
  document.head.appendChild(meta);
  // useHead({
  //   meta: [{ name: 'naive-ui-style' }],
  // });
});
