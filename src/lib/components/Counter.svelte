<script lang="ts">
  import { onMount } from 'svelte';
  let { value, duration = 1200 }: { value: string; duration?: number } = $props();

  // Split into numeric + suffix (e.g. "1,038", "500 Hz", "3,756").
  const m = $derived(value.match(/^([\d.,]+)(.*)$/));
  const target = $derived(m ? parseFloat(m[1].replace(/,/g, '')) : 0);
  const suffix = $derived(m ? m[2] : '');
  const decimals = $derived(m && m[1].includes('.') ? (m[1].split('.')[1]?.length ?? 0) : 0);

  let display = $state('0');
  let el: HTMLSpanElement;

  function fmt(n: number) {
    return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  onMount(() => {
    if (!m) {
      display = value;
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      display = fmt(target) + suffix;
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          display = fmt(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
          else display = fmt(target) + suffix;
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<span bind:this={el} class="num">{display}</span>
