"use client";

import { useEffect } from "react";

export default function HeaderBehavior() {
  useEffect(() => {
    // Active link highlight (match hover effect)
    const ids = ["hero","benefits","about","offerings","trust","join"];
    const nav = document.querySelector('[data-nav]');
    if (nav) {
      const links = Array.from(nav.querySelectorAll('a[data-id]')) as HTMLAnchorElement[];
      const byId = new Map(links.map(a => [a.getAttribute('data-id')!, a]));
      const clear = ()=> links.forEach(a => a.classList.remove('active-underline'));
      const on = (id:string)=>{ clear(); const a = byId.get(id); if(a){ a.classList.add('active-underline'); }};
      const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as Element[];
      const io = new IntersectionObserver((entries)=>{
        const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio - a.intersectionRatio);
        if(visible[0]) on((visible[0].target as HTMLElement).id);
      }, { threshold:[0.25,0.5,0.75], rootMargin: '-10% 0px -10% 0px' });
      sections.forEach(s=> io.observe(s));
      return () => io.disconnect();
    }
  }, []);

  useEffect(() => {
    // Sticky header attach/detach animation
    const scroller = document.getElementById('app-scroll');
    const card = document.querySelector('[data-header-card]');
    if (!scroller || !card) return;
    const updateHeader = () => {
      const stuck = scroller.scrollTop > 8;
      if (stuck) {
        card.classList.add('m-4','rounded-2xl');
        card.classList.remove('m-0','rounded-b-2xl');
      } else {
        card.classList.remove('m-4','rounded-2xl');
        card.classList.add('m-0','rounded-b-2xl');
      }
    };
    scroller.addEventListener('scroll', updateHeader, { passive: true } as any);
    updateHeader();
    return () => scroller.removeEventListener('scroll', updateHeader as any);
  }, []);

  return null;
}


