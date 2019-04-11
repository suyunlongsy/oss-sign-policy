import CryptoJS from 'crypto-js'
const Base64 = CryptoJS.enc.Base64
const Utf8 = CryptoJS.enc.Utf8

const getTimestamp = () => {
	const date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`
}

const getOssPolicyAndSign = () => {
	const accessid = app.oss.accessKeyId
	const accesskey = app.oss.accessKeySecret

        // 设置 policy 过期时间
	let date = new Date()
	date.setHours(date.getHours() + 1)
	const srcT = date.toISOString()

	const policyText = {
		"expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
		"conditions": [
			["content-length-range", 0, 1048576000], // 设置上传文件的大小限制
			[
				"starts-with",
				"$key",
				`${getTimestamp()}/`
			] // 设置 上传限制的 开头
		]
	}
  
	const policyBase64 = Base64.stringify(Utf8.parse(JSON.stringify(policyText)))
	const message = policyBase64

	const signature = CryptoJS.HmacSHA1(message, accessKeySecret).toString(Base64)

	return {
		signature,
		policy: policyBase64,
	}
}