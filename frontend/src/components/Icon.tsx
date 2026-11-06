import { useEffect, useRef, useState } from 'react';
import type { AnimationItem } from 'lottie-web';
import './Icon.css';

export type IconName = 'home' | 'payments' | 'cards' | 'history' | 'help' | 'settings' | 'logout' | 'plus' | 'transfer' | 'copy' | 'close' | 'back';
// Same 12px visible bounds and 1.75px stroke in a 16px action slot.
const actionViewBoxes: Partial<Record<IconName, string>> = {"plus": "36.684111 36.684111 54.631778 54.631778", "transfer": "39.818739 29.095132 59.086135 59.086135"};
const dataCache = new Map<IconName, Promise<object>>();
function loadData(name: IconName) {
  let pending = dataCache.get(name);
  if (!pending) {
    pending = fetch(`${import.meta.env.BASE_URL}assets/iconity/${name}.json`).then(response => {
      if (!response.ok) throw new Error('Icon unavailable');
      return response.json() as Promise<object>;
    }).catch(error => { dataCache.delete(name); throw error; });
    dataCache.set(name, pending);
  }
  return pending;
}

/** Decorative icon: the containing button/link owns the accessible label and hit area. */
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const assetName = name === 'back' ? 'transfer' : name;
  const root = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const staticSrc = `${import.meta.env.BASE_URL}assets/iconity/${assetName}.svg`;

  useEffect(() => {
    setPlaying(false);
    const element = root.current;
    const host = canvas.current;
    const control = element?.closest('button,a,[role="button"]');
    if (!element || !host || !control) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    let disposed = false;
    let hovered = false;
    let animation: AnimationItem | undefined;
    let totalFrames = 0;
    let duration = 0;
    let loading: Promise<void> | undefined;
    const restFrame = assetName === 'transfer' ? 18 : 0;
    const reset = () => {
      animation?.resetSegments(true);
      animation?.goToAndStop(restFrame, true);
    };
    const stop = () => {
      hovered = false;
      reset();
      if (!disposed) setPlaying(false);
    };
    const play = () => {
      if (disposed || !hovered || reduced.matches || document.hidden) return;
      if (!animation?.isLoaded) return;
      setPlaying(true);
      if (animation) {
        // Play one authored cycle, then return to the fully visible rest frame.
        animation.resetSegments(true);
        animation.setSpeed(Math.max(1, duration / 0.28));
        if (restFrame) animation.playSegments([[restFrame, totalFrames], [0, restFrame]], true);
        else animation.goToAndPlay(0, true);
      }
    };
    const prepare = () => {
      if (animation) { play(); return; }
      if (loading) return;
      loading = Promise.all([import('lottie-web/build/player/lottie_light'), loadData(assetName)]).then(([module, data]) => {
        if (disposed) return;
        animation = module.default.loadAnimation({
          container: host, renderer: 'svg', loop: false, autoplay: false,
          animationData: structuredClone(data),
          rendererSettings: { progressiveLoad: false, preserveAspectRatio: 'xMidYMid meet', viewBoxSize: actionViewBoxes[assetName] },
        });
        totalFrames = animation.totalFrames;
        duration = animation.getDuration(false);
        animation.addEventListener('complete', () => {
          reset();
          if (!disposed) setPlaying(false);
        });
        const ready = () => { reset(); play(); };
        if (animation.isLoaded) ready();
        else animation.addEventListener('DOMLoaded', ready);
      }).catch(() => {
        // The local static export remains visible when animation cannot load.
        loading = undefined;
        if (!disposed) setPlaying(false);
      });
    };
    const enter = (event: Event) => {
      const pointer = event as PointerEvent;
      if (!finePointer.matches || reduced.matches || pointer.pointerType === 'touch') return;
      hovered = true;
      prepare();
    };
    const visibility = () => { if (document.hidden) stop(); };
    control.addEventListener('pointerenter', enter);
    control.addEventListener('pointerleave', stop);
    control.addEventListener('pointercancel', stop);
    control.addEventListener('blur', stop);
    reduced.addEventListener('change', stop);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true;
      control.removeEventListener('pointerenter', enter);
      control.removeEventListener('pointerleave', stop);
      control.removeEventListener('pointercancel', stop);
      control.removeEventListener('blur', stop);
      reduced.removeEventListener('change', stop);
      document.removeEventListener('visibilitychange', visibility);
      animation?.destroy();
    };
  }, [name, assetName]);

  return <span ref={root} className={`app-icon${playing?' is-playing':''}`} style={{width:size,height:size,transform:name === 'back' ? 'rotate(-135deg)' : undefined}} data-icon={name} data-icon-source="iconity" aria-hidden="true">
    <img className="app-icon-static" src={staticSrc} alt="" width={size} height={size}/>
    <span ref={canvas} className="app-icon-animation"/>
  </span>;
}
