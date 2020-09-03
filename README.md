###### 一款基于[react-image-crop](https://github.com/DominicTobias/react-image-crop)二次开发的，图片裁剪工具

```javascript
npm install dbb-img-crop --save
```

######  node>=10.13.0

######  效果预览
<div>
<p>裁剪demo</p>
<img src="http://yjw-image.oss-cn-shenzhen.aliyuncs.com/npm/demo1.gif" />
<p>裁剪+水印</p>
<img src="http://yjw-image.oss-cn-shenzhen.aliyuncs.com/npm/demo2.gif" />
</div>

###### 使用示例

```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; 
import ReactCrop from 'dbb-img-crop';

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
   //如果还需要回显，可以 img.src = new Blob(file)     
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
<<<<<<< HEAD
              //{...props}
=======
              //locked={true}  true == 裁剪框不可以自定义尺寸
              //ruleOfThirds={true} true == 开启裁剪框九宫格
>>>>>>> 1.2.0
              file={src}
              handleSubmit={blob => {
                //设置照片回显
                const src = URL.createObjectURL(blob.file),
                  img = document.createElement('img');
                img.src = src;
                img.style.margin = '0 auto';
                img.style.display = 'block';
                document.body.appendChild(img);
                this.setState({ src: null });
              }}
              close={() => this.setState({ src: null })}
            />
          </>
        )}
      </div>
    );
  }
}
```

| 参数名字                                   | 参数说明                                                    |
| ------------------------------------------ | ----------------------------------------------------------- |
| file                                       | 图片的File对象(必传)                                        |
| handleSubmit                               | 点击确定之后的回调函数:({file:Blob,event}) => {}            |
| close                                      | 关闭整个弹出层的回调函数                                    |
| title                                      | 弹出尘的标题，default：编辑图片                             |
| blockSize：{width：number, height：number} | 裁剪框的尺寸，默认尺寸：width：222，height：296             |
| cropSize：object<style>                    | 裁剪之后的照片回显样式，默认回显照: width：111，hegiht：148 |
| rotate：boolean                            | 是否开启旋转，default：false                                |
| wrapStyle：object<style>                   | 最外层容器的样式                                            |
| leftStyle：object<style>                   | 左边容器的样式                                              |
| scrollBar：boolean                         | 是否显示滚动条，default：false                              |
| watermark：boolean                         | 是否开启添加水印功能，defalut：false                        |
| watermarkStyle：object<style>              | 添加水印的操作的样式                                        |
| maxWatermarkSize：[width,height]           | 设置水印的最大宽高,不传则不限制                             |
| defaultWatermarkSize：[width,height]       | 设置水印的默认尺寸，defalut：[50,50]                        |
| accept：string                             | 水印图片的类型，default："image/png, image/jpeg"            |

[^{...props}]: 支持所有react-image-crop的参数



##### 更新日志

<<<<<<< HEAD
###### 1.1.2 & 1.1.3

1. 修改.gitignore，不再上传测试文件生成的js文件(可以运行npm run start来生成)
2. 就这样，目前功能暂时满足了我的需求，后期可能会新增 添加水印的功能。
=======
###### 1.2.0

1. 新增添加水印功能。
>>>>>>> 1.2.0

###### 1.1.1

1. 新增wrapStyle属性。
2. 新增leftStyle属性。
3. 新增git图演示

###### 1.1.0

1. 新增旋转功能
2. 布局方式变动，如果裁剪框+预览 不大于当前屏幕宽度的80%，将会水平剧中对齐显示
3. css文件最终将会打包进js文件，不再单独打包成js和css文件

###### 1.0.3

1. 裁剪框添加了阴影。
2. button按钮添加了一个类型 *type*="button"
3. handleSubmit传递参数新增 event

