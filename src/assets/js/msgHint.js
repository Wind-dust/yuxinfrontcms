import {Message} from 'element-ui';

let errCollect = {
  ApplicationCase:{
    addApplicationCase:{
      3001:'标题不能为空',
      3002:'图片不存在',
      3003:'内容不能为空',
      3009:'添加失败',
      3010:'图片没有上传'
    },
    updateApplicationCase:{
      3001:'id错误',
      3002:'用户不存在'
    },
    getApplicationCase:{
      3001:'页码不能为空',
      3002:'用户不存在'
    }
  },
  upload: {
    uploadfile: {
      3001: '上传的不是图片',
      3002: '上传图片不能超过2M',
      3003: '上传失败',
      3004: '上传文件不能为空'
    },
    uploadmultifile: {
      3001: '上传的不是图片',
      3002: '上传图片不能超过2M',
      3003: '上传失败',
      3004: '上传文件不能为空'
    }
  },
}

function msgHint(code, url = '') {
  if (!url) throw new Error('url未传入');
  let port = url.split('/');
  let text = '';
  if (errCollect[port[0]] && errCollect[port[0]][port[1]] && errCollect[port[0]][port[1]][code]) {
    text = errCollect[port[0]][port[1]][code]
  } else {
    text = '意料之外的错误'
  }
  Message({message: text, type: 'error'});
}

export {
  msgHint
}
