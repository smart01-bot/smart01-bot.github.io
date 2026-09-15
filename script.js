const items=document.querySelectorAll(".section,.project,.experience,.contact");
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}})},{threshold:.08});
items.forEach(i=>{i.style.opacity="0";i.style.transform="translateY(14px)";i.style.transition="opacity .6s ease, transform .6s ease";observer.observe(i)});
const reveal=()=>document.querySelectorAll(".visible").forEach(i=>{i.style.opacity="1";i.style.transform="translateY(0)"});
document.addEventListener("scroll",reveal,{passive:true});reveal();