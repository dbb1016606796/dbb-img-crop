import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';

const defaultBlockSize = {
  width: 222,
  height: 296,
};

const defaultCropSize = {
  width: 111,
  height: 148,
};

function CropImg(props) {
  const [crop, setCrop] = useState(defaultBlockSize);
  const [imgSrc, setImgSrc] = useState(null);
  const [priewImg, setPriewImg] = useState(null);

  const ref = useRef(null);
  const newFileObj = useRef(null);

  useEffect(() => {
    const html = document.querySelector('html');
    const { file, blockSize } = props;
    if (blockSize) setCrop(blockSize);
    let reader = new FileReader(),
      rs = reader.readAsArrayBuffer(file),
      blob = null;
    reader.onload = e => {
      if (typeof e.target.result === 'object') {
        blob = new Blob([e.target.result]);
      } else {
        blob = e.target.result;
      }
      setImgSrc(URL.createObjectURL(blob));
    };
    html.style.overflow = 'hidden';
    return () => (html.style.overflow = 'visible');
  }, []);

  //开始上传到oss
  function btnClick() {
    const { handleSubmit, file } = props;
    if (file.name) newFileObj.current.name = file.name;
    if (file.uid) newFileObj.current.uid = file.uid;
    if (handleSubmit) handleSubmit({ file: newFileObj.current });
  }

  function onCropComplete(pixelCrop) {
    const canvas = document.createElement('canvas'),
      image = ref.current;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y, image.width, image.height);
    //兼容写法，canvas的toBlob方法兼容性很差
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          var canvas = this;
          setTimeout(function () {
            var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]);
            var len = binStr.length;
            var arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
          });
        },
      });
    }
    canvas.toBlob(blob => {
      if (!blob) {
        console.error('取消了裁剪框');
        return;
      }
      let url = URL.createObjectURL(blob);
      //设置照片回显
      setPriewImg(url);
      newFileObj.current = blob;
    }, 'image/jpeg');
  }

  return (
    <div className="crop-img-box">
      {imgSrc && (
        <div className="wrap">
          <h1 className="dbb-title">{props.title || '编辑图片'}</h1>
          <ReactCrop
            {...props}
            src={imgSrc}
            crop={crop}
            onImageLoaded={child => (ref.current = child)}
            onComplete={onCropComplete}
            onChange={newCrop => {
              setCrop(newCrop);
            }}
          />

          <footer className="footer-box">
            <div className="priew" style={{ right: '80px' }}>
              <p>图片预览</p>
              <img src={priewImg} style={props.cropSize || defaultCropSize} />
            </div>
            <div className="btn">
              <button onClick={btnClick} className="dbb-ok">
                确定
              </button>
              <button onClick={props.close} className="dbb-cancel">
                取消
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default CropImg;
