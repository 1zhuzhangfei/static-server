import { defineConfig } from "vite";
import path from "path";
export default defineConfig(
    {
        server: {
            port: 8081,
            open: true,
            //跨域相关配置
            proxy: {
                //当你请求本地服务的/baz时，本地服务不会直接处理你的请求，而是转发给http://127.0.0.1:8080
                //服务器之间不存在同源策略的限制 所以可以解决跨域问题
                // "/preview": "http://127.0.0.1:8080",
                "/api":{
                    target:"http://127.0.0.1:8080",
                    rewrite:(path) => path.replace(/^\/api/,"")
                }
            },

        },
        resolve: {
            alias: {
                "@": path.resolve("./src")
            }
        }
    }
);