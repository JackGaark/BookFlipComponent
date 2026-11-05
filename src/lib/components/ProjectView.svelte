<svelte:options runes={false} />

<script>
  import { _ } from 'svelte-i18n';
  import { featuredProjects } from './project-details';

  export let project;

  $: featured = featuredProjects.find((item) => item.projectId === project.id);
  $: details = featured || {
    name: $_(project.title).replace(/\s*—\s*$/, ''),
    client: $_(project.title).replace(/\s*—\s*$/, ''),
    year: $_(project.title2)
  };
  $: media = project.slidesData.filter((slide) => slide.type !== 'text');
  $: copy = project.slidesData.filter((slide) => slide.type === 'text');

  function mediaSource(slide, index) {
    if (project.id === 14 && index < 3) return `/images/project-davids-tea-${index + 1}.png`;
    return slide.src.startsWith('/') ? slide.src : `/${slide.src}`;
  }
</script>

<article class="project-view" aria-label={details.name}>
  <div class="project-details">
    <span>{details.name}</span>
    <span>{details.client}</span>
    <span>{details.year}</span>
  </div>

  <div class="project-media">
    {#each media as slide, index}
      <figure class="media" class:first={index % 3 === 0} class:second={index % 3 === 1} class:third={index % 3 === 2}>
        {#if slide.type === 'video'}
          <video src={mediaSource(slide, index)} autoplay muted loop playsinline controls />
        {:else if slide.type === 'two-columns'}
          <div class="paired-media">
            <video src={slide.videoSrc} autoplay muted loop playsinline controls />
            <img src={slide.imageSrc} alt={`${details.name} — image ${index + 1}`} loading="lazy" />
          </div>
        {:else}
          <img
            src={mediaSource(slide, index)}
            alt={`${details.name} — image ${index + 1}`}
            loading={index > 1 ? 'lazy' : 'eager'}
          />
        {/if}
      </figure>
    {/each}
  </div>

  {#if copy.length}
    <div class="project-copy">
      {#each copy as section}
        <section>
          <h2>{section.title}</h2>
          <p>{@html section.src}</p>
        </section>
      {/each}
    </div>
  {/if}
</article>

<style>
  .project-view {
    box-sizing: border-box;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 150px 3% 64px;
    background: #fff;
    color: #000;
  }
  .project-details {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 24px;
    font-family: roc-grotesk, sans-serif;
    font-size: 12px;
    font-weight: 300;
    line-height: 1;
  }
  .media {
    display: block;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }
  .media + .media {
    margin-top: 8px;
  }
  .media.first {
    width: 43%;
    aspect-ratio: 582 / 775;
  }
  .media.second {
    width: 72%;
    aspect-ratio: 978 / 775;
    margin-left: auto;
  }
  .media.third {
    width: 72%;
    aspect-ratio: 988 / 775;
  }
  .media img,
  .media video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .paired-media {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    height: 100%;
  }
  .project-copy {
    width: min(100%, 440px);
    margin-top: 56px;
    font-family: roc-grotesk, sans-serif;
    font-size: 12px;
    line-height: 1.35;
  }
  .project-copy section + section {
    margin-top: 28px;
  }
  .project-copy h2 {
    margin: 0 0 4px;
    font-size: inherit;
    font-weight: 500;
  }
  .project-copy p {
    margin: 0;
  }
  @media (max-width: 700px) {
    .project-view {
      padding: 110px 20px 48px;
    }
    .media.first,
    .media.second,
    .media.third {
      width: 100%;
      margin-left: 0;
    }
    .media.first {
      aspect-ratio: 3 / 4;
    }
    .media.second,
    .media.third {
      aspect-ratio: 4 / 3;
    }
  }
</style>
