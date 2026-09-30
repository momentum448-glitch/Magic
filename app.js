const OWNER="momentum448-glitch";
const STATE_REPO="Magic-state";
const API="https://api.github.com";
const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const suits=[["S","♠",false],["H","♥",true],["D","♦",true],["C","♣",false]];
const params=new URLSearchParams(location.search);
const channel=(params.get("c")||"test01").replace(/[^a-zA-Z0-9_-]/g,"");
const statePath=`channels/${channel}.json`;
let selected=null,current=null;

const $=s=>document.querySelector(s);
const loading=$("#loading"), reveal=$("#reveal"), error=$("#error"), card=$("#card");
const setup=$("#setup"), deck=$("#deck"), status=$("#setupStatus"), done=$("#done");

function decode64(s){return decodeURIComponent(escape(atob(s.replace(/\n/g,""))))}
function encode64(s){return btoa(unescape(encodeURIComponent(s)))}
function stateUrl(){return `${API}/repos/${OWNER}/${STATE_REPO}/contents/${statePath}`}

async function readState(){
  const r=await fetch(stateUrl()+`?t=${Date.now()}`,{cache:"no-store",headers:{"Accept":"application/vnd.github+json"}});
  if(!r.ok) throw new Error(`read ${r.status}`);
  const body=await r.json();
  return {sha:body.sha,data:JSON.parse(decode64(body.content))};
}

function renderCard(code){
  const rank=code.slice(0,-1), suitCode=code.slice(-1);
  const suit=suits.find(x=>x[0]===suitCode);
  if(!suit) throw new Error("bad card");
  card.className=`playing-card ${suit[2]?"red":"black"}`;
  card.dataset.corner=`${rank}\n${suit[1]}`;
  card.textContent=suit[1];
}

async function loadReveal(){
  loading.classList.remove("hidden");reveal.classList.add("hidden");error.classList.add("hidden");
  try{current=await readState();renderCard(current.data.cardCode);loading.classList.add("hidden");reveal.classList.remove("hidden")}
  catch(e){console.error(e);loading.classList.add("hidden");error.classList.remove("hidden")}
}

function buildDeck(){
  deck.innerHTML="";
  for(const [sc,symbol,isRed] of suits) for(const rank of ranks){
    const code=rank+sc,b=document.createElement("button");
    b.className=`pick ${isRed?"red":""}`;b.textContent=`${rank}${symbol}`;b.dataset.code=code;
    b.onclick=()=>{selected=code;deck.querySelectorAll(".pick").forEach(x=>x.classList.toggle("selected",x===b));done.disabled=false;status.textContent=""};
    deck.appendChild(b);
  }
}

function token(){return localStorage.getItem("magic.githubPat")||""}
function openSetup(){
  $("#tokenPanel").style.display=token()?"none":"grid";
  $("#tokenInput").value="";
  status.textContent=`Channel: ${channel}`;
  setup.showModal();
}

async function writeSelected(){
  const pat=token(); if(!pat){$("#tokenPanel").style.display="grid";status.textContent="Cần token performer";return}
  if(!selected)return;
  done.disabled=true;status.textContent="Đang cập nhật…";
  try{
    let latest=await readState();
    const next={cardCode:selected,version:Number(latest.data.version||0)+1,updatedAt:new Date().toISOString()};
    const put=async sha=>fetch(stateUrl(),{
      method:"PUT",
      headers:{"Accept":"application/vnd.github+json","Authorization":`Bearer ${pat}`,"X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},
      body:JSON.stringify({message:`Set ${channel} to ${selected}`,content:encode64(JSON.stringify(next,null,2)+"\n"),sha})
    });
    let r=await put(latest.sha);
    if(r.status===409){latest=await readState();r=await put(latest.sha)}
    if(!r.ok)throw new Error(`write ${r.status}`);
    status.textContent="Đã sẵn sàng ✓";
    current={data:next};renderCard(selected);
    setTimeout(()=>setup.close(),350);
  }catch(e){console.error(e);status.textContent="Chưa cập nhật được. Thử lại.";done.disabled=false}
}

let pressTimer=null;
$("#secretHotspot").addEventListener("pointerdown",()=>{pressTimer=setTimeout(openSetup,2200)});
["pointerup","pointercancel","pointerleave"].forEach(ev=>$("#secretHotspot").addEventListener(ev,()=>{clearTimeout(pressTimer)}));
$("#closeSetup").onclick=()=>setup.close();
$("#saveToken").onclick=()=>{const v=$("#tokenInput").value.trim();if(v){localStorage.setItem("magic.githubPat",v);$("#tokenPanel").style.display="none";status.textContent="Token đã lưu trên máy"}};
$("#done").onclick=writeSelected;
$("#retry").onclick=loadReveal;
buildDeck();loadReveal();
