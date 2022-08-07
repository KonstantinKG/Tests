const zoom = document.getElementById("zoom"),
   zoomClientHeight = zoom.parentElement.clientHeight,
   zoomClientWidth = zoom.parentElement.clientWidth,
   zoomScrollHeight = zoom.scrollHeight,
   zoomScrollWidth = zoom.scrollWidth;

let scale = 1,
   panning = false,
   pointX = 0,
   pointY = 0,
   start = { x: 0, y: 0 },
   availTrans,
   tableTop = zoom.parentNode.getBoundingClientRect().top;
   tableLeft = zoom.parentNode.getBoundingClientRect().left;

// Функция для рассчета минимального scale
function getMinScale() {
   let scaleWidth = Math.floor(zoomClientWidth / zoomScrollWidth * 100) / 100,
      scaleHeight = Math.floor(window.innerHeight / zoomScrollHeight * 100) / 100;
   
   if (scaleWidth > 1) scaleWidth = 1;
   if (scaleHeight > 1) scaleHeight = 1;

   return scaleWidth >= scaleHeight ? scaleWidth : scaleHeight;
}
const minScale = getMinScale();

// Функция для рассчета максимального translate
function getAvailableTranslate() {
   let xMAx = -(zoomScrollWidth * scale - zoomClientWidth),
      yMAx = -(zoomScrollHeight * scale - zoomClientHeight);

   if (yMAx > -20) yMAx = 0;

   availTrans = {xmax: xMAx, ymax: yMAx};
}
getAvailableTranslate();

// Функция для рассчета координат курсора
function getClientCoords(e) {
   return [e.clientX - tableLeft, e.clientY - tableTop]
}

// Функция для применения трансформаций
function setTransform() {
   zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

// Собития нажатия мыши
zoom.addEventListener('pointerdown', (e) => {
   e.preventDefault();
   start = { x: e.clientX - pointX, y: e.clientY - pointY };
   panning = true;
});

// Событие отжатия мыши
zoom.addEventListener('pointerup', (e) => {
   panning = false;
});

// События движения мыши
zoom.addEventListener('pointermove', (e) => {
   e.preventDefault();
   if (!panning) {
      return;
   }
   let pX = (e.clientX - start.x),
      pY = (e.clientY - start.y);

   if (pX < availTrans.xmax) pointX = availTrans.xmax;
   else if (pX > 0) pointX = 0;
   else pointX = pX;

   if (pY < availTrans.ymax) pointY = availTrans.ymax;
   else if (pY > 0) pointY = 0;
   else pointY = pY;

   setTransform();
});

// Отключение движения блока если координаты курсора выходят за его пределы
document.querySelector('.tournament__container').addEventListener('pointermove', (e) => {
   if (e.clientX < tableLeft || e.clientY < tableTop) panning = false;

   if (e.clientX > tableLeft + zoomClientWidth || e.clientY > tableTop + zoomClientHeight) panning = false;
})

// Событие зум Ctrl + wheel для компьютеров
zoom.addEventListener('wheel', (e) => 
{
   if(e.ctrlKey) {
      e.preventDefault();
      tableTop = zoom.parentNode.getBoundingClientRect().top;
      tableLeft = zoom.parentNode.getBoundingClientRect().left;

      let [clientX, clientY] = getClientCoords(e);

      let xs = (clientX - pointX) / scale,
      ys = (clientY - pointY) / scale,
      delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);

      (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);

      pointX = clientX - xs * scale;
      pointY = clientY - ys * scale;

      if (delta < 0) {
         (pointX >= 0) ? (pointX = 0) : 0;
         (pointY >= 0) ? (pointY = 0) : 0;
      }

      if (scale <= minScale) scale = minScale;

      getAvailableTranslate();
      setTransform();
   }
});

zoom.addEventListener('touchmove', (e) => {
   if (e.touches.length > 2) {
      getDiagonal(e.touches);
   }
})

function getDiagonal(touches){
   let lineX = touches[0].clientX - touches[1].clientX,
      lineY = touches[0].clientY - touches[1].clientY;

   alert((lineX**2 + lineY**2)**0.5)
}