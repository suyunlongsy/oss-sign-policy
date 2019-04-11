# 使用说明

虽然 OSS 并未提供小程序的 sdk, 但是提供了通用的 API 接口, 而微信小程序的上传方法, 本质上是一个 POST 请求. 经过查阅 [OSS](https://help.aliyun.com/document_detail/31988.html?spm=a2c4g.11186623.2.2.W0gqKB#reference_smp_nsw_wdb) 和 [微信小程序的文档](https://developers.weixin.qq.com/miniprogram/dev/api/network-file.html), 采用后端计算参数传递给小程序的方式来实现上传,主要是计算policy和signature参数

### node后端使用
``` JavaScript

// aliyun 的 node sdk
const mpHelper = new MpUploadOssHelper({
  accessKeyId: AccessKeyId,
  accessKeySecret: AccessKeySecret,
  timeout: 1,     // 限制参数的有效时间(单位: 小时)
  maxSize: 10     // 限制上传文件大小(单位: Mb)
});

// 生成的参数
const params = mpHelper.createUploadParams();
const {
  policy,
  signature,
} = params

```

### 小程序端 

可以自己生成 policy 和 signature 利用 crypto.js 使用相同的加密规则，web端同理

阿里云和天翼云 的区别 在于 最后签名的 生成方式
```
// 阿里
const bytes = CryptoJS.HmacSHA1(message, accessKeySecret).toString(Utf8)
const signature = Base64.stringify(bytes)

// 天翼
const signature = CryptoJS.HmacSHA1(message, accessKeySecret).toString(Base64)

// 阿里云
const formData = {
  key: `${timestamp}/${filename},
  policy,
  OSSAccessKeyId,
  signature,
  success_action_status: "200" // 可选
}

// 天翼云
const formData = {
  key: `${timestamp}/${filename}`,
  policy,
  AWSAccessKeyId: oss.accessId,
  signature,
}

wx.uploadFile({
  url: oss.url,
  filePath: filePath,
  name: 'file',
  formData,
  success: res => {
    resolve(`${oss.url}/${timestamp}/${filename}`)
  }
})
```
阿里云OSS：aliyun-sign-policy.js

天翼云OOS：tyyun-sign-policy.js
