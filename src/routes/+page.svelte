<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Manifesto from '$lib/components/Manifesto.svelte';
  import Domains from '$lib/components/Domains.svelte';
  import ProofDashboard from '$lib/components/ProofDashboard.svelte';
  import WorkStrip from '$lib/components/WorkStrip.svelte';
  import PressWall from '$lib/components/PressWall.svelte';
  import Publications from '$lib/components/Publications.svelte';
  import PrinciplesConsole from '$lib/components/PrinciplesConsole.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import { PROFILE } from '$lib/data/profile';
</script>

<svelte:head>
  <title>Fahim Faisal — autonomy &amp; robotics engineer</title>
  <meta name="description" content={PROFILE.intro} />
  <meta property="og:title" content="Fahim Faisal — machines that perceive, reason, and act" />
  <meta property="og:description" content={PROFILE.intro} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://fh1m.github.io/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Hero />
<Domains />
<ProofDashboard />
<WorkStrip />
<PressWall />
<Publications />
<PrinciplesConsole />
<Manifesto />
<Contact />
