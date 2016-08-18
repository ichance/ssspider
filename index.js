#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://lanterncn.org/free/";
var args = process.argv.splice(2);

if (args[0] == "all") {
    console.log("功能暂未开发~");
} else if (args[0] == "-h") {
    help();
    return false;
} else if (args[0] == "vpn") {
    getVPN(url);
} else {
    getSS(url);
}

/**
 * 帮助提示
 * @return {[type]} [description]
 */
function help() {
    console.log("使用方法：\n\t当个文件：./flush.js filename\n\t指定目录：./flush.js -r dirname");
}

function getSite(msg, callback) {
	console.log("\n"+msg+"：\n");
    //采用http模块向服务器发起一次get请求      
    http.get(x, function(res) {
        var html = '';
        res.setEncoding('utf-8'); //防止中文乱码

        //监听data事件，每次取一块数据
        res.on('data', function(chunk) {
            html += chunk;
        });

        res.on('end', function() {
            var $ = cheerio.load(html);

            callback($);
        });

    }).on('error', function(err) {
        console.log(err);
    });
}

/**
 * 获取Shadowsocks列表
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function getSS(x) {
	getSite("下面是最新的免费 shadowsocks 服务器列表", function($) {
		$('.mibiao .boxbody').eq(0).find("a").each(function(index, item) {
	        var x = $(this).attr("href");

	        if(typeof x != "undefined") {
	        	echoServer(url + x);
	        }
	    });
	});
}

/**
 * 获取VPN列表
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function getVPN(x) {
	getSite("下面是最新的免费 VPN 服务器列表", function($) {
		$('.mibiao .boxbody').eq(1).find("a").each(function(index, item) {
	        var x = $(this).attr("href");

	        if(typeof x != "undefined") {
	        	echoServer(url + x);
	        }
	    });
	});
}

/**
 * 输出单条
 * @return {[type]} [description]
 */
function echoServer(site) {
	http.get(site, function(res) {
        var html = '';
        res.setEncoding('utf-8'); //防止中文乱码

        //监听data事件，每次取一块数据
        res.on('data', function(chunk) {
            html += chunk;
        });

        res.on('end', function() {
            var $ = cheerio.load(html);

            var domain = $(".domain").text();
            var userInfo = $('.domain_box table tr').eq(2).find("td").eq(1).text();
            if(domain != "本站免费试用") {
            	console.log("\t"+domain + "\t\t" + userInfo);
            }
        });

    }).on('error', function(err) {
        console.log(err);
    });
}