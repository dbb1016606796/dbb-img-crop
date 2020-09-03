/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop from '../lib/ReactCrop';

const cropEditor = document.querySelector('#crop-editor');

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
              //locked={true}  //true == 裁剪框不可以自定义尺寸
              //ruleOfThirds={true} //true == 开启裁剪框九宫格
               wrapStyle={{ width: '80%', height: '900px' }}
              cropSize={{ width: '880px', height: '660px' }}
              blockSize={{ width: 880, height: 660 }}
              defaultWatermarkSize={[100, 100]}
              scrollBar={true}
              file={src}
              rotate={true}
              watermark={true}
              handleSubmit={blob => {
                console.log(blob);
              }}
              close={() => this.setState({ src: null })}
            />
          </>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, cropEditor);
