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
              //locked={true}
              //ruleOfThirds={true}
              wrapStyle={{ width: '50%', maxLength: '70%' }}
              file={src}
              rotate={true}
              // blockSize={blockSize}
              // cropSize={cropSize}
              handleSubmit={blob => {
                const src = URL.createObjectURL(blob.file),
                  img = document.createElement('img');
                img.src = src;
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

ReactDOM.render(<App />, cropEditor);
