import { useState, useEffect } from "react";
 
const store = {
  async get(k) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  async set(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};
 
const DROUT = [
  { id: "a", name: "Día A", exercises: [{ name: "Sentadilla", sets: "4x8" }, { name: "Press banca", sets: "4x8" }, { name: "Remo", sets: "3x10" }] },
  { id: "b", name: "Día B", exercises: [{ name: "Peso muerto", sets: "4x6" }, { name: "Press hombro", sets: "4x8" }, { name: "Dominadas", sets: "3x8" }] },
  { id: "c", name: "Día C", exercises: [{ name: "Zancadas", sets: "3x12" }, { name: "Fondos", sets: "3x10" }, { name: "Curl bíceps", sets: "3x12" }] },
  { id: "free", name: "Libre", exercises: [] },
];
const ECAT = [{ id: "food", label: "Comida", emoji: "🍔" },{ id: "transport", label: "Transporte", emoji: "🚌" },{ id: "university", label: "Facultad", emoji: "🎓" },{ id: "leisure", label: "Ocio", emoji: "🎮" },{ id: "other", label: "Otros", emoji: "📦" }];
const PRI = { alta: "#ef4444", media: "#f59e0b", baja: "#22c55e" };
const td = () => new Date().toISOString().split("T")[0];
const fD = d => { try { return new Date(d+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short"}); } catch { return d; } };
const fM = n => n.toLocaleString("es-AR",{minimumFractionDigits:0});
const cM = () => new Date().toISOString().slice(0,7);
const wkD = () => { const n=new Date(),dy=n.getDay(),m=new Date(n); m.setDate(n.getDate()-(dy===0?6:dy-1)); return Array.from({length:7},(_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return d.toISOString().split("T")[0];}); };
const GTYPES = [{id:"gym",label:"Entrenamientos",emoji:"🏋️",unit:"sesiones"},{id:"expense_limit",label:"Límite gastos",emoji:"💸",unit:"$"},{id:"tasks_done",label:"Tareas hechas",emoji:"✅",unit:"tareas"},{id:"habit_pct",label:"% hábitos",emoji:"🔥",unit:"%"},{id:"custom",label:"Personalizado",emoji:"🎯",unit:""}];
const COLS = ["#38bdf8","#f97316","#a855f7","#22c55e","#eab308","#ef4444","#ec4899"];
 
const Ic = ({name,size=20}) => {
  const p={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"};
  const m = {
    gym: <svg {...p}><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/><path d="M6.5 12h11"/></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    wallet: <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    tasks: <svg {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    user: <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    home: <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    plus: <svg {...p}><path d="M12 5v14M5 12h14"/></svg>,
    trash: <svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
    check: <svg {...p} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    edit: <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trend: <svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    back: <svg {...p}><polyline points="15 18 9 12 15 6"/></svg>,
    chevron: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    chevD: <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    chevU: <svg {...p}><polyline points="18 15 12 9 6 15"/></svg>,
    clock: <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    ext: <svg {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    note: <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    filter: <svg {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    x: <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    flame: <svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    target: <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    book: <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  };
  return m[name] || null;
};
 
export default function App() {
  const [tab,setTab]=useState("dashboard"),[ld,setLd]=useState(false);
  const [gymLogs,setGymLogs]=useState([]),[routines,setRoutines]=useState(DROUT),[weightH,setWeightH]=useState([]);
  const [agendaEv,setAgendaEv]=useState([]),[expenses,setExpenses]=useState([]);
  const [tasks,setTasks]=useState([]),[taskF,setTaskF]=useState([{id:"personal",name:"Personal",emoji:"🙋",color:"#a78bfa"},{id:"trabajo",name:"Trabajo",emoji:"💼",color:"#38bdf8"}]);
  const [habits,setHabits]=useState([]),[habitL,setHabitL]=useState({});
  const [notes,setNotes]=useState([]),[noteF,setNoteF]=useState([{id:"general",name:"General",emoji:"📋",color:"#38bdf8"}]);
  const [goals,setGoals]=useState([]);
 
  useEffect(()=>{(async()=>{const k={gymLogs2:setGymLogs,routines2:setRoutines,weightHistory:setWeightH,agendaEvents:setAgendaEv,expenses:setExpenses,tasks2:setTasks,taskFolders:setTaskF,habits:setHabits,habitLogs:setHabitL,notes:setNotes,noteFolders:setNoteF,goals:setGoals};for(const[key,fn] of Object.entries(k)){const v=await store.get(key);if(v)fn(v);}setLd(true);})();},[]);
  const sv=(k,v)=>{if(ld)store.set(k,v);};
  useEffect(()=>{sv("gymLogs2",gymLogs);},[gymLogs,ld]); useEffect(()=>{sv("routines2",routines);},[routines,ld]); useEffect(()=>{sv("weightHistory",weightH);},[weightH,ld]); useEffect(()=>{sv("agendaEvents",agendaEv);},[agendaEv,ld]); useEffect(()=>{sv("expenses",expenses);},[expenses,ld]); useEffect(()=>{sv("tasks2",tasks);},[tasks,ld]); useEffect(()=>{sv("taskFolders",taskF);},[taskF,ld]); useEffect(()=>{sv("habits",habits);},[habits,ld]); useEffect(()=>{sv("habitLogs",habitL);},[habitL,ld]); useEffect(()=>{sv("notes",notes);},[notes,ld]); useEffect(()=>{sv("noteFolders",noteF);},[noteF,ld]); useEffect(()=>{sv("goals",goals);},[goals,ld]);
 
  const tabs=[{id:"dashboard",l:"Inicio",i:"home"},{id:"gym",l:"Gym",i:"gym"},{id:"agenda",l:"Agenda",i:"calendar"},{id:"expenses",l:"Gastos",i:"wallet"},{id:"tasks",l:"Tareas",i:"tasks"},{id:"profile",l:"Perfil",i:"user"}];
  if(!ld) return (<div style={{...S.pg,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100dvh"}}><span style={{color:"#334155",fontFamily:"monospace"}}>cargando...</span></div>);
 
  const P={gymLogs,setGymLogs,routines,setRoutines,weightH,setWeightH,agendaEv,setAgendaEv,expenses,setExpenses,tasks,setTasks,taskF,setTaskF,habits,setHabits,habitL,setHabitL,notes,setNotes,noteF,setNoteF,goals,setGoals,setTab};
  return (
    <div style={S.pg}><style>{CSS}</style>
    <div style={S.hdr}><span style={S.logo}>JOAQUIN<span style={{color:"#38bdf8"}}>APP</span></span><span style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{new Date().toLocaleDateString("es-AR",{weekday:"short",day:"numeric",month:"short"}).toUpperCase()}</span></div>
    <div style={S.tBar}>{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{...S.tBtn,...(tab===t.id?S.tAct:{})}} className="tb"><Ic name={t.i} size={18}/><span style={{fontSize:10,fontWeight:500}}>{t.l}</span></button>)}</div>
    <div style={S.ct}>{tab==="dashboard"?<Dash {...P}/>:tab==="gym"?<GymT {...P}/>:tab==="agenda"?<AgendaT {...P}/>:tab==="expenses"?<ExpT {...P}/>:tab==="tasks"?<TaskT {...P}/>:tab==="habits"?<HabT {...P}/>:tab==="notes"?<NoteT {...P}/>:tab==="goals"?<GoalT {...P}/>:<ProfT {...P}/>}</div>
    </div>
  );
}
 
function Dash({gymLogs,expenses,tasks,habits,habitL,agendaEv,goals,setTab}){
  const wk=wkD(),wG=gymLogs.filter(g=>wk.includes(g.date)).length,cm=cM(),mE=expenses.filter(e=>e.date?.startsWith(cm)).reduce((s,e)=>s+(e.amount||0),0);
  const pn=tasks.filter(t=>!t.done).length,ov=tasks.filter(t=>!t.done&&t.date&&t.date<td()).length;
  const tE=agendaEv.filter(e=>e.date===td()),hD=habits.filter(h=>habitL[td()]?.includes(h.id)).length,aG=goals.filter(g=>g.month===cm).length;
  const C=({emoji,label,value,sub,color,onClick})=> (<button onClick={onClick} style={{...S.cd,flex:1,minWidth:"45%",cursor:"pointer",textAlign:"left",padding:14}} className="lc"><div style={{fontSize:20,marginBottom:6}}>{emoji}</div><div style={{color:"#f1f5f9",fontSize:22,fontWeight:800,fontFamily:"monospace"}}>{value}</div><div style={{color:color||"#475569",fontSize:11,fontWeight:600,marginTop:2}}>{label}</div>{sub&&<div style={{color:"#334155",fontSize:10,marginTop:2}}>{sub}</div>}</button>);
  const dN=["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
  const weekData=wk.map((d,i)=>{
    const gym=gymLogs.filter(g=>g.date===d).length;
    const exp=expenses.filter(e=>e.date===d).reduce((s,e)=>s+(e.amount||0),0);
    const hab=habits.length>0?habits.filter(h=>habitL[d]?.includes(h.id)).length:0;
    const tsk=tasks.filter(t=>t.done&&t.folder).length>0?1:0;
    return {day:dN[i],gym,exp,hab,isToday:d===td(),date:d};
  });
  const maxHab=Math.max(habits.length,1);
  return (<div><div style={{...S.st,marginBottom:4}}>Buen día, Joaquín</div><div style={{color:"#475569",fontSize:13,marginBottom:18}}>Resumen de tu semana</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}><C emoji="🏋️" label="Gym esta semana" value={wG} onClick={()=>setTab("gym")}/><C emoji="💸" label="Gastos del mes" value={`$${fM(mE)}`} onClick={()=>setTab("expenses")}/><C emoji="📋" label="Tareas pendientes" value={pn} sub={ov>0?`${ov} vencida${ov>1?"s":""}`:undefined} color={ov>0?"#ef4444":"#475569"} onClick={()=>setTab("tasks")}/><C emoji="🔥" label="Hábitos hoy" value={`${hD}/${habits.length}`} onClick={()=>setTab("profile")}/></div>
    {/* Weekly Activity Chart */}
    <div style={{...S.cd,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Ic name="trend" size={14}/><span style={S.lb}>ACTIVIDAD SEMANAL</span></div>
      <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100}}>
        {weekData.map((d,i)=>{
          const gymH=d.gym*40;
          const habH=habits.length>0?(d.hab/maxHab)*60:0;
          const totalH=Math.max(gymH+habH,4);
          return (<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:80,gap:2}}>
              {d.gym>0&&<div style={{width:"100%",height:gymH,background:"#38bdf8",borderRadius:"4px 4px 0 0",minHeight:8,transition:"height 0.3s"}}/>}
              {d.hab>0&&<div style={{width:"100%",height:habH,background:"#f97316",borderRadius:d.gym>0?"0 0 4px 4px":"4px",minHeight:6,transition:"height 0.3s"}}/>}
              {d.gym===0&&d.hab===0&&<div style={{width:"100%",height:4,background:"#111f36",borderRadius:4,marginTop:"auto"}}/>}
            </div>
            <span style={{fontSize:10,fontFamily:"monospace",color:d.isToday?"#38bdf8":"#64748b",fontWeight:d.isToday?700:400}}>{d.day}</span>
          </div>);
        })}
      </div>
      <div style={{display:"flex",gap:16,marginTop:10,justifyContent:"center"}}>
        <span style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b"}}><span style={{width:8,height:8,borderRadius:2,background:"#38bdf8",display:"inline-block"}}/> Gym</span>
        <span style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b"}}><span style={{width:8,height:8,borderRadius:2,background:"#f97316",display:"inline-block"}}/> Hábitos</span>
      </div>
    </div>
    {tE.length>0&&<div style={{marginBottom:16}}><div style={{...S.lb,marginBottom:8}}>EVENTOS DE HOY</div>{tE.map(ev=> (<div key={ev.id} style={{...S.lc,borderLeft:"3px solid #38bdf8"}}><div style={{color:"#f1f5f9",fontSize:13,fontWeight:600}}>{ev.title}</div><div style={{color:"#64748b",fontSize:11,fontFamily:"monospace",marginTop:2}}>{ev.time}</div></div>))}</div>}
    {aG>0&&<button onClick={()=>setTab("profile")} style={{...S.gl,marginBottom:0}} className="gcl"><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>🎯</span><div><div style={{color:"#f1f5f9",fontWeight:600,fontSize:13}}>{aG} meta{aG>1?"s":""} activa{aG>1?"s":""}</div></div></div><Ic name="chevron" size={14}/></button>}
  </div>);
}
 
function GymT({gymLogs,setGymLogs,routines}){
  const [sf,setSf]=useState(false),[fm,setFm]=useState({date:td(),routine:routines[0]?.id||"a",notes:""}),[ex,setEx]=useState(null);
  const add=()=>{if(!fm.date)return;const r=routines.find(x=>x.id===fm.routine);setGymLogs(p=>[{...fm,id:Date.now(),exercises:r?r.exercises.map(e=>({...e})):[]}, ...p]);setFm({date:td(),routine:routines[0]?.id||"a",notes:""});setSf(false);};
  return (<div><div style={S.sh}><div><div style={S.st}>Entrenamiento</div><div style={S.ss}>{gymLogs.length} sesiones</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nuevo</button></div>
    {sf&&<div style={S.fc}><div style={S.ft}>Nueva sesión</div><div style={S.fg}><label style={S.lb}>Fecha</label><input style={S.ip} type="date" value={fm.date} onChange={e=>setFm(p=>({...p,date:e.target.value}))}/><label style={S.lb}>Rutina</label><select style={S.ip} value={fm.routine} onChange={e=>setFm(p=>({...p,routine:e.target.value}))}>{routines.map(r=> (<option key={r.id} value={r.id}>{r.name}</option>))}</select>
      {(()=>{const r=routines.find(x=>x.id===fm.routine);return r?.exercises.length>0? (<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{r.exercises.map((e,i)=> (<span key={i} style={{padding:"4px 10px",borderRadius:6,background:"#0a1628",border:"1px solid #1a2540",color:"#94a3b8",fontSize:12}}>{e.name} <span style={{color:"#38bdf8",fontSize:10}}>{e.sets}</span></span>))}</div>):null;})()}
      <label style={S.lb}>Notas</label><textarea style={{...S.ip,minHeight:80,resize:"vertical"}} placeholder="Series, reps, sensaciones..." value={fm.notes} onChange={e=>setFm(p=>({...p,notes:e.target.value}))}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Guardar</button></div></div>}
    {gymLogs.length===0&&!sf&&<div style={S.em}>Sin registros. ¡A entrenar! 💪</div>}
    {gymLogs.map(log=>{const r=routines.find(x=>x.id===log.routine),isO=ex===log.id,exs=log.exercises||r?.exercises||[];
      return (<div key={log.id}><div style={{...S.lc,cursor:"pointer",borderLeft:"3px solid #1e3a5f"}} className="lc" onClick={()=>setEx(isO?null:log.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><span style={{...S.tg,color:"#38bdf8",border:"1px solid #1e3a5f",background:"#0a1f3a"}}>{r?.name||log.routine}</span><span style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{fD(log.date)}</span></div>{log.notes&&!isO&&<div style={{color:"#64748b",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260}}>{log.notes}</div>}</div><span style={{color:"#334155"}}><Ic name={isO?"chevU":"chevD"} size={16}/></span></div></div>
        {isO&&<div style={{background:"#0a1220",border:"1px solid #1e3a5f",borderTop:"none",borderRadius:"0 0 12px 12px",marginTop:-8,marginBottom:8,padding:16}}>
          {exs.length>0&&<div style={{marginBottom:log.notes?14:0}}><div style={{...S.lb,marginBottom:10}}>EJERCICIOS</div>{exs.map((e,i)=> (<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:"#060b14",border:"1px solid #111f36",borderRadius:8,marginBottom:6}}><span style={{color:"#cbd5e1",fontSize:14}}>{e.name}</span><span style={{color:"#38bdf8",fontSize:13,fontFamily:"monospace",background:"#0a1f3a",padding:"3px 10px",borderRadius:6,fontWeight:600}}>{e.sets}</span></div>))}</div>}
          {log.notes&&<div><div style={{...S.lb,marginBottom:8}}>NOTAS</div><div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",background:"#060b14",border:"1px solid #111f36",borderRadius:8,padding:12}}>{log.notes}</div></div>}
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><button onClick={e=>{e.stopPropagation();setGymLogs(p=>p.filter(x=>x.id!==log.id));setEx(null);}} style={{...S.cn,color:"#ef4444",fontSize:12,padding:"8px 14px"}} className="cn"><Ic name="trash" size={13}/> Eliminar</button></div>
        </div>}</div>);})}
  </div>);
}
 
function AgendaT({agendaEv:events,setAgendaEv:setEvents}){
  const [sf,setSf]=useState(false),[fm,setFm]=useState({title:"",date:td(),time:"09:00",desc:""});
  const add=()=>{if(!fm.title.trim())return;setEvents(p=>[...p,{...fm,id:Date.now()}].sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1));setFm({title:"",date:td(),time:"09:00",desc:""});setSf(false);};
  const up=events.filter(e=>e.date>=td()),pa=events.filter(e=>e.date<td());
  return (<div><div style={S.sh}><div><div style={S.st}>Agenda</div><div style={S.ss}>{up.length} próximos</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nuevo</button></div>
    <a href="https://calendar.google.com/calendar/u/0/r/agenda" target="_blank" rel="noopener noreferrer" style={S.gl} className="gcl"><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>📅</span><div><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14}}>Google Calendar</div><div style={{color:"#475569",fontSize:11,marginTop:2}}>Abrir mi agenda</div></div></div><Ic name="ext" size={16}/></a>
    {sf&&<div style={S.fc}><div style={S.ft}>Nuevo evento</div><div style={S.fg}><label style={S.lb}>Título</label><input style={S.ip} placeholder="Ej: Parcial" value={fm.title} onChange={e=>setFm(p=>({...p,title:e.target.value}))}/><div style={{display:"flex",gap:10}}><div style={{flex:1}}><label style={S.lb}>Fecha</label><input style={{...S.ip,marginTop:5}} type="date" value={fm.date} onChange={e=>setFm(p=>({...p,date:e.target.value}))}/></div><div style={{flex:1}}><label style={S.lb}>Hora</label><input style={{...S.ip,marginTop:5}} type="time" value={fm.time} onChange={e=>setFm(p=>({...p,time:e.target.value}))}/></div></div><label style={S.lb}>Descripción</label><textarea style={{...S.ip,minHeight:50,resize:"vertical"}} value={fm.desc} onChange={e=>setFm(p=>({...p,desc:e.target.value}))}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Guardar</button></div></div>}
    {up.length===0&&pa.length===0&&!sf&&<div style={S.em}>Sin eventos 📅</div>}
    {up.map(ev=> (<div key={ev.id} style={{...S.lc,borderLeft:"3px solid #38bdf8"}} className="lc"><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14,marginBottom:4}}>{ev.title}</div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:"#64748b",fontSize:12,fontFamily:"monospace",display:"flex",alignItems:"center",gap:4}}><Ic name="clock" size={12}/>{fD(ev.date)} · {ev.time}</span>{ev.date===td()&&<span style={{...S.tg,color:"#22c55e",border:"1px solid #14532d",background:"#052e16",fontSize:9}}>HOY</span>}</div>{ev.desc&&<div style={{color:"#94a3b8",fontSize:12,marginTop:6}}>{ev.desc}</div>}</div><button onClick={()=>setEvents(p=>p.filter(x=>x.id!==ev.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div>))}
    {pa.length>0&&<><div style={S.dl}>PASADOS</div>{pa.map(ev=> (<div key={ev.id} style={{...S.lc,opacity:.4}} className="lc"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{color:"#cbd5e1",fontSize:13}}>{ev.title}</div><div style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{fD(ev.date)}</div></div><button onClick={()=>setEvents(p=>p.filter(x=>x.id!==ev.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div>))}</>}
  </div>);
}
 
function ExpT({expenses,setExpenses}){
  const [sf,setSf]=useState(false),[fm,setFm]=useState({date:td(),amount:"",category:"food",desc:""}),[fC,setFC]=useState(null);
  const add=()=>{if(!fm.amount)return;setExpenses(p=>[{...fm,id:Date.now(),amount:parseFloat(fm.amount),desc:fm.desc||ECAT.find(c=>c.id===fm.category)?.label||""},...p]);setFm({date:td(),amount:"",category:"food",desc:""});setSf(false);};
  const cm=cM(),mE=expenses.filter(e=>e.date?.startsWith(cm)),mT=mE.reduce((s,e)=>s+(e.amount||0),0);
  const bC=ECAT.map(c=>({...c,total:mE.filter(e=>e.category===c.id).reduce((s,e)=>s+(e.amount||0),0)})).filter(c=>c.total>0);
  const fil=fC?expenses.filter(e=>e.category===fC):expenses,fT=fil.reduce((s,e)=>s+(e.amount||0),0),fl=fC?ECAT.find(c=>c.id===fC):null;
  return (<div><div style={S.sh}><div><div style={S.st}>Gastos</div><div style={S.ss}>{expenses.length} registros</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nuevo</button></div>
    <div style={{...S.cd,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={S.lb}>ESTE MES</div><div style={{color:"#f1f5f9",fontSize:28,fontWeight:800,fontFamily:"monospace",marginTop:4}}>${fM(mT)}</div></div>{bC.length>0&&<div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>{bC.map(c=> (<span key={c.id} style={{color:"#94a3b8",fontSize:11}}>{c.emoji} ${fM(c.total)}</span>))}</div>}</div>
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2,alignItems:"center"}}><Ic name="filter" size={14}/><button onClick={()=>setFC(null)} style={{...S.fl,fontSize:12,padding:"8px 12px",...(!fC?{background:"#0d1a30",borderColor:"#1e3a5f",color:"#38bdf8"}:{})}} className="fb">Todos</button>{ECAT.map(c=> (<button key={c.id} onClick={()=>setFC(fC===c.id?null:c.id)} style={{...S.fl,fontSize:12,padding:"8px 12px",...(fC===c.id?{background:"#0d1a30",borderColor:"#1e3a5f",color:"#38bdf8"}:{})}} className="fb">{c.emoji} {c.label}</button>))}</div>
    {fC&&fl&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:10,padding:"10px 14px",marginBottom:12}}><span style={{color:"#cbd5e1",fontSize:13}}>{fl.emoji} {fl.label}: <strong style={{color:"#f1f5f9",fontFamily:"monospace"}}>${fM(fT)}</strong></span><button onClick={()=>setFC(null)} style={{...S.ib,color:"#64748b"}} className="ib"><Ic name="x" size={14}/></button></div>}
    {sf&&<div style={S.fc}><div style={S.ft}>Nuevo gasto</div><div style={S.fg}><label style={S.lb}>Fecha</label><input style={S.ip} type="date" value={fm.date} onChange={e=>setFm(p=>({...p,date:e.target.value}))}/><label style={S.lb}>Monto ($)</label><input style={S.ip} type="number" inputMode="numeric" placeholder="2500" value={fm.amount} onChange={e=>setFm(p=>({...p,amount:e.target.value}))}/><label style={S.lb}>Categoría</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{ECAT.map(c=> (<button key={c.id} onClick={()=>setFm(p=>({...p,category:c.id}))} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:12,border:"1px solid #111f36",background:"transparent",color:"#475569",cursor:"pointer",minWidth:60,...(fm.category===c.id?{background:"#0d1a30",borderColor:"#38bdf8",color:"#38bdf8"}:{})}} className="fb"><span style={{fontSize:18}}>{c.emoji}</span><span style={{fontSize:11}}>{c.label}</span></button>))}</div><label style={S.lb}>Descripción</label><input style={S.ip} placeholder="Ej: Almuerzo" value={fm.desc} onChange={e=>setFm(p=>({...p,desc:e.target.value}))}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Guardar</button></div></div>}
    {fil.length===0&&!sf&&<div style={S.em}>{fC?"Sin gastos en esta categoría":"Sin gastos 💰"}</div>}
    {fil.map(e=>{const c=ECAT.find(x=>x.id===e.category);return (<div key={e.id} style={S.lc} className="lc"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:24}}>{c?.emoji||"📦"}</span><div><div style={{color:"#cbd5e1",fontSize:14}}>{e.desc||c?.label}</div><div style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{fD(e.date)}</div></div></div><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:"#f1f5f9",fontWeight:700,fontSize:15,fontFamily:"monospace"}}>${fM(e.amount||0)}</span><button onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div></div>);})}
  </div>);
}
 
function TaskT({tasks,setTasks,taskF}){
  const [af,setAf]=useState(taskF[0]?.id||"personal"),[sf,setSf]=useState(false),[fm,setFm]=useState({text:"",priority:"media",date:"",hasDate:false}),[eN,setEN]=useState(null),[nT,setNT]=useState("");
  const fol=taskF.find(f=>f.id===af)||taskF[0],ft=tasks.filter(t=>t.folder===af),pen=ft.filter(t=>!t.done),don=ft.filter(t=>t.done);
  const tog=id=>setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const add=()=>{if(!fm.text.trim())return;setTasks(p=>[{text:fm.text,priority:fm.priority,date:fm.hasDate?fm.date:"",notes:"",id:Date.now(),done:false,folder:af},...p]);setFm({text:"",priority:"media",date:"",hasDate:false});setSf(false);};
  const svN=id=>{setTasks(p=>p.map(t=>t.id===id?{...t,notes:nT}:t));setEN(null);};
  const Tk=({task:t,isDone:d})=> (<div style={{...S.lc,borderLeft:`3px solid ${d?"#22c55e33":(PRI[t.priority]||"#334155")}`,opacity:d?.35:1}} className="lc"><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{display:"flex",gap:12,alignItems:"flex-start",flex:1}}><button onClick={()=>tog(t.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:1,cursor:"pointer",border:d?"2px solid #22c55e":`2px solid ${PRI[t.priority]||"#334155"}`,background:d?"#22c55e18":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#22c55e"}}>{d&&<Ic name="check" size={12}/>}</button><div style={{flex:1}}><span style={{color:d?"#475569":"#cbd5e1",fontSize:14,textDecoration:d?"line-through":"none"}}>{t.text}</span>{t.date&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:4,color:t.date<td()&&!d?"#ef4444":"#64748b",fontSize:11,fontFamily:"monospace"}}><Ic name="calendar" size={10}/> {fD(t.date)}{t.date===td()&&!d&&<span style={{...S.tg,color:"#22c55e",border:"1px solid #14532d",background:"#052e16",fontSize:8,marginLeft:4}}>HOY</span>}{t.date<td()&&!d&&<span style={{...S.tg,color:"#ef4444",border:"1px solid #7f1d1d",background:"#1c0a0a",fontSize:8,marginLeft:4}}>VENCIDA</span>}</div>}{t.notes&&eN!==t.id&&<div style={{color:"#64748b",fontSize:12,marginTop:6,background:"#060b14",border:"1px solid #111f36",borderRadius:6,padding:"6px 10px"}}>{t.notes}</div>}{eN===t.id&&<div style={{marginTop:8}}><textarea style={{...S.ip,minHeight:60,resize:"vertical",fontSize:14}} placeholder="Notas..." value={nT} onChange={e=>setNT(e.target.value)} autoFocus/><div style={{display:"flex",gap:6,marginTop:6,justifyContent:"flex-end"}}><button onClick={()=>setEN(null)} style={{...S.cn,padding:"6px 12px",fontSize:12}} className="cn">Cancelar</button><button onClick={()=>svN(t.id)} style={{...S.sv,padding:"6px 12px",fontSize:12}} className="sv">Guardar</button></div></div>}</div></div><div style={{display:"flex",gap:2,flexShrink:0,marginLeft:6}}>{!d&&<button onClick={()=>{setEN(eN===t.id?null:t.id);setNT(t.notes||"");}} style={{...S.ib,color:t.notes?"#38bdf8":"#334155"}} className="ib"><Ic name="note" size={14}/></button>}<button onClick={()=>setTasks(p=>p.filter(x=>x.id!==t.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div></div>);
  return (<div><div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:2}}>{taskF.map(f=> (<button key={f.id} onClick={()=>setAf(f.id)} style={{...S.fl,...(af===f.id?{background:f.color+"18",border:`1px solid ${f.color}55`,color:f.color}:{})}} className="fb">{f.emoji} {f.name}</button>))}</div>
    <div style={S.sh}><div><div style={S.st}>{fol?.emoji} {fol?.name}</div><div style={S.ss}>{pen.length} pendientes · {don.length} completadas</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nueva</button></div>
    {sf&&<div style={S.fc}><div style={S.ft}>Nueva tarea</div><div style={S.fg}><label style={S.lb}>Tarea</label><input style={S.ip} placeholder="Ej: Entregar TP" value={fm.text} onChange={e=>setFm(p=>({...p,text:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add()}/><label style={S.lb}>Prioridad</label><div style={{display:"flex",gap:8}}>{Object.keys(PRI).map(p=> (<button key={p} onClick={()=>setFm(r=>({...r,priority:p}))} style={{...S.fl,flex:1,justifyContent:"center",textTransform:"capitalize",...(fm.priority===p?{background:PRI[p]+"18",borderColor:PRI[p]+"55",color:PRI[p]}:{})}} className="fb">{p}</button>))}</div><div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setFm(p=>({...p,hasDate:!p.hasDate,date:!p.hasDate?td():""}))} style={{...S.fl,gap:6,...(fm.hasDate?{background:"#0d1a30",borderColor:"#1e3a5f",color:"#38bdf8"}:{})}} className="fb"><Ic name="calendar" size={14}/> {fm.hasDate?"Con fecha":"Agregar fecha"}</button>{fm.hasDate&&<input style={{...S.ip,flex:1}} type="date" value={fm.date} onChange={e=>setFm(p=>({...p,date:e.target.value}))}/>}</div></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Guardar</button></div></div>}
    {ft.length===0&&!sf&&<div style={S.em}>Sin tareas acá. ¡Crack! 😎</div>}
    {pen.map(t=> (<Tk key={t.id} task={t} isDone={false}/>))}{don.length>0&&<><div style={S.dl}>COMPLETADAS</div>{don.map(t=> (<Tk key={t.id} task={t} isDone={true}/>))}</>}
  </div>);
}
 
function HabT({habits,setHabits,habitL,setHabitL}){
  const [sf,setSf]=useState(false),[fm,setFm]=useState({name:"",emoji:"💧"});
  const wk=wkD(),dN=["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
  const togD=(h,d)=>setHabitL(p=>{const dl=p[d]||[];return{...p,[d]:dl.includes(h)?dl.filter(x=>x!==h):[...dl,h]};});
  const str=h=>{let s=0;const d=new Date();while(true){const ds=d.toISOString().split("T")[0];if(habitL[ds]?.includes(h)){s++;d.setDate(d.getDate()-1);}else break;}return s;};
  const wP=h=>Math.round((wk.filter(d=>habitL[d]?.includes(h)).length/7)*100);
  const add=()=>{if(!fm.name.trim())return;setHabits(p=>[...p,{id:"h"+Date.now(),name:fm.name.trim(),emoji:fm.emoji||"✅"}]);setFm({name:"",emoji:"💧"});setSf(false);};
  return (<div><div style={S.sh}><div><div style={S.st}>Hábitos</div><div style={S.ss}>{habits.length} activos</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nuevo</button></div>
    {sf&&<div style={S.fc}><div style={S.ft}>Nuevo hábito</div><div style={S.fg}><label style={S.lb}>Nombre</label><input style={S.ip} placeholder="Ej: Tomar 2L de agua" value={fm.name} onChange={e=>setFm(p=>({...p,name:e.target.value}))}/><label style={S.lb}>Emoji</label><input style={{...S.ip,fontSize:24,textAlign:"center",maxWidth:80}} value={fm.emoji} onChange={e=>setFm(p=>({...p,emoji:e.target.value}))} maxLength={2}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Crear</button></div></div>}
    {habits.length===0&&!sf&&<div style={S.em}>Sin hábitos. ¡Creá uno! 🔥</div>}
    {habits.length>0&&<div style={{display:"flex",gap:0,marginBottom:6,paddingLeft:56}}>{wk.map((d,i)=> (<div key={d} style={{flex:1,textAlign:"center",fontSize:11,fontFamily:"monospace",color:d===td()?"#38bdf8":"#94a3b8",fontWeight:d===td()?700:500}}>{dN[i]}</div>))}</div>}
    {habits.map(h=>{const st=str(h.id),pc=wP(h.id);return (<div key={h.id} style={{...S.lc,padding:12}} className="lc">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:20,width:28,textAlign:"center"}}>{h.emoji}</span><div style={{flex:1}}><div style={{color:"#cbd5e1",fontSize:13,fontWeight:500}}>{h.name}</div><div style={{display:"flex",gap:10,marginTop:2}}>{st>0&&<span style={{color:"#f97316",fontSize:10,fontFamily:"monospace",display:"flex",alignItems:"center",gap:3}}><Ic name="flame" size={10}/> {st} día{st>1?"s":""}</span>}<span style={{color:"#475569",fontSize:10,fontFamily:"monospace"}}>{pc}% semanal</span></div></div><button onClick={()=>setHabits(p=>p.filter(x=>x.id!==h.id))} style={{...S.ib,padding:4}} className="ib"><Ic name="trash" size={12}/></button></div>
      <div style={{display:"flex",gap:4,paddingLeft:28}}>{wk.map(d=>{const dn=habitL[d]?.includes(h.id),isT=d===td(),isF=d>td();return (<button key={d} onClick={()=>!isF&&togD(h.id,d)} style={{flex:1,height:36,borderRadius:8,border:dn?"2px solid #22c55e":isT?"2px solid #38bdf8":"1.5px solid #1e3a5f",background:dn?"#22c55e18":isT?"#0d1a30":"#0c1424",cursor:isF?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:dn?"#22c55e":"#1e293b",opacity:isF?.25:1}} className="fb">{dn&&<Ic name="check" size={14}/>}</button>);})}</div>
    </div>);})}
  </div>);
}
 
function NoteT({notes,setNotes,noteF}){
  const [af,setAf]=useState(noteF[0]?.id||"general"),[sf,setSf]=useState(false),[fm,setFm]=useState({title:"",content:""}),[ed,setEd]=useState(null),[eF,setEF]=useState({title:"",content:""});
  const fol=noteF.find(f=>f.id===af)||noteF[0],fn=notes.filter(n=>n.folder===af);
  const add=()=>{if(!fm.title.trim()&&!fm.content.trim())return;setNotes(p=>[{...fm,id:Date.now(),folder:af,date:td(),title:fm.title||"Sin título"},...p]);setFm({title:"",content:""});setSf(false);};
  const svE=()=>{setNotes(p=>p.map(n=>n.id===ed?{...n,title:eF.title,content:eF.content}:n));setEd(null);};
  return (<div><div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:2}}>{noteF.map(f=> (<button key={f.id} onClick={()=>setAf(f.id)} style={{...S.fl,...(af===f.id?{background:f.color+"18",border:`1px solid ${f.color}55`,color:f.color}:{})}} className="fb">{f.emoji} {f.name}</button>))}</div>
    <div style={S.sh}><div><div style={S.st}>{fol?.emoji} {fol?.name}</div><div style={S.ss}>{fn.length} notas</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nueva</button></div>
    {sf&&<div style={S.fc}><div style={S.ft}>Nueva nota</div><div style={S.fg}><label style={S.lb}>Título</label><input style={S.ip} placeholder="Ej: Resumen Física" value={fm.title} onChange={e=>setFm(p=>({...p,title:e.target.value}))}/><label style={S.lb}>Contenido</label><textarea style={{...S.ip,minHeight:120,resize:"vertical"}} placeholder="Escribí acá..." value={fm.content} onChange={e=>setFm(p=>({...p,content:e.target.value}))}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Guardar</button></div></div>}
    {fn.length===0&&!sf&&<div style={S.em}>Sin notas 📝</div>}
    {fn.map(n=> (<div key={n.id} style={S.lc} className="lc">{ed===n.id? (<div><input style={{...S.ip,fontWeight:700,marginBottom:8}} value={eF.title} onChange={e=>setEF(p=>({...p,title:e.target.value}))}/><textarea style={{...S.ip,minHeight:100,resize:"vertical",marginBottom:8}} value={eF.content} onChange={e=>setEF(p=>({...p,content:e.target.value}))}/><div style={{display:"flex",gap:6,justifyContent:"flex-end"}}><button onClick={()=>setEd(null)} style={{...S.cn,padding:"6px 12px",fontSize:12}} className="cn">Cancelar</button><button onClick={svE} style={{...S.sv,padding:"6px 12px",fontSize:12}} className="sv">Guardar</button></div></div>): (<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14,marginBottom:4}}>{n.title}</div><div style={{color:"#475569",fontSize:10,fontFamily:"monospace",marginBottom:8}}>{fD(n.date)}</div>{n.content&&<div style={{color:"#94a3b8",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{n.content}</div>}</div><div style={{display:"flex",gap:2,flexShrink:0,marginLeft:8}}><button onClick={()=>{setEd(n.id);setEF({title:n.title,content:n.content});}} style={{...S.ib,color:"#475569"}} className="ib"><Ic name="edit" size={14}/></button><button onClick={()=>setNotes(p=>p.filter(x=>x.id!==n.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div>)}</div>))}
  </div>);
}
 
function GoalT({goals,setGoals,gymLogs,expenses,tasks,habits,habitL}){
  const [sf,setSf]=useState(false);const cm=cM();const [fm,setFm]=useState({name:"",type:"custom",target:"",month:cm});
  const prog=g=>{const m=g.month,tg=parseFloat(g.target)||0;if(tg===0)return {c:0,p:0};let c=0;if(g.type==="gym")c=gymLogs.filter(x=>x.date?.startsWith(m)).length;else if(g.type==="expense_limit")c=expenses.filter(x=>x.date?.startsWith(m)).reduce((s,e)=>s+(e.amount||0),0);else if(g.type==="tasks_done")c=tasks.filter(t=>t.done).length;else if(g.type==="habit_pct"){const dm=new Date(parseInt(m.slice(0,4)),parseInt(m.slice(5,7)),0).getDate(),tp=habits.length*dm;if(tp>0){let td2=0;for(let d=1;d<=dm;d++)td2+=((habitL[`${m}-${String(d).padStart(2,"0")}`])||[]).length;c=Math.round((td2/tp)*100);}}else c=parseFloat(g.current||0);return {c,p:Math.min(Math.round((c/tg)*100),100)};};
  const add=()=>{if(!fm.name.trim()||!fm.target)return;setGoals(p=>[...p,{...fm,id:"g"+Date.now(),current:0}]);setFm({name:"",type:"custom",target:"",month:cm});setSf(false);};
  const mG=goals.filter(g=>g.month===cm),pG=goals.filter(g=>g.month!==cm);
  const mL=new Date(cm+"-15").toLocaleDateString("es-AR",{month:"long",year:"numeric"});
  return (<div><div style={S.sh}><div><div style={S.st}>Metas</div><div style={{...S.ss,textTransform:"capitalize"}}>{mL}</div></div><button onClick={()=>setSf(true)} style={S.ab} className="ab"><Ic name="plus" size={16}/> Nueva</button></div>
    {sf&&<div style={S.fc}><div style={S.ft}>Nueva meta</div><div style={S.fg}><label style={S.lb}>Nombre</label><input style={S.ip} placeholder="Ej: Entrenar 12 veces" value={fm.name} onChange={e=>setFm(p=>({...p,name:e.target.value}))}/><label style={S.lb}>Tipo</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{GTYPES.map(t=> (<button key={t.id} onClick={()=>setFm(p=>({...p,type:t.id}))} style={{...S.fl,fontSize:11,padding:"8px 10px",...(fm.type===t.id?{background:"#0d1a30",borderColor:"#1e3a5f",color:"#38bdf8"}:{})}} className="fb">{t.emoji} {t.label}</button>))}</div><label style={S.lb}>Objetivo ({GTYPES.find(t=>t.id===fm.type)?.unit||"valor"})</label><input style={S.ip} type="number" inputMode="numeric" placeholder="12" value={fm.target} onChange={e=>setFm(p=>({...p,target:e.target.value}))}/><label style={S.lb}>Mes</label><input style={S.ip} type="month" value={fm.month} onChange={e=>setFm(p=>({...p,month:e.target.value}))}/></div><div style={S.fa}><button onClick={()=>setSf(false)} style={S.cn} className="cn">Cancelar</button><button onClick={add} style={S.sv} className="sv">Crear</button></div></div>}
    {mG.length===0&&!sf&&<div style={S.em}>Sin metas para este mes 🎯</div>}
    {mG.map(g=>{const gt=GTYPES.find(t=>t.id===g.type),{c,p}=prog(g),isE=g.type==="expense_limit",isO=isE&&c>parseFloat(g.target),bc=isO?"#ef4444":p>=100?"#22c55e":"#38bdf8";
      return (<div key={g.id} style={S.cd}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22}}>{gt?.emoji||"🎯"}</span><div><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14}}>{g.name}</div><div style={{color:"#475569",fontSize:11,fontFamily:"monospace",marginTop:2}}>{isE?`$${fM(c)} / $${fM(parseFloat(g.target))}`:`${c} / ${g.target} ${gt?.unit||""}`}</div></div></div><div style={{display:"flex",gap:6}}>{g.type==="custom"&&<button onClick={()=>setGoals(p=>p.map(x=>x.id===g.id?{...x,current:(parseFloat(x.current)||0)+1}:x))} style={{...S.ib,color:"#38bdf8"}} className="ib"><Ic name="plus" size={14}/></button>}<button onClick={()=>setGoals(p=>p.filter(x=>x.id!==g.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:8,background:"#111f36",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(p,100)}%`,background:bc,borderRadius:4,transition:"width 0.3s"}}/></div><span style={{color:bc,fontSize:13,fontWeight:700,fontFamily:"monospace",minWidth:40,textAlign:"right"}}>{p}%</span></div>
      {p>=100&&!isO&&<div style={{color:"#22c55e",fontSize:11,marginTop:6,fontWeight:600}}>🎉 ¡Meta cumplida!</div>}{isO&&<div style={{color:"#ef4444",fontSize:11,marginTop:6,fontWeight:600}}>⚠️ Excediste el límite</div>}</div>);})}
    {pG.length>0&&<><div style={S.dl}>ANTERIORES</div>{pG.map(g=>{const gt=GTYPES.find(t=>t.id===g.type),{p}=prog(g);return (<div key={g.id} style={{...S.lc,opacity:.5}} className="lc"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span>{gt?.emoji}</span><div><div style={{color:"#cbd5e1",fontSize:13}}>{g.name}</div><div style={{color:"#475569",fontSize:10,fontFamily:"monospace"}}>{g.month} · {p}%</div></div></div><button onClick={()=>setGoals(p2=>p2.filter(x=>x.id!==g.id))} style={S.ib} className="ib"><Ic name="trash" size={12}/></button></div></div>);})}</>}
  </div>);
}
 
function ProfT({routines,setRoutines,weightH,setWeightH,taskF,setTaskF,noteF,setNoteF,habits,setHabits,habitL,setHabitL,notes,setNotes,goals,setGoals,gymLogs,expenses,tasks,setTab}){
  const [sec,setSec]=useState(null),[eR,setER]=useState(null),[nEN,setNEN]=useState(""),[nES,setNES]=useState("3x10"),[wF,setWF]=useState({date:td(),weight:""}),[nfN,setNfN]=useState(""),[nfE,setNfE]=useState("📁"),[nfC,setNfC]=useState("#38bdf8");
  if(sec==="habits") return (<div><button onClick={()=>setSec(null)} style={S.bk} className="cn"><Ic name="back" size={14}/> Perfil</button><HabT habits={habits} setHabits={setHabits} habitL={habitL} setHabitL={setHabitL}/></div>);
  if(sec==="notesView") return (<div><button onClick={()=>setSec(null)} style={S.bk} className="cn"><Ic name="back" size={14}/> Perfil</button><NoteT notes={notes} setNotes={setNotes} noteF={noteF}/></div>);
  if(sec==="goals") return (<div><button onClick={()=>setSec(null)} style={S.bk} className="cn"><Ic name="back" size={14}/> Perfil</button><GoalT goals={goals} setGoals={setGoals} gymLogs={gymLogs} expenses={expenses} tasks={tasks} habits={habits} habitL={habitL}/></div>);
  if(!sec) return (<div><div style={{...S.st,marginBottom:18}}>Perfil</div>{[{id:"gym",icon:"gym",label:"Gimnasio",sub:"Peso, rutinas y ejercicios",color:"#38bdf8"},{id:"habits",icon:"flame",label:"Hábitos",sub:"Trackear hábitos diarios",color:"#f97316"},{id:"notesView",icon:"book",label:"Notas",sub:"Apuntes y anotaciones",color:"#22c55e"},{id:"goals",icon:"target",label:"Metas mensuales",sub:"Objetivos con progreso",color:"#eab308"},{id:"tasks",icon:"tasks",label:"Secciones tareas",sub:"Crear carpetas",color:"#a78bfa"},{id:"notesFolders",icon:"book",label:"Carpetas de notas",sub:"Organizar carpetas",color:"#22c55e"}].map(i=> (<button key={i.id} onClick={()=>setSec(i.id)} style={{...S.pc,borderLeft:`3px solid ${i.color}`}} className="lc"><div style={{display:"flex",alignItems:"center",gap:14}}><span style={{color:i.color}}><Ic name={i.icon} size={20}/></span><div style={{flex:1,textAlign:"left"}}><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14}}>{i.label}</div><div style={{color:"#475569",fontSize:12,marginTop:2}}>{i.sub}</div></div><span style={{color:"#334155"}}><Ic name="chevron" size={16}/></span></div></button>))}</div>);
  if(sec==="gym") return (<div>
    <button onClick={()=>{setSec(null);setER(null);}} style={S.bk} className="cn"><Ic name="back" size={14}/> Volver</button>
    <div style={{...S.st,marginTop:16,marginBottom:10}}>Peso corporal</div>
    {weightH.length>1&&<div style={{...S.cd,marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><Ic name="trend" size={14}/><span style={S.lb}>EVOLUCIÓN</span></div><WC data={weightH.slice(-10)}/></div>}
    <div style={{...S.fc,marginBottom:20}}><div style={S.ft}>Registrar peso</div><div style={{display:"flex",gap:10,alignItems:"flex-end"}}><div style={{flex:1}}><label style={S.lb}>Fecha</label><input style={{...S.ip,marginTop:5}} type="date" value={wF.date} onChange={e=>setWF(p=>({...p,date:e.target.value}))}/></div><div style={{flex:1}}><label style={S.lb}>Kg</label><input style={{...S.ip,marginTop:5}} type="number" inputMode="decimal" placeholder="78.5" value={wF.weight} onChange={e=>setWF(p=>({...p,weight:e.target.value}))}/></div><button onClick={()=>{if(!wF.weight)return;setWeightH(p=>[...p.filter(w=>w.date!==wF.date),{date:wF.date,weight:parseFloat(wF.weight)}].sort((a,b)=>a.date.localeCompare(b.date)));setWF({date:td(),weight:""});}} style={{...S.sv,height:44,flexShrink:0}} className="sv"><Ic name="plus" size={14}/></button></div>
      {weightH.length>0&&<div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6}}>{weightH.slice(-8).map(w=> (<div key={w.date} style={{display:"flex",alignItems:"center",gap:6,background:"#060b14",border:"1px solid #111f36",borderRadius:8,padding:"6px 10px"}}><span style={{color:"#f1f5f9",fontWeight:700,fontSize:13,fontFamily:"monospace"}}>{w.weight}kg</span><span style={{color:"#475569",fontSize:10}}>{fD(w.date)}</span><button onClick={()=>setWeightH(p=>p.filter(x=>x.date!==w.date))} style={{...S.ib,padding:2,minWidth:24,minHeight:24}} className="ib"><Ic name="trash" size={10}/></button></div>))}</div>}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={S.st}>Mis Rutinas</div><button onClick={()=>setRoutines(p=>[...p,{id:"r"+Date.now(),name:"Nueva rutina",exercises:[]}])} style={S.ab} className="ab"><Ic name="plus" size={14}/> Nueva</button></div>
    {routines.map(r=> (<div key={r.id} style={S.cd}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><input style={{...S.ip,flex:1,fontWeight:700,color:"#38bdf8"}} value={r.name} onChange={e=>setRoutines(p=>p.map(x=>x.id===r.id?{...x,name:e.target.value}:x))}/><button onClick={()=>setER(eR===r.id?null:r.id)} style={{...S.ib,color:eR===r.id?"#38bdf8":"#475569"}} className="ib"><Ic name="edit" size={15}/></button><button onClick={()=>{setRoutines(p=>p.filter(x=>x.id!==r.id));if(eR===r.id)setER(null);}} style={S.ib} className="ib"><Ic name="trash" size={15}/></button></div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{r.exercises.length===0&&<span style={{color:"#334155",fontSize:12}}>Sin ejercicios</span>}{r.exercises.map((ex,i)=> (<div key={i} style={{display:"flex",justifyContent:"space-between",background:"#060b14",border:"1px solid #111f36",borderRadius:8,padding:"8px 12px"}}><div style={{display:"flex",gap:8}}><span style={{color:"#cbd5e1",fontSize:13}}>{ex.name}</span><span style={{color:"#38bdf8",fontSize:11,fontFamily:"monospace",background:"#0a1f3a",padding:"2px 6px",borderRadius:4}}>{ex.sets}</span></div>{eR===r.id&&<button onClick={()=>setRoutines(p=>p.map(x=>x.id===r.id?{...x,exercises:x.exercises.filter((_,j)=>j!==i)}:x))} style={{...S.ib,padding:2}} className="ib"><Ic name="trash" size={12}/></button>}</div>))}</div>
      {eR===r.id&&<div style={{display:"flex",gap:8,marginTop:12}}><input style={{...S.ip,flex:2}} placeholder="Ejercicio" value={nEN} onChange={e=>setNEN(e.target.value)}/><input style={{...S.ip,flex:1,textAlign:"center"}} placeholder="3x10" value={nES} onChange={e=>setNES(e.target.value)}/><button onClick={()=>{if(!nEN.trim())return;setRoutines(p=>p.map(x=>x.id===r.id?{...x,exercises:[...x.exercises,{name:nEN.trim(),sets:nES||"3x10"}]}:x));setNEN("");setNES("3x10");}} style={{...S.sv,flexShrink:0,height:44}} className="sv"><Ic name="plus" size={14}/></button></div>}
    </div>))}
  </div>);
  const isN=sec==="notesFolders",fols=isN?noteF:taskF,setFols=isN?setNoteF:setTaskF;
  return (<div><button onClick={()=>setSec(null)} style={S.bk} className="cn"><Ic name="back" size={14}/> Volver</button><div style={{...S.st,marginTop:16,marginBottom:12}}>{isN?"Carpetas de Notas":"Secciones de Tareas"}</div>
    {fols.map(f=> (<div key={f.id} style={{...S.lc,borderLeft:`3px solid ${f.color}`}} className="lc"><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:24}}>{f.emoji}</span><div><div style={{color:"#f1f5f9",fontWeight:600,fontSize:14}}>{f.name}</div><div style={{width:10,height:10,borderRadius:"50%",background:f.color,marginTop:4}}/></div></div><button onClick={()=>setFols(p=>p.filter(x=>x.id!==f.id))} style={S.ib} className="ib"><Ic name="trash" size={14}/></button></div></div>))}
    <div style={{...S.fc,marginTop:12}}><div style={S.ft}>Nueva {isN?"carpeta":"sección"}</div><div style={S.fg}><label style={S.lb}>Nombre</label><input style={S.ip} placeholder="Ej: Facultad" value={nfN} onChange={e=>setNfN(e.target.value)}/><label style={S.lb}>Emoji</label><input style={{...S.ip,fontSize:24,textAlign:"center",letterSpacing:6}} value={nfE} onChange={e=>setNfE(e.target.value)} maxLength={2}/><label style={S.lb}>Color</label><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{COLS.map(c=> (<button key={c} onClick={()=>setNfC(c)} style={{width:32,height:32,borderRadius:"50%",background:c,border:nfC===c?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>))}</div></div><div style={S.fa}><button onClick={()=>{if(!nfN.trim())return;setFols(p=>[...p,{id:"f"+Date.now(),name:nfN.trim(),emoji:nfE,color:nfC}]);setNfN("");setNfE("📁");setNfC("#38bdf8");}} style={S.sv} className="sv">Crear</button></div></div>
  </div>);
}
 
function WC({data}){
  const w=data.map(d=>d.weight).filter(Boolean);if(w.length<2)return null;
  const mn=Math.min(...w)-1,mx=Math.max(...w)+1,W=320,H=80,pd=14;
  const x=i=>pd+(i/(w.length-1))*(W-pd*2),y=v=>H-pd-((v-mn)/(mx-mn))*(H-pd*2);
  const pts=w.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
  return (<svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" stopOpacity=".15"/><stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/></linearGradient></defs><polygon points={`${x(0)},${H} ${pts} ${x(w.length-1)},${H}`} fill="url(#wg)"/><polyline points={pts} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round"/>{w.map((v,i)=> (<g key={i}><circle cx={x(i)} cy={y(v)} r="3" fill="#38bdf8"/><text x={x(i)} y={y(v)-8} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">{v}</text></g>))}</svg>);
}
 
const S={
  pg:{background:"#060b14",minHeight:"100dvh",color:"#e2e8f0",fontFamily:"'DM Sans',system-ui,sans-serif",maxWidth:480,margin:"0 auto",paddingBottom:80},
  hdr:{padding:"18px 18px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #0d1a2e"},
  logo:{fontSize:17,fontWeight:800,letterSpacing:3,fontFamily:"monospace",color:"#f1f5f9"},
  tBar:{display:"flex",padding:"6px",gap:2,position:"fixed",bottom:0,left:0,right:0,background:"#060b14",zIndex:50,borderTop:"1px solid #0d1a2e",maxWidth:480,margin:"0 auto"},
  tBtn:{flex:1,padding:"8px 2px",borderRadius:10,border:"1px solid transparent",background:"transparent",color:"#334155",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3},
  tAct:{background:"#0d1a30",color:"#38bdf8",border:"1px solid #1e3a5f"},
  ct:{padding:"16px 16px 0"},
  sh:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14},
  st:{fontSize:22,fontWeight:700,color:"#f1f5f9",letterSpacing:-.5},
  ss:{fontSize:12,color:"#475569",marginTop:3},
  ab:{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:10,border:"none",background:"#1e3a5f",color:"#38bdf8",cursor:"pointer",fontSize:13,fontWeight:600,minHeight:44},
  cd:{background:"#0a1628",border:"1px solid #111f36",borderRadius:14,padding:16,marginBottom:12},
  lc:{background:"#080e1c",border:"1px solid #0d1a2e",borderRadius:12,padding:14,marginBottom:8},
  pc:{width:"100%",background:"#080e1c",border:"1px solid #0d1a2e",borderRadius:12,padding:16,marginBottom:10,cursor:"pointer"},
  fc:{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:14,padding:16,marginBottom:14},
  ft:{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:14,fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase"},
  fg:{display:"flex",flexDirection:"column",gap:10,marginBottom:14},
  lb:{fontSize:11,color:"#475569",fontFamily:"monospace",letterSpacing:1,textTransform:"uppercase"},
  ip:{background:"#060b14",border:"1px solid #111f36",borderRadius:10,padding:"12px 14px",color:"#cbd5e1",fontSize:16,outline:"none",width:"100%",boxSizing:"border-box",minHeight:44},
  fa:{display:"flex",gap:8,justifyContent:"flex-end"},
  sv:{padding:"10px 20px",borderRadius:10,border:"none",background:"#1e3a5f",color:"#38bdf8",cursor:"pointer",fontSize:14,fontWeight:600,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",gap:6},
  cn:{padding:"10px 16px",borderRadius:10,border:"1px solid #111f36",background:"transparent",color:"#475569",cursor:"pointer",fontSize:13,minHeight:44,display:"flex",alignItems:"center",gap:6},
  ib:{background:"transparent",border:"none",color:"#334155",cursor:"pointer",padding:6,display:"flex",alignItems:"center",borderRadius:6,minWidth:32,minHeight:32,justifyContent:"center"},
  tg:{padding:"3px 9px",borderRadius:6,fontSize:11,fontFamily:"monospace",fontWeight:600},
  em:{textAlign:"center",color:"#334155",padding:"40px 24px",fontSize:14},
  fl:{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:20,border:"1px solid #111f36",background:"transparent",color:"#475569",cursor:"pointer",fontSize:13,fontWeight:500,whiteSpace:"nowrap",minHeight:44},
  bk:{display:"flex",alignItems:"center",gap:6,padding:"10px 14px",borderRadius:10,border:"1px solid #111f36",background:"transparent",color:"#475569",cursor:"pointer",fontSize:13,minHeight:44},
  gl:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0d1a30",border:"1px solid #1e3a5f",borderRadius:14,padding:"14px 16px",marginBottom:16,textDecoration:"none",color:"#475569",minHeight:56},
  dl:{fontSize:11,color:"#334155",fontFamily:"monospace",letterSpacing:2,margin:"16px 0 8px"},
};
 
const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap');*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html{-webkit-text-size-adjust:100%}input,select,textarea{color-scheme:dark;font-family:inherit;font-size:16px!important}input:focus,select:focus,textarea:focus{border-color:#1e3a5f!important}.tb:active{transform:scale(.96)}.ab:active,.sv:active{opacity:.8}.cn:active{color:#64748b!important}.ib:active{color:#ef4444!important}.lc:active{border-color:#1e3a5f!important}.fb:active{border-color:#334155!important}.gcl:active{opacity:.85}::-webkit-scrollbar{width:0;height:0}`;