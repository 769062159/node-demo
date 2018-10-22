import React, { PureComponent } from 'react';
import E from 'wangeditor';
import request from '../../utils/request';
// import styles from './TableList.less';
// import request from '../../utils/request';
// import LiveGoodTable from '../../components/LiveGoodTable';



export default class Wangeditor extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    //   editorContent: '',
    }
    this.editorElem = React.createRef();
  }
  // state = {
  //   header: {
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   },
  // };
  componentDidMount() {
    const elem = this.editorElem.current;
    this.editor = new E(elem)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    this.editor.customConfig.onchange = html => {
      const { setDescription } = this.props;
      setDescription(html);
      // this.setState({
      //   editorContent: html,
      // })
    }
    this.editor.customConfig.customUploadImg = (files, insert) => {
        const { header } = this.props;
        const body = new FormData();
        body.append("type", 2);
        body.append("file", files[0]);
        request('/shop/upload', {
        method: 'POST',
        headers: {
          Authorization: header,
        },
        body,
        }).then(res => {
          if (res.code === 200) {
            insert(res.data)
          }
        })
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        // 上传代码返回结果之后，将图片插入到编辑器中
        // insert(imgUrl)
    }
    this.editor.customConfig.uploadImgServer = '/upload';
    this.editor.customConfig.zIndex = 10;
    this.editor.create();
  }
  componentWillReceiveProps(nextProps, ) {
    const { detail } = nextProps;
    const { detail: oldDetail } = this.props;
    if (detail !== oldDetail) {
      this.editor.txt.html(detail);
    }
  }
  render() {

    return (
      <div ref={this.editorElem} style={{textAlign: 'left'}} />
    );
  }
}
