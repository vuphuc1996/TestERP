const $=id=>document.getElementById(id);
const state={bootstrap:null,active:'employee'};

document.addEventListener('DOMContentLoaded', async ()=>{
  registerSW();
  detectDevice();
  buildNav();
  await loadBootstrap();
  $('btnBiometric').addEventListener('click', registerPasskeyDemo);
});

function registerSW(){
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.warn);
}
function detectDevice(){
  const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if(mobile){
    $('mobileNotice').classList.remove('d-none');
    $('mobileNotice').textContent='Thiết bị di động: dùng Add to Home Screen hoặc ứng dụng Capacitor để có trải nghiệm app.';
  }
}
function buildNav(){
  const items=[['employee','Nhân sự'],['attendance','Chấm công'],['payroll','Lương'],['leave','Phép'],['asset','Tài sản'],['recruitment','Tuyển dụng'],['booking','Phòng / Xe'],['offboard','Nghỉ việc'],['workflow','Workflow'],['crm','CRM'],['dms','DMS'],['task','Công việc'],['kpi','KPI'],['okr','OKR']];
  $('moduleNav').innerHTML=items.map(([k,v])=>`<button class="list-group-item list-group-item-action" data-k="${k}">${v}</button>`).join('');
  $('moduleNav').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.active=b.dataset.k;renderModule();});
}
async function loadBootstrap(){
  if(window.NEXA_CONFIG.coreUrl.includes('PASTE_')){
    Swal.fire({icon:'warning',title:'Chưa cấu hình Core',text:'Sửa web/config.js và đặt Core Web App URL.'});
    renderModule(); return;
  }
  showLoading(true);
  try{
    const data=await api('bootstrap','POST',{});
    state.bootstrap=data;
    $('identityBadge').textContent=data.identity?.email||'';
  }catch(e){ Swal.fire({icon:'error',title:'Không tải được dữ liệu',text:e.message}); }
  finally{showLoading(false);renderModule();}
}
async function api(action,method='POST',payload={}){
  const url=window.NEXA_CONFIG.coreUrl;
  const body=JSON.stringify({action,...payload});
  const r=await fetch(url,{method,headers:{'Content-Type':'text/plain;charset=utf-8'},body});
  const text=await r.text();
  let out; try{out=JSON.parse(text)}catch(_){throw new Error('CORE_RESPONSE_INVALID');}
  if(!out.ok) throw new Error(out.error||'CORE_ERROR');
  return out;
}
function renderModule(){
  const title=document.querySelector(`[data-k="${state.active}"]`)?.textContent||state.active;
  $('app').innerHTML=`<div class="card card-soft p-4"><div class="d-flex justify-content-between align-items-center mb-3"><h3 class="h5 mb-0">${title}</h3><span class="badge text-bg-light">Server-side rules</span></div><div class="row g-3"><div class="col-md-4"><div class="card card-soft p-3"><div class="text-secondary small">Identity</div><div class="metric">${state.bootstrap?.identity?.employeeKey||'—'}</div></div></div><div class="col-md-4"><div class="card card-soft p-3"><div class="text-secondary small">Tenant</div><div class="metric">${state.bootstrap?.tenantKey||'—'}</div></div></div><div class="col-md-4"><div class="card card-soft p-3"><div class="text-secondary small">Version</div><div class="metric">${state.bootstrap?.version||'—'}</div></div></div></div></div>`;
}
function showLoading(v){$('loading').classList.toggle('d-none',!v)}

async function registerPasskeyDemo(){
  if(!window.PublicKeyCredential){Swal.fire({icon:'info',title:'Passkey không được hỗ trợ trên trình duyệt này'});return;}
  Swal.fire({icon:'info',title:'Passkey',text:'Bản giao diện đã sẵn sàng cho WebAuthn. Production cần một endpoint tạo challenge và xác minh assertion ở Core.'});
}
