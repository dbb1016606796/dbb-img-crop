import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import Select from 'react-select';
import './ReactCrop.scss';

const options = [
  { value: '0', label: '选择水印位置', isDisabled: true },
  { value: '1', label: '左上角' },
  { value: '2', label: '左下角' },
  { value: '3', label: '右上角' },
  { value: '4', label: '右下角' },
  { value: '5', label: '垂直居中' },
];

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
  //添加水印
  const [swtichStatus, setSwitchStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ value: '1', label: '左上角' });

  const ref = useRef(null);
  const newFileObj = useRef(null);
  const watermaskStyle = useRef({ width: 0, height: 0 });
  const maxWatermaskWH = useRef([111, 148]);

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

  //点击确定的回调函数
  function btnClick(event) {
    const { handleSubmit, file } = props;
    if (file.name) newFileObj.current.name = file.name;
    if (file.uid) newFileObj.current.uid = file.uid;
    if (handleSubmit) handleSubmit({ file: newFileObj.current, event });
  }

  //获取图片的原始尺寸
  function getSize(url) {
    return new Promise(resolve => {
      let img = document.createElement('img');
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          img,
        });
      };

      img.src = url;
    });
  }

  function toBlobFunc(canvas) {
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
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('取消了裁剪框');
          return;
        }
        let url = URL.createObjectURL(blob);
        newFileObj.current = blob;
        resolve({ url });
      }, props.file.type);
    });
  }

  async function onCropComplete(pixelCrop) {
    const canvas = document.createElement('canvas'),
      image = ref.current;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y, image.width, image.height);
    const { url } = await toBlobFunc(canvas);
    //设置照片回显
    await setPriewImg(url);
  }

  //旋转图片
  async function rotateFunc(flag) {
    //true ==右旋转  false == 左旋转
    //设置度数
    const number = flag ? 90 : -90;
    let d = (number * Math.PI) / 180;
    let size = await getSize(imgSrc);
    const canvasWidth = size.width,
      canvasHeight = size.height,
      rotationCanvas = document.createElement('canvas');
    rotationCanvas.width = canvasHeight;
    rotationCanvas.height = canvasWidth;
    let surfaceContext = rotationCanvas.getContext('2d');
    surfaceContext.clearRect(0, 0, rotationCanvas.width, rotationCanvas.height);
    surfaceContext.save();
    surfaceContext.translate(canvasHeight * 0.5, canvasWidth * 0.5);
    surfaceContext.rotate(d);
    surfaceContext.drawImage(size.img, -canvasWidth / 2, -canvasHeight / 2);
    surfaceContext.restore();
    const { url } = await toBlobFunc(rotationCanvas);
    await setImgSrc(url);
  }

  //添加水印
  function swtichChange(e) {
    const val = e.target.checked;
    setSwitchStatus(val);
  }

  //开始添加水印
  function addWatermark() {
    //水印宽高只能数字的正则 /^\d+$/g
    const max = maxWatermaskWH.current;
    const flag = Object.values(watermaskStyle.current).every(
      (number, index) => /^\d+$/g.test(number) && number <= max[index]
    );
    if (!flag)
      return alert(`水印宽高不支持复数，不能大于你的预览图尺寸大小,当前水印最大宽度：${max[0]}；最大高度：${max[1]}`);
  }

  return (
    <div className="crop-img-box">
      {/* 水印的操作箱 */}
      <div className="watermark">
        <h6 id="dragTitle">设置水印</h6>
        <ul>
          <li className="uploadFile-box">
            <input type="file" name="file" id="file" className="inputfile" />
            <label htmlFor="file">上传水印</label>
          </li>
          <li className="select-box">
            <Select
              defaultValue={selectedOption}
              placeholder="请选择水印位置"
              onChange={setSelectedOption}
              options={options}
            />
          </li>
          <li className="width-box">
            <label>
              <span className="label-text">设置水印宽度</span>
              <input
                type="number"
                min="1"
                onChange={e => {
                  watermaskStyle.current.width = e.target.value;
                }}
                placeholder="请输入水印宽度"
              />
            </label>
          </li>
          <li className="height-box">
            <label>
              <span className="label-text">设置水印高度</span>
              <input
                type="number"
                min="1"
                onChange={e => {
                  watermaskStyle.current.height = e.target.value;
                }}
                placeholder="请输入水印高度"
              />
            </label>
          </li>
          <li className="btn">
            <button type="button" onClick={addWatermark}>
              确定
            </button>
          </li>
        </ul>
      </div>
      {imgSrc && (
        <div className="wrap" style={props.wrapStyle || {}}>
          <h1 className="dbb-title">
            <p>{props.title || '编辑图片'}</p>
            {props.rotate && (
              <>
                <p className="rotate right" onClick={() => rotateFunc(0)}>
                  左旋转90°
                </p>
                <p className="rotate left" onClick={() => rotateFunc(1)}>
                  右旋转90°
                </p>
              </>
            )}
            <span htmlFor="radio" className="switch">
              <input type="checkbox" checked={swtichStatus} id="checkId" onChange={swtichChange} />
              <label htmlFor="checkId" checked></label>
              <span>添加水印</span>
            </span>
          </h1>
          <div className="dbb-left" style={props.leftStyle || {}}>
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
          </div>

          <footer className="footer-box dbb-right">
            <div className="priew" style={{ right: '80px' }}>
              <p>图片预览</p>
              <img src={priewImg} style={props.cropSize || defaultCropSize} />
            </div>
            <div className="btn">
              <button type="button" onClick={btnClick} className="dbb-ok">
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
