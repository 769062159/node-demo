import React from 'react';

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

export default class Demo extends React.Component {
  handleChange = content => {
    const { setDescription } = this.props;
    setDescription(content);
    // dispatch({
    //   type: 'form/addEditor',
    //   payload: content,
    // });
  };

  // handleRawChange = (rawContent) => {
  //   console.log(rawContent)
  // }
  render() {
    const uploadFn = param => {
      const serverURL = 'http://hlsj.test.seastart.cn/admin/upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容

      const successFn = response => {
        console.log(response);
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        const data = JSON.parse(xhr.responseText);
        param.success({
          url: `${data.data}@500w_1l`,
          meta: {
            // id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          },
        });
      };

      const progressFn = event => {
        // 上传进度发生变化时调用param.progress
        param.progress(event.loaded / event.total * 100);
      };

      const errorFn = response => {
        console.log(response);
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.',
        });
      };

      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      fd.append('file', param.file);
      fd.append('type', 4);
      xhr.open('POST', serverURL, true);
      const token = `Bearer ${localStorage.getItem('token')}`;
      xhr.setRequestHeader('Authorization', token);
      xhr.send(fd);
    };
    const editorProps = {
      height: 200,
      contentFormat: 'html',
      initialContent: this.props.valueSon,
      media: {
        uploadFn,
      },
      onChange: this.handleChange,
      // onRawChange: this.handleRawChange,
    };

    return (
      <div className="demo" style={{ border: '1px solid #000' }}>
        <BraftEditor {...editorProps} />
      </div>
    );
  }
}
