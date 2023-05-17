Integrated with Vite, you can use

pnpm run vite: Launch the vite web project

pnpm run build: Package the project to Siyuan and pay attention to modifying the outPath field in the webpack.config.js file

You can use the following code to access your Vue file in index.ts
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

Note: After downloading the project, please make sure to build it first to check if it can run normally

[plugin-sample](https://github.com/siyuan-note/plugin-sample)