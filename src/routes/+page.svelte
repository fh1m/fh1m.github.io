<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import SectionNav from '$lib/components/SectionNav.svelte';
  import FunFacts from '$lib/components/FunFacts.svelte';
  import Domains from '$lib/components/Domains.svelte';
  import WorkStrip from '$lib/components/WorkStrip.svelte';
  import Story from '$lib/components/Story.svelte';
  import DeepDives from '$lib/components/DeepDives.svelte';
  import LabWalk from '$lib/components/LabWalk.svelte';
  import ProofDashboard from '$lib/components/ProofDashboard.svelte';
  import Certificates from '$lib/components/Certificates.svelte';
  import Greats from '$lib/components/Greats.svelte';
  import Publications from '$lib/components/Publications.svelte';
  import Manifesto from '$lib/components/Manifesto.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import { STORIES } from '$lib/data/stories';
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

<span id="top"></span>
<Hero />
<SectionNav />

<div class="anchor" id="proof"><ProofDashboard /></div>
<div class="anchor" id="work"><WorkStrip /></div>
<FunFacts />
<Domains />
<div class="anchor" id="systems"><DeepDives /></div>
<div class="anchor" id="story">
  <Story story={STORIES[0]} />
  <Story story={STORIES[1]} />
</div>
<div class="anchor" id="lab"><LabWalk /></div>
<Certificates />
<div class="anchor" id="minds"><Greats /></div>
<Publications />
<Manifesto />
<div class="anchor" id="contact"><Contact /></div>

<style>
  .anchor {
    scroll-margin-top: 104px;
  }
  #top {
    position: absolute;
    top: 0;
  }
</style>
