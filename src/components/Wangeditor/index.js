import React, { PureComponent } from 'react';
import E from 'wangeditor';
import request from '../../utils/request';
import { UPLOAD_TYPE } from '../../utils/config';
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
    }
    this.editor.customConfig.pasteTextHandle = (html) => {
      /* eslint no-useless-escape:0 */
      // let html = agreement;
      const re = new RegExp("(<P)([^>]*>.*?)(<\/P>)","gi") ;// Different because of a IE 5.0 error
      html = html.replace(/<\/?SPAN[^>]*>/gi, "" );
      // Class
      html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
      // Style
      html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1") ;
      // Lang
      html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
      // XML元素及声明
      html = html.replace(/<\\?\?xml[^>]*>/gi, "");
      html = html.replace(/<\/?font[^>]*>/gi,""); 
      // 带XML名称空间声明: <o:p></o:p>
      html = html.replace(/<\/?\w+:[^>]*>/gi, "") ;
      // 替换&nbsp;
      html = html.replace(/&nbsp;/, "" );
      // 将<P>换成<DIV>
      html = html.replace( re, "<div$2</div>" ) ;
      html = html.replace(/(<T[RD])(\s*)(HEIGHT=[\"\']?\d+[\"\']?)/gi, "$1");
      html = html.replace(/(<table)([^>]*?)x:str>/gi, "$1$2align='center'>");
      html = html.replace(/(<TD)\s*([^>]*?)(width=[\"\']?\d+[\"\']?)([^>]*?)(>)/gi, "$1$2$4$5");
      html = html.replace(/(\s*x:num(=[\"\']\d+")?)(>)/gi, "$3");
      return html;
    }
    this.editor.customConfig.customUploadImg = (files, insert) => {
        const { header } = this.props;
        const body = new FormData();
        body.append("type", UPLOAD_TYPE.rich);
        body.append("file", files[0]);
        request('/merchant/upload', {
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
  // componentWillReceiveProps(nextProps, ) {
  //   const { detail } = nextProps;
  //   const { detail: oldDetail } = this.props;
  //   if (detail !== oldDetail) {
  //     this.editor.txt.html(detail);
  //   }
  // }
  render() {
    const { detail } = this.props;

    return (
      <div ref={this.editorElem} style={{textAlign: 'left'}} >
        <div dangerouslySetInnerHTML={{ __html: detail }} />
      </div>
    );
  }
}
