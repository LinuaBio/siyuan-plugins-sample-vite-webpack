集成了Vite，你可以使用

pnpm run vite:启动vite前端项目

pnpm run dev:打包项目到思源，注意修改webpack.config.js文件中的outPath字段

在index.ts中可以使用以下代码访问你的vue文件
```typescript
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

```javascript
// path: path.resolve(__dirname),
path: outPath,
```
注意：下载项目后请务必先build，查看是否能正常运行

[plugin-sample源地址](https://github.com/siyuan-note/plugin-sample)