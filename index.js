import axios from "axios";
import hljs from "highlight.js";

var tree = document.querySelector(".tree")
function renderList(list, parent = tree) {

    let ul = document.createElement("ul");
    list.forEach(item => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        if (item.children) {
            let details = document.createElement("details");
            let summary = document.createElement("summary");
            summary.innerHTML = `${item.name}目录`;
            renderList(item.children, details);
            details.appendChild(summary);
            li.appendChild(details);
        } else {
            a.innerHTML = `${item.fullPath}`
            a.style.display = "none";
            li.innerHTML = `${item.name}`;
            li.appendChild(a);
        }
        ul.appendChild(li);
    })
    parent.appendChild(ul);
}

axios.get("/api/each")
    .then(function (res) {
        console.log(res.data);
        renderList(res.data);
        clickTree();
    })
    .catch(function (err) { })


function clickTree() {
    var treeNode = document.querySelectorAll('li');
    treeNode.forEach(node => {
        node.addEventListener('click', function (e) {
            e.stopPropagation();
            if (e.target.childNodes[1]) {
                let address = e.target.childNodes[1].innerHTML
                readText(address);
                console.log(address);
            }
        });
    });
}

function readText(address) {
    axios.get("/api/read", {
        params: {
            address: address
        }
    }).then(function (res) {
        console.log(res.data);
        var textmsg = res.data;
        var detail = document.querySelector(".detail")
        detail.innerText = textmsg;

    })
        .catch(function (err) { })
}

function getIcon() {
    axios.get("/api/icons").then(function (res) {
        console.log(res.data);
    })
        .catch(function (err) { })
}
getIcon();