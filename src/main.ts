import * as https from 'https'
import md5 from 'md5'
import * as querystring from 'querystring'

export const translate = (word: string) => {
    console.log(word)

    const appId = '???'
    const appSecret = "???"
    const salt = Math.random()

    const sign = md5(appId + word + salt + appSecret)

    const query: string = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: appId,
        salt: salt,
        sign: sign
        // sign: md5()
        // sign: 
        // q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
    })
    console.log('query', query)

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    }

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    req.on('error', e => {
        console.error(e)
    })
    req.end()
}