module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('gtimg', {
      handle,
      name: 'gtimg'
    })
  }
  const postOptions = (fileName, image) => {
    return{
      method: 'POST',
      url: 'https://om.qq.com/image/orginalupload',
      headers: {
        'Host': 'om.qq.com',
        'Cookie': 'pgv_pvid=1165286200; TSID=2pfcvd99t0hcej4obon01b2gj4',
        'Sec-Ch-Ua': '"(Not(A:Brand";v="8", "Chromium";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
        'Content-Type': 'multipart/form-data;',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'close'
      },
      formData: {
        Filedata: {
          value: image,
          options: {
            filename: fileName
          }
        }
      },
      ssl: 'true'
    }
  }

  const handle = async (ctx) => {
    const imgList = ctx.output
    for (let i in imgList) {
      let image = imgList[i].buffer
      const postConfig = postOptions(imgList[i].fileName, image)
      let body = await ctx.Request.request(postConfig)
      body = JSON.parse(body)
      if (body.response.code == 0) {
        delete imgList[i].base64Image
        delete imgList[i].buffer
        imgList[i]['imgUrl'] = body.data.url.replace("http://", "https://")
      } else {
        throw new Error(body)
      }
    }
    return ctx
  }

  return {
    uploader: 'gtimg',
    register
  }
}
