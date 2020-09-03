import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import Select from 'react-select';
import dragFun from './drangFun';
import './ReactCrop.scss';

const options = [
  { value: 0, label: '选择水印位置', isDisabled: true },
  { value: 1, label: '左上角' },
  { value: 2, label: '左下角' },
  { value: 3, label: '右上角' },
  { value: 4, label: '右下角' },
  { value: 5, label: '垂直居中' },
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
  // 水印的宽高
  const [watermarkStyle, setWatermaskStyle] = useState({ width: 50, height: 50 });
  //将水印的img标签保存到这里
  const [watermarkImgDom, setWatermarkImgDom] = useState(null);

  const ref = useRef(null);
  const newFileObj = useRef(null);
  // 预览照片的dom元素
  const priewImgRef = useRef(null);
  const neverAddWatermark = useRef(null);

  useEffect(() => {
    const html = document.querySelector('html');
    html.style.overflow = 'hidden';
    if (props.defaultWatermarkSize) {
      const [width, height] = props.defaultWatermarkSize;
      setWatermaskStyle({ width, height });
    }
    init();
    return () => (html.style.overflow = 'visible');
  }, []);

  //开启水印限的拖拽
  useEffect(() => {
    if (swtichStatus) {
      dragFun(document.querySelector('#dragTitle'), document.querySelector('.watermark'));
    } else {
      window.dbbMousemoveFunc && window.document.removeEventListener('mousemove', window.dbbMousemoveFunc);
    }
  }, [swtichStatus]);

  //开始添加水印
  useEffect(() => {
    if (!watermarkImgDom) return;
    watermarkCallback();
  }, [swtichStatus, selectedOption, watermarkStyle, watermarkImgDom]);

  async function init() {
    const { file, blockSize } = props;
    if (blockSize) setCrop(blockSize);
    const url = await byFileGetImgSrc(file);
    await setImgSrc(url);
  }

  //绘制水印到图片中
  async function watermarkCallback() {
    const canvas = document.createElement('canvas'),
      image = neverAddWatermark.current,
      { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);
    const { url } = await toBlobFunc(canvas, ctx);
    //设置照片回显
    await setPriewImg(url);
  }

  // 根据file对象获得img的src blob
  function byFileGetImgSrc(file) {
    return new Promise(resolve => {
      let reader = new FileReader(),
        rs = reader.readAsArrayBuffer(file),
        blob = null;
      reader.onload = e => {
        if (typeof e.target.result === 'object') {
          blob = new Blob([e.target.result]);
        } else {
          blob = e.target.result;
        }
        resolve(URL.createObjectURL(blob));
      };
    });
  }

  //点击确定的回调函数
  function btnClick(event) {
    const { handleSubmit, file } = props;
    if (file.name) newFileObj.current.name = file.name;
    if (file.uid) newFileObj.current.uid = file.uid;
    if (handleSubmit) handleSubmit({ file: newFileObj.current, event });
  }

  //获取图片的原始尺寸
  function getSize(url, style) {
    return new Promise(resolve => {
      let img = document.createElement('img');
      if (style) {
        img.width = style.width;
        img.height = style.height;
      }
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

  // flag == true 需要添加水印
  function toBlobFunc(canvas, ctx, flag = true) {
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
      //图片旋转的时候不需要重新添加水印了
      if (swtichStatus && flag) {
        //添加水印
        const { width, height } = watermarkStyle,
          { width: imgW, height: imgH } = priewImgRef.current,
          base = 10,
          { value } = selectedOption;
        let x = base,
          y = base;
        switch (value) {
          case 1:
            x = base;
            y = base;
            break;
          case 2:
            x = 10;
            y = imgH - height - base;
            break;
          case 3:
            x = imgW - width - base;
            y = base;
            break;
          case 4:
            x = imgW - width - base;
            y = imgH - height - base;
            break;
          case 5:
            x = (imgW - width) / 2;
            y = (imgH - height) / 2;
            break;
        }
        //开始计算水印要显示在哪里
        ctx.drawImage(watermarkImgDom, x, y, width, height);
      }
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

  //裁剪框的回调函数
  async function onCropComplete(pixelCrop) {
    const canvas = document.createElement('canvas'),
      image = ref.current;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y, image.width, image.height);
    const { url } = await toBlobFunc(canvas, ctx, false),
      // 开始保存截取后的原图，不管尺寸多少，都按照预览尺寸来拉伸
      { width, height } = priewImgRef.current;
    const { img } = await getSize(url, { width, height });
    neverAddWatermark.current = img;
    if (swtichStatus) {
      await watermarkCallback();
    } else {
      //设置照片回显
      await setPriewImg(url);
    }
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
    const { url } = await toBlobFunc(rotationCanvas, surfaceContext, false);
    await setImgSrc(url);
  }

  //添加水印的按钮回调
  function swtichChange(e) {
    const val = e.target.checked;
    setSwitchStatus(val);
  }

  //上传水印照片
  async function uploadWatermark(e) {
    const [file] = e.target.files;
    if (!file) return;
    const url = await byFileGetImgSrc(file);
    let { img } = await getSize(url);
    setWatermarkImgDom(img);
  }

  //设置水印的宽高
  function setWatermarkWH(e, key) {
    const val = e.target.value,
      obj = props.maxWatermarkSize;
    if (!/^\d+$/g.test(val)) return;
    if (obj) {
      const [width, height] = obj,
        maxObj = {
          width,
          height,
        };
      if (val > maxObj[key])
        return alert(`不能大于你的预览图尺寸大小,当前水印最大宽度：${maxObj.width}；最大高度：${maxObj.height}`);
    }
    setWatermaskStyle({ ...watermarkStyle, [key]: val });
  }

  return (
    <div className="crop-img-box">
      {/* 水印的操作箱 */}
      {swtichStatus && (
        <div className="watermark" style={props.watermarkStyle || {}}>
          <h6 id="dragTitle">设置水印</h6>
          <ul>
            <li className="uploadFile-box">
              <input
                type="file"
                name="file"
                accept={props.accept || 'image/png, image/jpeg'}
                id="file"
                className="inputfile"
                onChange={uploadWatermark}
              />
              <label htmlFor="file">添加水印</label>
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
                  value={watermarkStyle.width}
                  onChange={e => setWatermarkWH(e, 'width')}
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
                  value={watermarkStyle.height}
                  onChange={e => setWatermarkWH(e, 'height')}
                  placeholder="请输入水印高度"
                />
              </label>
            </li>
          </ul>
        </div>
      )}

      {/* 开始裁剪 */}
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
            {props.watermark && (
              <span htmlFor="radio" className="switch">
                <input type="checkbox" checked={swtichStatus} id="checkId" onChange={swtichChange} />
                <label htmlFor="checkId" checked></label>
                <span>添加水印</span>
              </span>
            )}
          </h1>
          <main className={`content ${props.scrollBar ? 'scrollBar' : ''}`}>
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
              <figure className="priew" style={{ right: '80px' }}>
                <p>图片预览</p>
                <div className="img-box">
                  <img
                    src={priewImg}
                    ref={child => (priewImgRef.current = child)}
                    style={props.cropSize || defaultCropSize}
                  />
                </div>
              </figure>
              <div className="btn">
                <button type="button" onClick={btnClick} className="dbb-ok">
                  确定
                </button>
                <button onClick={props.close} className="dbb-cancel">
                  取消
                </button>
              </div>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}

export default CropImg;
