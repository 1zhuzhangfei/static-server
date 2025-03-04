import fs from "fs";
import path from "path";

let id = 0;
export function traverseDirectory(dirPath, tree = []) {
    const dirinfo = fs.readdirSync(dirPath);
    // console.log(dirinfo);
    
    dirinfo.forEach((filename) => {
        const fullPath = path.join(dirPath, filename);
        if (fs.statSync(path.join(dirPath, filename)).isDirectory()) {
            id++;
            tree.push({
                id:id,
                name: filename,
                fullPath,
                visible:false,
                children: traverseDirectory(fullPath)
            })
            
        }
        if (fs.statSync(path.join(dirPath, filename)).isFile()) {
            id++;
            tree.push({
                id:id,
                name: filename,
                fullPath,
            })
            
        }
        

    })
    return tree;
}




