###### 一款基于[react-image-crop](https://github.com/DominicTobias/react-image-crop)二次开发的，弹出层,图片裁剪插件(添加了预览)

```javascript
npm install dbb-img-crop --save
```

######  node>=10.13.0

######  效果预览
<div>
<img src="http://yjw-image.oss-cn-shenzhen.aliyuncs.com/npm/demo.png" />

###### 使用示例

```javascript
import React from "react";
import ReactCrop from "dbb-img-crop";
import "dbb-img-crop/dist/ReactCrop.css";

class App extends Component {
  state = {
    src: null,
  };
  
  handleSubmit = ({file}) => {
    // 会返回一个对象,file参数就是一个Blob对象
   // 如果你使用antd的插件，传进来的File对象有name和uid字段,返回的Blob对象都会有这两个key-value 
    conosle.log(file);  
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({ src: e.target.files[0] });
    }
  };

  render() {
    const { src } = this.state;

    return (
      <div className="App">
        <h1>下面将开始测试</h1>
        <div>
          <input type="file" onInput={this.onSelectFile} />
        </div>
        {src && (
          <>
            <ReactCrop
              file={src}
              handleSubmit={this.handleSubmit)}
              close={() => this.setState({ src: null })}
            />
          </>
        )}
      </div>
    );
  }
}
```

| 参数名字                                          | 参数说明                                   |
| ------------------------------------------------- | ------------------------------------------ |
| file                                              | 图片的File对象(必传)                       |
| handleSubmit                                      | 点击确定之后的回调函数:({file:Blob}) => {} |
| close                                             | 关闭整个弹出层的回调函数                   |
| title                                             | 弹出尘的标题，default：编辑图片            |
| blockSize:{width:number\|222,height:number\|296}  | 裁剪图片的框框尺寸                         |
| cropSize:{width:number\|111,height:number \| 148} | 裁剪之后的照片回显尺寸                     |

[^{...props}]: 支持所有react-image-crop的参数






