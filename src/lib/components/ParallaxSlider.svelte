<svelte:options runes={false} />

<script>
  import Lazy from 'svelte-lazy';
  import { debounce } from '#lib/utils/helpers';


  export let slidesData;
  export let title;
  export let title2;
  export let titleFont;
  export let title2Font;
  const cdnImageUrl = "https://res.cloudinary.com/dzzdoq1bq/image/upload/v1638569218/static/"

  const cdnVideoUrl = "https://res.cloudinary.com/dzzdoq1bq/video/upload/v1638569211/static/"


  // [isMobile] means the user is on a mobile device AND in landscape mode.
  export let isMobile = false;

  // Inner width and height of window.
  export let innerWidth;
  export let innerHeight;
  // [sliderEl] is the element that wraps all the project slides and translates based on which slide is active (e.g. slides[active_index]).
  let sliderEl;

  /*
  In mobile, the text slides are condensed into one. So the [slides] array is shortened to only have the first text slide.
  In the html, we iterate over the leftover text slides slidesData.slice(text_slides_index, slidesData.length) and input them to the main text slide.
   */
  $: slides = slidesData;
  $: text_slide_index = slidesData.findIndex((s) => s.type === 'text');
  $: slides = isMobile && slidesData ? slidesData.slice(0, text_slide_index + 1) : slidesData;

  $: slide_els = []; // all slide elements
  $: active_index = 0; // index of currently displayed slide.

  const Cursors = {
    RIGHT: 'right-cursor',
    LEFT: 'left-cursor'
  };

  let sliderCursor = 'cursor';
  let wrapperWidth = 0;

  function handleMousemove(event) {
    const cursorXPosition = event.clientX;
    sliderCursor = wrapperWidth / 2 <= cursorXPosition ? Cursors.RIGHT : Cursors.LEFT;
  }

  /*
    - SLIDE CHANGE  ------------------------
    Assuming that the desktop slides = 100vw and mobile slides have a 5:8 aspect ratio
    */
  let aspectRatio = { mobile: 8 / 5 };
  $: mobile_width = Math.round(innerHeight * aspectRatio.mobile); //in px
  $: DESKTOP_WIDTH = 100; //in vw


  // Calculates the offset for the x translation.
  let calculateXOffset = (w) => {
    //w = width
    // [offset] is calculated by multiplying the width by the active index.
    let offset = active_index * w;
    console.log("w", w)
    // When on mobile, the last slide has the image from the previous slide showing on the left.
    if (isMobile && active_index === slides.length - 1) {
      // calculate the left padding by taking the width of the window - the current slide width
      let left_padding = innerWidth - mobile_width;
      offset = offset - left_padding;
    }
    return 0 - offset;
  };
  

  // Handles the translation on [sliderEl] to move to the next slide.
  const nextSlide = () => {
    // On last slide of project, go to next project index.
    if (active_index == 6) {
      debugger
    }
    if (isMobile && active_index === slides.length - 1) {
      return updateProjectIndex(id + 1);
    }
    // Update active index.
    active_index = active_index < slides.length - 1 ? active_index + 1 : 0;
    let translate_x = isMobile
    ? `${calculateXOffset(mobile_width)}px`
    : `${calculateXOffset(DESKTOP_WIDTH)}vw`;
    
    return (sliderEl.style.transform = `translateX(${translate_x})`);
  };

  // Handles the translation on [sliderEl] to move to the previous slide.
  const prevSlide = () => {
    // On last slide of project, go to previous project index.
    if (isMobile && active_index === 0) {
      return updateProjectIndex(id - 1);
    }
    // Update active index.
    active_index = active_index === 0 ? slides.length - 1 : active_index - 1;
    let translate_x = isMobile
      ? `${calculateXOffset(mobile_width)}px`
      : `${calculateXOffset(DESKTOP_WIDTH)}vw`;

    return (sliderEl.style.transform = `translateX(${translate_x})`);
  };

  // Handles the users click depending on which side of the page it's on.
  const handleSliderClick = () => {
    if (sliderCursor === Cursors.RIGHT) {
      nextSlide();
    } else if (sliderCursor === Cursors.LEFT) {
      prevSlide();
    }
  };

  // -------------------------

  // - MOBILE SCROLL -----------------------

  export let updateProjectIndex;
  export let id;

  const handleScrollDown = debounce((e) => {
    const { scrollHeight, scrollTop } = e.target;
    // Detect if user is at the bottom of the window to move to next slide.
    if (scrollTop + innerHeight >= scrollHeight - 100) {
      nextSlide();
    }
  }, 100);

  $: textSlides = slidesData.slice(text_slide_index, slidesData.length);
  // -------------------------
</script>

<svelte:body
  on:viewportchanged={() => {
    active_index = 0;
  }} />

<div
  class="slider-wrapper"
  bind:clientWidth={wrapperWidth}
  on:mousemove={handleMousemove}
  style={isMobile ? `width:${innerWidth}px; height:${innerHeight}px;` : ''}
>
  <img class="image-logo" src="images/LOGO-Ai small_Super Bonjour smaller.svg" alt="Logo" />
  <div class="mobile-tap-caption" on:click={handleSliderClick}>Tap!</div>
  
  <!-- <img class="image-logo mobile" src="images/LOGOFACE-Ai.svg" alt="Logo" /> -->
  <div class={'slider-title'}>
    <h2>
      <span style={`font-family: ${titleFont || 'roc-grotesk'};`}>
        {title}
      </span>
      <span style={`font-family: ${title2Font || 'moret'};`}>
        {title2}
      </span>
    </h2>
    <div class="paginator">
      <h4>{active_index + 1} / {slides.length}</h4>
    </div>
  </div>
  <div
    class={`slider ${sliderCursor}`}
    bind:this={sliderEl}
    on:click={handleSliderClick}
    style={`${
      isMobile
        ? `width: ${mobile_width * slides.length}px; height:100%;`
        : `width: ${slides.length * 100}vw;`
    }`}
  >
    {#each slides as slide, i}
      <div
        class="slider-slide"
        type={slide.type}
        bind:this={slide_els[i]}
        style={`${
          isMobile
            ? `width: ${Math.round(innerHeight * aspectRatio.mobile)}px; height:100%;`
            : 'width: 100vw'
        }; `}
      >
        {#if slide.type === 'image'}
          <Lazy height={300}>
            <div
              id={i}
              class={`slide ${sliderCursor};`}
              style={`background-position: ${i}00vw center; background-image: url(${cdnImageUrl}${slide.src});
              ${isMobile ? `height:${innerHeight}px;` : ''}; `}
            />
          </Lazy>
        {:else if slide.type === 'video'}
          <div
            id={i}
            class={`slide slide-video ${sliderCursor} ${
              slide.addPadding ? 'slide-video-extra-padding' : ''
            }`}
            style={`background-position: ${i}00vw center; position: relative;${
              isMobile ? '' : 'width:100vw'
            }
            ${isMobile ? `height:${innerHeight}px;` : ''}; background-color: ${
            slide.backgroundColor || ''
            };`}
          >
            <div
              class={`${slide.addPadding ? 'video-container' : ''}`}
              style={`width: ${isMobile ? '100%' : ''}`}
            >
              <!-- svelte-ignore a11y-media-has-caption -->
              <Lazy height={300}>
                <video
                  style={`width: ${isMobile ? '100%' : '100vw'}`}
                  src={`${cdnVideoUrl}${slide.src}`}
                  autoplay="true"
                  loop
                  muted
                  playsinline
                />
              </Lazy>
            </div>
          </div>
        {:else if slide.type === 'two-columns'}
          <div class="slide two-columns-slide" style={isMobile ? `height:${innerHeight}px;` : ''}>
            <div class="slide-column slide-left-column">
              <video src={slide.videoSrc} autoplay="true" loop muted playsinline />
            </div>
            <div class="slide-column slide-right-column">
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <Lazy height={300}>
                <img src={slide.imageSrc} alt="left column image" />
              </Lazy>
            </div>
          </div>
        {:else}
          <div
            class="slide text_slide"
            style={`
            background-color: ${slide.backgroundColor}; color:${slide.color};
            font-family: ${slide.font || 'moret'};
            font-size: ${slide.fontSize};
            overflow-y:${isMobile ? 'scroll' : 'auto'};
            width:100%;
            ${isMobile ? `height:${innerHeight}px;` : ''}; 
            `}
            on:scroll={handleScrollDown}
          >
            {#if isMobile}
              <!-- All the text is encapsulated in one slide for mobile -->
              {#each textSlides as textSlide, i}
                <div
                  class="text_slide_mobile"
                  style={`
                  padding-top: ${i == 0 ? '70px' : '30px'};
                  padding-bottom: ${i == textSlides.length - 1 ? '100px' : '30px'}
                  `}
                >
                  <h5 class="text_title text_title_mobile">
                    {textSlide.title}
                  </h5>
                  <p
                    class="text_mobile"
                    style={`
                    font-size: ${i > 0 ? '16px' : '20px'};
                    font-family: ${textSlide.font || 'moret'};
                    color: ${textSlide.color};
                    `}
                  >
                    {@html textSlide.src}
                  </p>
                </div>
              {/each}
            {:else}
              <div class="text_slide_container">
                <h5 class="text_title">
                  {slide.title}
                </h5>
                {@html slide.src}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>

.mobile-tap-caption {
    display: none;
  }
  video::-webkit-media-controls-fullscreen-button,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-pausebutton {
    display: none;
  }

  .video-container {
    position: absolute;
    padding-bottom: 56.25%;
    padding-top: 0;
    height: 0;
    overflow: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .image-logo.mobile {
    display: none;
  }

  .slide-video-extra-padding video {
    width: 70vw;
    height: 70vh;
    margin-left: 15vw;
    margin-right: 15vw;
    object-fit: contain;
    margin-top: 15vh;
    margin-bottom: 15vh;
  }
  .slide-video-extra-padding {
    background-color: #c374f6;
  }

  .slide-column {
    flex-shrink: 1;
    background-color: #c374f6;
    width: 25vw;
    min-height: 300px;
    display: flex;
    align-items: center;
  }

  .slide-right-column {
    margin-left: 15px;
  }

  .slide-left-column {
    margin-right: 15px;
  }

  .slide-left-column video {
    width: 100%;
    height: auto;
  }

  .slide-right-column img {
    width: 100%;
    height: auto;
  }

  .two-columns-slide {
    display: flex;
    background-color: #c374f6;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: stretch;
  }
  .text_slide_container {
    padding-left: 55px;
    padding-top: 50px;
    width: 88%;
    line-height: 130%;
  }

  .text_slide_container_mobile {
    width: 100%;
    padding: 2rem;
  }

  .text_title {
    padding-top: 50px;
    padding-bottom: 10px;
    margin-bottom: 2px;
    color: #e2ee75;
    font-size: 18px;
    font-weight: 100;
    font-family: 'Opposit-Medium';
    line-height: 39px;
  }

  .text_slide {
    background-color: #290b15;
    height: 100vh;
    width: 100vw;
    color: white;
    text-align: 15vw;
    font-size: 50px;
    font-weight: 100;
    font-family: 'moret';
  }

  .slider {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    transition: all 200ms linear 0s;
    background: #c3862c;
  }

  .slide {
    height: 100vh;
    background-size: cover;
    transition: all 200ms ease-out 0s;
  }

  .slider-wrapper {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    width: 100vw;
    overflow: hidden;
    transition: 0.3s all;
    background: #c3862c;
  }

  .arrow {
    font-family: 'Roc Wide';
    position: absolute;
    width: 70px;
    cursor: pointer;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #fff;
  }

  .left {
    left: 0;
  }

  .right {
    right: 0;
  }

  .slider-title {
    width: 100%;
    padding: 25px;
    padding-left: 55px;
    padding-bottom: 30px;
    margin-bottom: 50px;
    padding-right: 20vw;
    font-family: 'moret';
    color: #fff;
    position: absolute;
    bottom: 0;
    color: #fff;
    font-size: 1.75rem;
    font-weight: normal;
    margin: 0;
    z-index: 1;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

  .slider-title h2 {
    font-family: 'roc-grotesk', sans-serif;
    font-size: 36px;
    font-weight: normal;
    margin: 0;
  }

  .paginator h4 {
    font-size: 36px;
    margin: 0;
  }
  video {
    height: 100vh;
    object-fit: cover;
  }

  .image-logo {
    position: fixed;
    left: 55px;
    top: 30px;
    width: 177px;
    height: 4.75rem;
    z-index: 1;
    cursor: url(/images/home-cursor.png), auto;
  }

  .right-cursor {
    cursor: url(/images/right-cursor.svg), auto;
  }
  .left-cursor {
    cursor: url(/images/left-cursor.svg), auto;
  }

  @media screen and (max-width: 900px) {
    .mobile-tap-caption {
      font-family: 'Opposit-Medium';
      text-transform: uppercase;
      letter-spacing: .12rem;
      display: block;
      position: absolute;
      top: 50vh;
      right: 20px;
      background-color: orange;
      color: #fff;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      z-index: 1;
      line-height: 50px;
      text-align: center;
    }
    
    .slider-title {
      margin-bottom: -10px;
      font-size: 1.75rem;
    }
    .paginator {
      font-size: 1.75rem;
      right: 20vw;
      bottom: 0;
      margin-bottom: -5px;
    }

    .slide {
      background-attachment: scroll;
      background-position: center !important;
    }

    .image-logo {
      width: 177px;
    }
  }

  @media screen and (max-width: 600px) {
    video {
      width: 100vw;
      height: auto;
      object-fit: unset;
    }

    .slide-right-column {
      margin-left: 10px;
    }

    .slide-left-column {
      margin-right: 10px;
    }
    .slide-video-extra-padding video {
      width: 75vw;
      height: auto;
      margin: 20px 50px;
    }

    .image-logo.mobile {
      display: block;
    }

    .slider-title {
      padding-left: 25px;
      align-items: flex-end;
    }

    .slider-title h2 {
      width: 5vw;
      font-size: 1rem;
    }

    .slider-title .paginator h4 {
      font-size: 1rem;
      right: 5vw;
      margin-right: 35px;
    }

    .slide {
      height: 60vw;
    }

    .text_slide {
      padding-top: 0px;
      font-size: 10px !important;
    }

    .text_slide_container {
      padding-top: 5px;
      padding-left: 25px;
    }

    .text_title {
      padding-top: 5px;
      font-size: 18px;
      margin-top: 0;
    }

    .image-logo {
      width: 117px;
      top: 10px;
      left: 25px;
    }
  }

  @media screen and (max-width: 1200px) and (max-height: 499px) {
    /* For mobile-size but acts on short height desktop as well */
    .slide {
      background-position: unset !important;
    }

    .slider-title {
      width: 100%;
      padding: 30px 55px;
      align-items: center;
    }

    .slider-title h2 {
      font-size: 1.5rem;
    }

    .slider-title .paginator h4 {
      font-size: 1.5rem;
      margin-bottom: 0;
    }
    .slide-video-extra-padding video {
      width: 70vw;
      height: 70vh;
      margin-left: 0;
      margin-right: 0;
    }

    .image-logo {
      position: absolute;
      left: 55px;
      top: 15px;
      width: 100px;
      height: 4.75rem;
      z-index: 1;
      cursor: url(/images/home-cursor.png), auto;
    }
  }
  /* Mobile text slides */
  .text_slide_mobile {
    /* min-height: 375px; */
    padding: 30px 70px;
    padding-bottom: 30px;
    box-sizing: border-box;
  }

  .text_title_mobile {
    font-size: 12px;
    line-height: 1.3;
    margin: 0;
    padding: 0;
    padding-bottom: 1.5rem;
  }

  .text_mobile {
    font-size: 20px;
    line-height: 1.3;
    margin: 0;
  }
</style>
