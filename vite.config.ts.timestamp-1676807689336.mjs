// vite.config.ts
import { defineConfig } from "file:///Users/zionchen/Main/h/zope/node_modules/.pnpm/vitest@0.28.5_@vitest+ui@0.28.5/node_modules/vitest/dist/config.js";
import AutoImport from "file:///Users/zionchen/Main/h/zope/node_modules/.pnpm/unplugin-auto-import@0.14.3/node_modules/unplugin-auto-import/dist/vite.js";
import Dts from "file:///Users/zionchen/Main/h/zope/node_modules/.pnpm/vite-plugin-dts@2.0.0-beta.0_rmcmjwf473jv2nzaie62h4xt54/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index"
    }
  },
  plugins: [
    AutoImport({
      dts: "./src/auto-imports.generated.d.ts",
      imports: [
        "vitest",
        {
          superenum: ["Enum"]
        }
      ]
    }),
    Dts()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemlvbmNoZW4vTWFpbi9oL3pvcGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96aW9uY2hlbi9NYWluL2gvem9wZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvemlvbmNoZW4vTWFpbi9oL3pvcGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiXG5pbXBvcnQgRHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIlxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRidWlsZDoge1xuXHRcdGxpYjoge1xuXHRcdFx0ZW50cnk6IFwiLi9zcmMvaW5kZXgudHNcIixcblx0XHRcdGZvcm1hdHM6IFtcImVzXCIsIFwiY2pzXCJdLFxuXHRcdFx0ZmlsZU5hbWU6IFwiaW5kZXhcIixcblx0XHR9LFxuXHR9LFxuXHRwbHVnaW5zOiBbXG5cdFx0QXV0b0ltcG9ydCh7XG5cdFx0XHRkdHM6IFwiLi9zcmMvYXV0by1pbXBvcnRzLmdlbmVyYXRlZC5kLnRzXCIsXG5cdFx0XHRpbXBvcnRzOiBbXG5cdFx0XHRcdFwidml0ZXN0XCIsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdXBlcmVudW06IFtcIkVudW1cIl0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0pLFxuXHRcdER0cygpLFxuXHRdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVEsU0FBUyxvQkFBb0I7QUFDaFMsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxTQUFTO0FBRWhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLE9BQU87QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNKLE9BQU87QUFBQSxNQUNQLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVO0FBQUEsSUFDWDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLFdBQVc7QUFBQSxNQUNWLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0MsV0FBVyxDQUFDLE1BQU07QUFBQSxRQUNuQjtBQUFBLE1BQ0Q7QUFBQSxJQUNELENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxFQUNMO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
