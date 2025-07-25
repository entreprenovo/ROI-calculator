<!-- loader.js content: -->
window.addEventListener('load',function(){
const modalHTML=`<div id="roiModal" style="display:none;position:fixed;inset:0;z-index:999999">
<div onclick="window.closeROICalc()" style="position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)"></div>
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:900px;height:90vh;background:white;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">
<div style="padding:20px;border-bottom:1px solid #e2e8f0;text-align:center">
<h2 style="margin:0;font-size:24px;color:#0f172a">Your ROI Analysis</h2>
<button onclick="window.closeROICalc()" style="position:absolute;top:20px;right:20px;background:none;border:none;cursor:pointer">✕</button>
</div>
<iframe id="roiFrame" style="width:100%;height:calc(100% - 70px);border:none"></iframe>
</div></div>`;
document.body.insertAdjacentHTML('beforeend',modalHTML);
window.openROICalc=function(){
document.getElementById('roiFrame').src='https://cdn.jsdelivr.net/gh/entreprenovo/ROI-calculator@main/roi-calculator-app.html?serviceCost=7500';
document.getElementById('roiModal').style.display='block';
document.body.style.overflow='hidden';
};
window.closeROICalc=function(){
document.getElementById('roiModal').style.display='none';
document.body.style.overflow='';
};
document.addEventListener('click',function(e){
if(e.target.matches('[data-roi-trigger]')){
e.preventDefault();
window.openROICalc();
}
});
});
