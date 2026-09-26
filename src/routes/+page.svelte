<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Domains from '$lib/components/Domains.svelte';
  import WorkStrip from '$lib/components/WorkStrip.svelte';
  import LabTeaser from '$lib/components/LabTeaser.svelte';
  import ProofDashboard from '$lib/components/ProofDashboard.svelte';
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
<ProofDashboard />
<Domains />
<WorkStrip />
<LabTeaser />
<Contact />
