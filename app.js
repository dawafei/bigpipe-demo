let express = require('express');
let path = require('path');
let http = require('http');
let ejs = require('ejs');
let fs = require('fs');
let app = express();

let content = {
    'title': '周梦赤子心',
    'content': 'GALA---追梦赤子心充满鲜花的世界到底在哪里向前跑迎着冷眼和嘲笑如果它真存在那么我一定会去生命的广阔不历经磨难怎能感到我想在那高的山峰矗立命运它无法让我们跪地求饶不在乎它是不是悬崖峭壁继续跑带着赤子的骄傲生命的闪耀不坚持到底怎能看到与其苟延残喘不如纵情燃烧吧用力活着用力爱哪怕肝脑涂地为了心中的美好不求任何人满意只要对得起自己关于理想我从来没选择放弃即使在灰头土脸的日子里也许我没有天分但我有梦的天真我将会去证明用我的一生也许我手比脚笨但我愿不停探寻付出所有的青春不留遗憾向前跑迎着冷眼和嘲笑生命的广阔不历经磨难怎能感到命运它无法让我们跪地求饶就算鲜血洒满了怀抱继续跑带着赤子的骄傲生命的闪耀不坚持到底怎能看到与其苟延残喘不如纵情燃烧吧有一天会再发芽未来迷人绚烂总在向我召唤哪怕只有痛苦作伴也要勇往直前我想在那里最蓝的大海扬帆绝不管自己能不能回还失败后郁郁寡欢那是懦夫的表现只要一息尚存请握紧双拳在天色破晓之前我们要更加勇敢等待日出时最耀眼的瞬间不妥协直到变老'
};
app.use(express.static(path.join(__dirname, 'static')));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('prot', 3000);

app.get('/', function (req, res) {
    res.render('index', {
        'title': "bigpipe",
        'header': '我是消息头'
    }, function (err, str) {
        // ⚠️此处不能用res.send, 因为res.send()包含了res.end()和res.write()
        res.write(str);
    })
    let Pagelets_list = {
        pagelet1: false,
        pagelet2: false
    }

    function isEnd(Pagelets) {
        Pagelets_list[Pagelets] = true;
        for (x in Pagelets_list) {
            if (!Pagelets_list[x]) {
                return;
            }
        }
        res.end();
        return;
    }
    // 判断所有的页面片段是否输出完毕，如果完毕结束本次链接 
    function getTpl(path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, (err, data) => {
                try {
                    resolve(data)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    function Pagelets(Pagelets, path) {
        getTpl(path).then((data) => {
            let tpl = ejs.render(data.toString(), content)
            res.write(`<script>bigpipe.set("${Pagelets}",${JSON.stringify(tpl)});</script>`);
            isEnd(Pagelets)
        })
    }

    setTimeout(function (res) {
        Pagelets("pagelet1", path.resolve('./views/sidebar.html'));
    }, 1000);
    setTimeout(function (res) {
        Pagelets("pagelet2", path.resolve('./views/content.html'));
    }, 2000);
});




http.createServer(app).listen(app.get('prot'), function () {
    console.log('端口:' + app.get('prot'));
});