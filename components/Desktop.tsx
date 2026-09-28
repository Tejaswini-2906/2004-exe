 "use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {songs} from "../data/songs";
export default function Desktop(){
 const [selected,setSelected]=useState(0),[playing,setPlaying]=useState(false),[open,setOpen]=useState(true),[start,setStart]=useState(false),[memory,setMemory]=useState(false),[browser,setBrowser]=useState(false),[shutdown,setShutdown]=useState(false),[listeners,setListeners]=useState<number|null>(null);
 const [id]=useState(()=>typeof crypto!=="undefined"?crypto.randomUUID():"local");
 const audio=useRef<HTMLIFrameElement>(null);
 const song=songs[selected];
 useEffect(()=>{let alive=true; const ping=async()=>{try{const r=await fetch(`/api/presence?id=${id}`,{cache:"no-store"});const d=await r.json();if(alive)setListeners(d.count)}catch{}};ping();const t=setInterval(ping,20000);return()=>{alive=false;clearInterval(t)}},[id]);
 const playable=useMemo(()=>songs.map((s,i)=>s.videoId?i:null).filter((x):x is number=>x!==null),[]);
 const next=()=>{const p=playable.findIndex(i=>i>selected);setSelected(p>=0?playable[p]:playable[0]??0);setPlaying(true)};
 const prev=()=>{const p=[...playable].reverse().findIndex(i=>i<selected);setSelected(p>=0?playable[playable.length-1-p]:playable.at(-1)??0);setPlaying(true)};
 if(shutdown)return <div className="shutdown" onClick={()=>setShutdown(false)}>It is now safe to close this tab<br/><small>click anywhere to return</small></div>;
 return <main className="desktop" onContextMenu={e=>e.preventDefault()}>
  <div className="title">2004.exe</div><div className="tag">it's 2004 and you're calling it a night</div>
  <div className="presence">● {listeners??"—"} listening now</div>
  <section className="icons">
   {[
    ["▣","My Songs",()=>setOpen(true)],["♫","Playlist",()=>setOpen(true)],["✦","Memories",()=>setMemory(true)],["◎","Internet",()=>setBrowser(true)],["⌫","Recycle Bin",()=>{}]
   ].map(([g,n,f]:any)=><button className="icon" key={n} onDoubleClick={f}><b>{g}</b><span>{n}</span></button>)}
  </section>
  {open&&<div className="window player"><header><span>SONGBOX 2004</span><button onClick={()=>setOpen(false)}>×</button></header>
   <div className="now"><div className="art">{["✦","♫","☼","❀","◈"][selected%5]}</div><div><strong>{song.title}</strong><small>{song.film} · {song.year}</small></div></div>
   <div className="led">00:00 <span>{playing?"PLAY":"PAUSE"}</span></div>
   <div className="eq">{Array.from({length:18}).map((_,i)=><i className={playing?"dance":""} key={i}/>)}</div>
   <div className="controls"><button onClick={prev}>|◀</button><button onClick={()=>setPlaying(!playing)}>{playing?"❚❚":"▶"}</button><button onClick={next}>▶|</button></div>
   {song.videoId?<iframe ref={audio} className="youtube" src={`https://www.youtube.com/embed/${song.videoId}?enablejsapi=1&rel=0`} title={song.title} allow="autoplay; encrypted-media; picture-in-picture" />:<div className="missing">Official embeddable upload not verified for this track.</div>}
  </div>}
  <div className="window playlist"><header><span>PLAYLIST.TXT</span><button onClick={()=>setOpen(false)}>×</button></header><div className="rows">{songs.map((s,i)=><button key={i} className={i===selected?"row active":"row"} onClick={()=>{setSelected(i);setOpen(true)}}><em>{String(i+1).padStart(2,"0")}</em><span>{s.title}<small>{s.film}</small></span><b>{s.status==="verified"?"▶":"—"}</b></button>)}</div></div>
  {memory&&<div className="window modal"><header><span>Memories.txt</span><button onClick={()=>setMemory(false)}>×</button></header><p>Some nights were blue screens, tiny speakers and songs playing from the next room.</p><p>Clicking through folders felt like discovering little worlds.</p><p>Save your favorite song. Call someone. Stay up five more minutes.</p></div>}
  {browser&&<div className="window modal browser"><header><span>WebBox 2004</span><button onClick={()=>setBrowser(false)}>×</button></header><div className="address">http://www.webbox.local/</div><h2>Welcome to the old web.</h2><p>No feeds. No infinite scroll. Just a homepage and somewhere to go.</p></div>}
  <footer><button className="start" onClick={()=>setStart(!start)}>◆ start</button><div className="task">♫ {song.title}</div><div className="tray">● {listeners??"—"} · IST · {new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div></footer>
  {start&&<div className="startmenu"><strong>2004.exe</strong><p>Now Playing: {song.title}</p><p>Up Next: {songs[(selected+1)%songs.length].title}</p><button onClick={()=>setShutdown(true)}>Shut Down</button></div>}
 </main>
}