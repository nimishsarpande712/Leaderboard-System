import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom dropdown (accessible-ish) for dark themed UI.
 * Props:
 *  - options: [{ value, label, meta? }]
 *  - value
 *  - onChange(value)
 *  - placeholder
 */
export default function Dropdown({ options=[], value, onChange, placeholder='Select…', labelExtractor }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const currentIndex = options.findIndex(o => o.value === value);

  const close = useCallback(() => setOpen(false), []);
  const toggle = () => setOpen(o=>!o);

  // Close on outside click
  useEffect(() => {
    if(!open) return;
    function onDoc(e){
      if(!triggerRef.current) return;
      if(triggerRef.current.contains(e.target) || listRef.current?.contains(e.target)) return;
      close();
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('touchstart', onDoc); };
  }, [open, close]);

  // Keyboard navigation
  function handleKey(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setOpen(o=>!o); }
    if(!open){
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){ setOpen(true); e.preventDefault(); }
      return;
    }
    if(e.key === 'Escape'){ close(); return; }
    if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)) e.preventDefault();
    let idx = currentIndex === -1 ? 0 : currentIndex;
    if(e.key === 'ArrowDown') idx = Math.min(options.length-1, idx+1);
    if(e.key === 'ArrowUp') idx = Math.max(0, idx-1);
    if(e.key === 'Home') idx = 0;
    if(e.key === 'End') idx = options.length-1;
    if(idx !== currentIndex && options[idx]){
      onChange(options[idx].value);
      scrollOptionIntoView(idx);
    }
  }

  function scrollOptionIntoView(idx){
    const list = listRef.current; if(!list) return;
    const el = list.querySelector(`[data-idx='${idx}']`); if(!el) return;
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if(top < list.scrollTop) list.scrollTop = top; else if(bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }

  function choose(v){ onChange(v); close(); }

  const currentLabel = currentIndex >=0 ? (labelExtractor? labelExtractor(options[currentIndex]) : options[currentIndex].label) : '';

  return (
    <div className={"dropdown" + (open? ' open':'')}>
      <button ref={triggerRef} type="button" className="dropdown-trigger" aria-haspopup="listbox" aria-expanded={open} onKeyDown={handleKey} onClick={toggle}>
        <span className={"dropdown-value" + (currentIndex===-1? ' placeholder':'')}>{currentLabel || placeholder}</span>
        <span className="dropdown-caret" aria-hidden>▾</span>
      </button>
      {open && (
        <div className="dropdown-pop" role="listbox" ref={listRef} tabIndex={-1}>
          {options.map((o,i) => {
            const selected = o.value === value;
            return (
              <div key={o.value} role="option" aria-selected={selected} className={"dropdown-option" + (selected? ' selected':'')} data-idx={i} onMouseDown={(e)=>e.preventDefault()} onClick={()=>choose(o.value)}>
                <span className="do-label">{labelExtractor? labelExtractor(o) : o.label}</span>
                {o.meta != null && <span className="do-meta">{o.meta}</span>}
              </div>
            );
          })}
          {options.length===0 && <div className="dropdown-empty">No options</div>}
        </div>
      )}
    </div>
  );
}
