<script lang="ts">
  import { page } from '$app/stores';
</script>

<section class="section container center">
  <p class="silk" style="color:var(--red-lit)">// {$page.status}</p>
  <h1 style="font-size:var(--text-display);margin:0.3em 0">Signal lost.</h1>
  <p class="muted">{$page.error?.message ?? 'This page never came up.'}</p>
  <p style="margin-top:2rem"><a class="key" href="/">↑ RETURN TO INDEX</a></p>
</section>
