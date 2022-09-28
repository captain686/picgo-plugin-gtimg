module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register("gtimg", {
      handle,
      name: "gtimg",
    });
  };
  const postOptions = (image) => {
    return {
      method: "POST",
      url: "http://upload.58cdn.com.cn/json",
      headers: {
        Host: "upload.58cdn.com.cn",
        "Sec-Ch-Ua": '"-Not.A/Brand";v="8", "Chromium";v="102"',
        Accept: "*/*",
        "Content-Type": "application/json",
        "Sec-Ch-Ua-Mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        Connection: "close",
      },

      body: {
        "Pic-Size": "0*0",
        "Pic-Encoding": "base64",
        "Pic-Path": "/nowater/webim/big/",
        "Pic-Data": image,
      },
      json: true,
      ssl: true,
    };
  };

  const handle = async (ctx) => {
    const bashUrl = "https://pic9.58cdn.com.cn/nowater/webim/big/";
    const imgList = ctx.output;
    for (let i in imgList) {
      let image = imgList[i].base64Image;
	  if(!image && imgList[i].buffer){
		image = Buffer.from(imgList[i].buffer).toString('base64');
	  }
      const postConfig = postOptions(image);
      let body = await ctx.Request.request(postConfig);
	  if (isAssetTypeAnImage(body)){
		delete imgList[i].base64Image;
        delete imgList[i].buffer;
        imgList[i]["imgUrl"] = bashUrl+body;
	  } else {
			throw new Error(body);
		  }
    }
    return ctx;
  };
  function isAssetTypeAnImage(body) {
	var index= body.lastIndexOf(".");
	var ext = body.substr(index+1);
	return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1;
  }
  return {
    uploader: "gtimg",
    register,
  };
};
