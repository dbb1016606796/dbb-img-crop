###### 一款基于[react-image-crop](https://github.com/DominicTobias/react-image-crop)二次开发的，图片裁剪工具

```javascript
npm install dbb-img-crop --save
```

######  node>=10.13.0

######  效果预览
<div>
<img src="http://yjw-image.oss-cn-shenzhen.aliyuncs.com/npm/demo.gif" />

###### 使用示例

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop from '../lib/ReactCrop';

const blockSize = {
  width: 460,
  height: 590,
};
const cropSize = {
  width: 800,
  height: 600,
};

class App extends Component {
  state = {
    src: null,
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({ src: e.target.files[0] });
    }
  };

	handleSubmit = ({file,event}) => {
    // 会返回一个对象,file参数就是一个Blob对象
   // 如果你使用antd的插件，传进来的File对象有name和uid字段,返回的Blob对象都会有这两个key-	value 
    conosle.log(file);  
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
              //{...props}
              //locked={true} 开启九宫格裁剪框
              //ruleOfThirds={true} 允许自定义裁剪框
              file={src}
              // blockSize={blockSize}
              // cropSize={cropSize}
              handleSubmit={this.handleSubmit}
              close={() => this.setState({ src: null })}
            />
          </>
        )}
      </div>
    );
  }
}
```

| 参数名字                                          | 参数说明                                         |
| ------------------------------------------------- | ------------------------------------------------ |
| file                                              | 图片的File对象(必传)                             |
| handleSubmit                                      | 点击确定之后的回调函数:({file:Blob,event}) => {} |
| close                                             | 关闭整个弹出层的回调函数                         |
| title                                             | 弹出尘的标题，default：编辑图片                  |
| blockSize:{width:number\|222,height:number\|296}  | 裁剪图片的框框尺寸                               |
| cropSize:{width:number\|111,height:number \| 148} | 裁剪之后的照片回显尺寸                           |
| rotate:boolean                                    | 是否开启旋转                                     |
| wrapStyle:object                                  | 最外层容器的样式                                 |
| leftStyle:object                                  | 左边容器的样式                                   |

[^{...props}]: 支持所有react-image-crop的参数



##### 更新日志

###### 1.1.1

1. 新增wrapStyle属性。
2. 新增leftStyle属性。
3. 新增git图演示

###### 1.1.0

1. 新增旋转功能
2. 布局方式变动，如果裁剪框+预览 不大于当前屏幕宽度的80%，将会水平剧中对齐显示

###### 1.0.3

1. 裁剪框添加了阴影。
2. button按钮添加了一个类型 *type*="button"
3. handleSubmit传递参数新增 event

