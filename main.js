var request = require('request');
var cfg = require('./cfg.json');
var urlencode = require('urlencode');
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var requestData = {};
var url = "http://202.114.18.218/Main.aspx";
var mailbox = cfg.mailbox;
var matchopt = /\<td\>[0-9]+\.[0-9]*.*[0-9]+\:[0-9]+\:[0-9]+\<\/td\>/g;
var numberMatch = /[0-9]+\.[0-9]*/;

function getRequestData() {
    requestData.programId = urlencode(cfg.address.programId);
    requestData.txtyq = urlencode(cfg.address.txtyq);
    requestData.Txtroom = cfg.address.Txtroom;
    requestData.other = "ImageButton1.x=41&ImageButton1.y=18&TextBox2=&TextBox3=";
}

function httprequest(url, data) {
    request({
        url: url,
        method: "POST",
        json: false,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        form: "__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwULLTE4NDE5OTM2MDEPZBYCAgMPZBYMAgEPEA8WBh4NRGF0YVRleHRGaWVsZAUM5qW85qCL5Yy65Z%2BfHg5EYXRhVmFsdWVGaWVsZAUM5qW85qCL5Yy65Z%2BfHgtfIURhdGFCb3VuZGdkEBUGBuS4nOWMugnnlZnlrabnlJ8G6KW%2F5Yy6BumfteiLkQbntKvoj5gLLeivt%2BmAieaLqS0VBgbkuJzljLoJ55WZ5a2m55SfBuilv%2BWMugbpn7Xoi5EG57Sr6I%2BYAi0xFCsDBmdnZ2dnZxYBZmQCBQ8QDxYGHwAFBualvOWPtx8BBQbmpbzlj7cfAmdkEBUUB%2BS4nDHoiI0H5LicMuiIjQfkuJwz6IiNB%2BS4nDToiI0H5LicNeiIjQfkuJw26IiNB%2BS4nDfoiI0H5LicOOiIjQzpmYTkuK3kuLvmpbwH5pWZN%2BiIjQfmlZk46IiNB%2BWNlzHoiI0H5Y2XMuiIjQfljZcz6IiNC%2BaygeiLkTEw6IiNC%2BaygeiLkTEx6IiNC%2BaygeiLkTEy6IiNC%2BaygeiLkTEz6IiNCuaygeiLkTnoiI0LLeivt%2BmAieaLqS0VFAfkuJwx6IiNB%2BS4nDLoiI0H5LicM%2BiIjQfkuJw06IiNB%2BS4nDXoiI0H5LicNuiIjQfkuJw36IiNB%2BS4nDjoiI0M6ZmE5Lit5Li75qW8B%2BaVmTfoiI0H5pWZOOiIjQfljZcx6IiNB%2BWNlzLoiI0H5Y2XM%2BiIjQvmsoHoi5ExMOiIjQvmsoHoi5ExMeiIjQvmsoHoi5ExMuiIjQvmsoHoi5ExM%2BiIjQrmsoHoi5E56IiNAi0xFCsDFGdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZGQCDw8PFgIeBFRleHQFEDIwMTgtOS0yIDc6MDI6NDhkZAIRDw8WAh8DBQUxNDMuNGRkAhMPPCsADQIADxYEHwJnHgtfIUl0ZW1Db3VudAIHZAwUKwACFggeBE5hbWUFCeaKhOihqOWAvB4KSXNSZWFkT25seWgeBFR5cGUZKVtTeXN0ZW0uRGVjaW1hbCwgbXNjb3JsaWIsIFZlcnNpb249Mi4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1iNzdhNWM1NjE5MzRlMDg5HglEYXRhRmllbGQFCeaKhOihqOWAvBYIHwUFDOaKhOihqOaXtumXtB8GaB8HGSlcU3lzdGVtLkRhdGVUaW1lLCBtc2NvcmxpYiwgVmVyc2lvbj0yLjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsIFB1YmxpY0tleVRva2VuPWI3N2E1YzU2MTkzNGUwODkfCAUM5oqE6KGo5pe26Ze0FgJmD2QWEAIBD2QWBGYPDxYCHwMFBTE0My40ZGQCAQ8PFgIfAwUQMjAxOC05LTIgNzowMjo0OGRkAgIPZBYEZg8PFgIfAwUFMTU0LjBkZAIBDw8WAh8DBRAyMDE4LTktMSA3OjAzOjI2ZGQCAw9kFgRmDw8WAh8DBQUxNjAuMWRkAgEPDxYCHwMFEjIwMTgtOC0zMSAxNjo0MjowMWRkAgQPZBYEZg8PFgIfAwUFMTYzLjlkZAIBDw8WAh8DBREyMDE4LTgtMzEgNzowMjo1MGRkAgUPZBYEZg8PFgIfAwUFMTcyLjhkZAIBDw8WAh8DBREyMDE4LTgtMzAgNzowMzo1MmRkAgYPZBYEZg8PFgIfAwUDOS43ZGQCAQ8PFgIfAwURMjAxOC04LTI5IDc6MDM6NDNkZAIHD2QWBGYPDxYCHwMFBDE4LjJkZAIBDw8WAh8DBREyMDE4LTgtMjggNzowMzoyOWRkAggPDxYCHgdWaXNpYmxlaGRkAhUPPCsADQIADxYEHwJnHwQCAWQMFCsAAxYIHwUFDOe8tOi0ueaXpeacnx8GaB8HGSsFHwgFDOe8tOi0ueaXpeacnxYIHwUFDOWunuaUtumHkeminR8GaB8HGSsEHwgFDOWunuaUtumHkeminRYIHwUFDOe8tOi0ueaYjue7hh8GaB8HGSsCHwgFDOe8tOi0ueaYjue7hhYCZg9kFgQCAQ9kFgZmDw8WAh8DBRIyMDE4LTgtMjkgMjA6NTg6NDdkZAIBDw8WAh8DBQYxMDAuMDBkZAICDw8WAh8DBUfpobnnm64655S16LS5ICDotK0o55SoKemHj%2B%2B8mjE3Mi40ICDljZXku7fvvJowLjU45YWDL%2BW6piAg6YeR6aKdOjEwMC4wMGRkAgIPDxYCHwloZGQYAwUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFDEltYWdlQnV0dG9uMQUMSW1hZ2VCdXR0b24yBQlHcmlkVmlldzEPPCsACgEIAgFkBQlHcmlkVmlldzIPPCsACgEIAgFk%2BNSqmPSzMyxdzSVDRRubNR2BhGg%3D&__EVENTVALIDATION=%2FwEWIgKKyJ7zDALorceeCQLc1sToBgL%2BzpWoBQK50MfoBgKj5aPiDQLtuMzrDQLrwqHzBQKX%2B9a3BALahLK2BQLahLa2BQLahIq2BQLahI62BQLahIK2BQLahIa2BQLahJq2BQLahN61BQL4w577DwKH0Zq2BQKH0d61BQKVrbK2BQKVrba2BQKVrYq2BQKY14SVBQKY1%2BjwDAKY1%2FzbCwKY18CmAwLr76OiDwKUlLDaCAL61dqrBgLSwpnTCALSwtXkAgLs0fbZDALs0Yq1Bf5i78jb9cU%2BJ4pvFo3uNl01cNzP&" + requestData.programId + "&" + requestData.txtyq + "&" + requestData.Txtroom + "&" + requestData.other
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = body.match(matchopt);
            var handledResult = handleResult(result);
            // console.log(handledResult);
            mailMessage(handledResult);
        }
    });
}

var handleResult = function (result) {
    let result1 = result[0].match(numberMatch);
    let result2 = result[1].match(numberMatch);
    return [result1[0], result2[0]];
}

function formatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

var mailMessage = function (handledResult) {
    let hostMail = '2122884618@qq.com';
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com', //qq
        // host: 'smtp.163.com', //163
        auth: {
            user: '2122884618@qq.com',
            //这里密码不是qq密码，是你设置的smtp密码
            pass: "ahzaacdstwglbfif"
        }
    });
    for (let i = 0; i < mailbox.length; i++) {
        var targetMail = mailbox[i];
        var mailOptions = {
            from: hostMail,
            to: targetMail,
            subject: '寝室电量情况',
            text: cfg.address.programId + cfg.address.txtyq + cfg.address.Txtroom + '电量使用情况：\n剩余电量：' + handledResult[0] + '\n' + '昨天使用电量： ' + formatFloat((handledResult[1] - handledResult[0]), 1),
        };

        console.log(mailOptions.text);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: ' + info.response);
        });
    }
}

function scheduleCronstyle() {
    var rule = new schedule.RecurrenceRule();

    rule.second = 0;
    rule.minute = 0;
    rule.hour = 20;

    schedule.scheduleJob(rule, function () {
        httprequest(url, requestData);
        console.log("提醒日期: " + new Date());
    });
    console.log("寝室电量每日提醒程序运行成功...！");
}

scheduleCronstyle();