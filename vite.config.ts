import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // resolve: {
  //   alias: {  // 这里就是需要配置resolve里的别名
  //     "@": path.join(__dirname, "./src"), // path记得引入
  //     // 'vue': 'vue/dist/vue.esm-bundler.js' // 定义vue的别名，如果使用其他的插件，可能会用到别名
  //   },
  // },
});
