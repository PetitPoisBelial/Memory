// ============================================================
// MODIFIE CETTE LISTE POUR AJOUTER TES MOTS.
// Un mot = une paire. Les doublons sont ignorés.
// ============================================================
let mots = [];
const clean=[...new Set(mots.map(x=>String(x).trim().toLocaleUpperCase("fr-FR")).filter(Boolean))];
const $=id=>document.getElementById(id);let selected=[],cards=[],first=null,second=null,locked=false,player=0,scores=[0,0],pairs=0;
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderWords(){let box=$("words");box.innerHTML="";clean.forEach((w,i)=>{let d=document.createElement("div");d.className="word";d.innerHTML=`<input id="w${i}" type="checkbox" value="${esc(w)}"><label for="w${i}">${esc(w)}</label>`;d.querySelector("input").addEventListener("change",update);box.append(d)});update()}
function update(){selected=[...document.querySelectorAll("#words input:checked")].map(x=>x.value);$("count").textContent=`${selected.length} paire${selected.length>1?"s":""}`;$('start').disabled=selected.length<2}
function esc(s){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
$("all").onclick=()=>{document.querySelectorAll("#words input").forEach(x=>x.checked=true);update()};$("none").onclick=()=>{document.querySelectorAll("#words input").forEach(x=>x.checked=false);update()};$("random").onclick=()=>{let ins=[...document.querySelectorAll("#words input")];ins.forEach(x=>x.checked=false);if(ins.length<2)return update();ins=shuffle(ins);let n=Math.min(ins.length,Math.max(4,Math.floor(Math.random()*ins.length)+1));ins.slice(0,n).forEach(x=>x.checked=true);update()};
$("start").onclick=start;$("restart").onclick=start;$("change").onclick=()=>{$("game").classList.add("hidden");$("setup").classList.remove("hidden")};$("new").onclick=()=>{$("modal").classList.add("hidden");start()};
function start(){scores=[0,0];player=0;pairs=0;first=second=null;locked=false;cards=shuffle(selected.flatMap(word=>[{word},{word}]));$("setup").classList.add("hidden");$("game").classList.remove("hidden");$("modal").classList.add("hidden");renderBoard();header()}
function cols(n){if(n<=12)return 4;if(n<=20)return 5;if(n<=30)return 6;if(n<=40)return 8;return 10}
function renderBoard(){let b=$("board");b.innerHTML="";b.style.setProperty("--cols",cols(cards.length));cards.forEach((c,i)=>{let el=document.createElement("button");el.className="coin";el.innerHTML=`<span class="inner"><span class="face front"></span><span class="face back">${esc(c.word)}</span></span>`;el.onclick=(e)=>{e.preventDefault();flip(el,i)};b.append(el)})}
function flip(el,i){if(locked||el.classList.contains("flipped")||el.classList.contains("matched"))return;el.classList.add("flipped");el.querySelector(".inner").style.transform="rotateY(180deg)";if(first===null){first=i;return}if(i===first)return;second=i;locked=true;if(cards[first].word===cards[second].word)match();else setTimeout(mismatch,800)}
function match(){const owner=player===0?"phoenix-owned":"trex-owned";$("board").children[first].classList.add("matched",owner);$("board").children[second].classList.add("matched",owner);scores[player]++;pairs++;header();first=second=null;locked=false;if(pairs===selected.length)setTimeout(win,450)}
function mismatch(){const a=$("board").children[first],c=$("board").children[second];a.classList.remove("flipped");c.classList.remove("flipped");a.querySelector(".inner").style.transform="rotateY(0deg)";c.querySelector(".inner").style.transform="rotateY(0deg)";player=1-player;first=second=null;locked=false;header()}
function header(){$("s0").textContent=scores[0];$("s1").textContent=scores[1];$("turn").textContent=player===0?"Phoenix":"T-Rex";$('p0').classList.toggle("active",player===0);$('p1').classList.toggle("active",player===1)}
function win(){let a=scores[0],b=scores[1];$("winner").textContent=a===b?"Égalité !":a>b?"Phoenix gagne !":"T-Rex gagne !";$("result").textContent=`Phoenix : ${a} paire${a>1?"s":""} · T-Rex : ${b} paire${b>1?"s":""}`;$("modal").classList.remove("hidden")}
renderWords();
