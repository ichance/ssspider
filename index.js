#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://lanterncn.org/free/";

/**
 * [startRequest description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function startRequest(x) {
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

            $('.mibiao .boxbody').eq(0).find("a").each(function(index, item) {
		        var x = $(this).attr("href");

		        if(typeof x != "undefined") {
		        	echoServer(url + x);
		        }
		    });

        });

    }).on('error', function(err) {
        console.log(err);
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
            	console.log("server:" + domain + ",   user:" + userInfo);
            }
        });

    }).on('error', function(err) {
        console.log(err);
    });
}

startRequest(url); //主程序开始运行