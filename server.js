import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import mime from "mime";
import { traverseDirectory } from "./each.js"

const server = new http.Server();

const cwd = process.cwd();
server.addListener("request", (req, res) => {
    const { pathname, searchParams } = new url.URL(req.url, "http://127.0.0.1:8080");
    if (pathname === "/each") {     //获取文件列表
        console.log("接受请求")
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(traverseDirectory(cwd)));
    } else if (pathname === "/read") {   //读取文件内容
        const posixPath = searchParams.get("address");
        // console.log(posixPath);
        const targetFilePath = posixPath.split(path.sep).join('/');
        // console.log(targetFilePath);
        if (isFile(targetFilePath)) {
            const content = fs.readFileSync(targetFilePath);
            const contentType = mime.getType(targetFilePath);
            
            res.setHeader("content-type", contentType.startsWith('text')
                ? `${contentType};charset=utf-8`
                : contentType);
            res.end(content);
            // fs.createReadStream(targetFilePath).pipe(res);
        } else {
            // res.setHeader("Content-Type", "application/json")
            res.end("当前文件无法读取");
        }

    } else {
        const indexPagePath = path.resolve("./index.html");
        res.setHeader("Content-Type", "text/html;charset=utf-8")
        fs.createReadStream(indexPagePath).pipe(res);
    }
    if (pathname === "/icons") {
        const targetFilePath = path.join(cwd, pathname);
        
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(iconDirectory(targetFilePath)));
        // if (isFile(targetFilePath)) {
        //     const content = fs.readFileSync(targetFilePath);
        //     const contentType = mime.getType(targetFilePath);
        //     res.setHeader("content-type", contentType.startsWith('text')
        //         ? `${contentType};charset=utf-8`
        //         : contentType);
        //     console.log(content);
        //     res.end(content);
        //     // fs.createReadStream(targetFilePath).pipe(res);
        // } else {
        //     // res.setHeader("Content-Type", "application/json")
        //     res.end("当前文件无法读取");
        // }
    }
})

function isFile(targetFilePath) {
    return fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).isFile()
}

function iconDirectory(dirPath, tree = []) {
    const dirinfo = fs.readdirSync(dirPath);
    console.log(dirinfo);
    dirinfo.forEach((filename) => {
        const fullPath = path.join(dirPath, filename);
        if (fs.statSync(path.join(dirPath, filename)).isDirectory()) {
            tree.push({
                name: filename,
                children: iconDirectory(fullPath)
            })
        }
        if (fs.statSync(path.join(dirPath, filename)).isFile()) {
            const content = fs.readFileSync(path.join(dirPath, filename));
            console.log(content)
            tree.push({
                name: filename,
                svgText:content,
            })
        }

    })
    return tree;
}


server.listen(8080);