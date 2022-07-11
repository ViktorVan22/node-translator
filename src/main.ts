import * as https from 'https'
import md5 from 'md5'
import * as querystring from 'querystring'
import { appId, appSecret } from './private'

interface BaiduResult {
    error_code?: string
    error_msg?: string
    from: string
    to: string
    trans_result: {
        src: string
        dst: string
    }[]
}

const errorMap = {
    52003: '用户认证失败',
    52004: 'error2',
    52005: 'error3',
    unknown: '服务器繁忙'
}

export const translate = (word: string) => {
    const salt = Math.random()

    const sign = md5(appId + word + salt + appSecret)

    const query: string = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: appId,
        salt: salt,
        sign: sign
    })

    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    }

    const request = https.request(options, (response) => {
        let chunks: Uint8Array[] = []
        response.on('data', (chunk) => {
            chunks.push(chunk)
        })
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString()
            console.log(string)
            const object: BaiduResult = JSON.parse(string)
            if (object.error_code) {
                console.error(
                    errorMap[object.error_code as keyof object]
                    || object.error_msg
                )
                process.exit(2)
            } else {
                console.log(object.trans_result[0].dst)
                process.exit(0)
            }

        })
    })

    request.on('error', e => {
        console.error(e)
    })
    request.end()
}