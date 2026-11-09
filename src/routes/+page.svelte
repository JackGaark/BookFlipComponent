<svelte:options runes={false} />

<script>
  import ProjectView from '#lib/components/ProjectView.svelte';
  import SlidingIntro from '#lib/components/SlidingIntro.svelte';
  import SplitLanding from '#lib/components/SplitLanding.svelte';
  import { fade } from 'svelte/transition';
  import PopUp from '#lib/components/PopUp.svelte';
  import { initI18n } from '#lib/components/i18n/i18n.js';
  import { onMount, tick } from 'svelte';
  import { checkIsMobile } from '#lib/utils/helpers';
  import '../app.css';

  initI18n();

  let entranceOpen = true;
  let introOpen = true;
  let introZoom = 50;
  let introView = 'work';
  let selectedProjectId = 0;
  async function openIntroProject(event) {
    selectedProjectId = event.detail;
    introOpen = false;
    await tick();
    window.scrollTo(0, 0);
  }

  let modalOpen = false;
  function showModal() {
    modalOpen = true;
  }

  function hideModal() {
    modalOpen = false;
  }

  // We want the ui to be viewed in landscape on mobile devices.
  let isMobile = false;
  let viewport = null;
  let innerWidth = 0;
  let innerHeight = 0;
  $: isLandscapeView = false;
  // Check for mobile device.
  onMount(async () => {
    //for testing purpose on mobile
    let forceMobile = false;
    isMobile = checkIsMobile(forceMobile);
    if (isMobile) {
      document.body.scrollTop = 0;
    }
  });

  // Check that the phone is in landscape.
  onMount(() => {
    (async () => {
      // Dynamic import because of ssr and window manipulation.
      const { default: viewport_library } = await import('svelte-viewport-info');
      viewport = viewport_library;
      innerWidth = viewport_library?.Width || 0;
      innerHeight = viewport_library?.Height || 0;
      isLandscapeView = viewport_library?.Orientation === 'landscape' || false;
    })();
  });

  let MAX_DISPLAY_PROJECT = 17; //number of project before the more button
  const projectsArray = [
    {
      id: 0,
      title: 'slider.1.title',
      title2: 'slider.1.title2',
      slidesData: [
        {
          src: 'images/HSCo_Mag_1.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_Mag_2.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_Mag_3.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_Mag_4.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_Mag_5.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_Mag_6.jpg',
          type: 'image'
        },
        {
          src: 'Super Bonjour guided Herschel away from their regionalist identity, and placed them in a global community. We used the magazine to reposition the brand, while working with our network to generate lasting ties with creatives and travelers.  Vol 1: Islands — a theme explored geographically and metaphorically.',
          type: 'text',
          title: 'Creating a Travel Magazine',
          fontSize: '54px',
          color: '#4E151D',
          backgroundColor: '#C3862C'
        },
        {
          src: '360 Content Strategy —<br>We took on the full scope of the project from editorial lineups, commissioning original content, social media meta accounts and branded Google Docs. We planned a launch event, during the LA Art Book Fair, on Echo Park’s island and a 1-800 number connecting callers to the sounds of island life.<br><br>Brand Positioning, Creative Direction <br>Production, Theme Development, Contributor Outreach <br>Pagination & Flatplan, Art Direction, Editorial Design<br>Print Management & Distribution Strategy <br>Event & Activation',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C3862C'
        },
        {
          src: 'Imogene Barron, Ryan Daniel Browne, Eva Cremers, Natasha & Dino Forte, Michelle Maguire, Meaghan Way, Kelsey McClellan, Ashley Oliveri, Catherine Potvin, Marie H. Rainville, Houmi Sakata, Victoria Sieczka, Aileen Son, Oumayma Ben Tanfous, Stephanie Mercier Voyer, Stephen Wilde, ​​Nico Young<br>Sacha Jackson, Editor<br><br>Featuring Hana Vu, Danny Smiles, Bradley Sheppard, Amélie Rousseaux, Apolla Echino, Maxime Bayol, Marc Cefalu<br><br>Awards<br> Editorial, Entire Publication — Applied Arts 2021<br>Design, Éditorial — Concours Idéa 2021',
          type: 'text',
          title: 'Contributors',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C3862C'
        }
      ]
    },
    {
      id: 1,
      title: 'slider.2.title',
      title2: 'slider.2.title2',
      slidesData: [
        {
          src: 'images/OD_1.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_2.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_3.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_4.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_5.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_6.jpg',
          type: 'image'
        },
        {
          src: 'images/OD_7.jpg',
          type: 'image'
        },
        {
          src: 'Establishing the brand’s storytelling style meant immersing ourselves in Osei Duro’s process and day-to-day out of the Accra studio in Ghana.  We dove deep, via workshops and collecting insights, to inform the brand’s expressions in photography, casting, styling, tone and content. These images are from their 2019 campaign, shot on location with emerging local talent.',
          type: 'text',
          title: 'Brand Platform & Campaign Strategy',
          fontSize: '54px',
          color: '#E1D8CA',
          backgroundColor: '#111E0C'
        },
        {
          src: 'Deep Dive & Immersion — <br>Factory and textile print shop visits and day-to-day operations<br><br>Brand Audit & Strategy — <br>Review of all the content to help establish a new strategy,<br> workshops and brand platform<br><br>2019 Campaign Shoots —<br>Creative Direction<br>Pre-production & On-set Direction<br>Campaign Shoots, on location<br>Lookbook Direction',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#111E0C'
        },
        {
          src: 'Campaign Photography Kay Kwabia<br>Film Photography Super Bonjour<br>Sets & Props Osei Duro, Super Bonjour<br>Styling Osei Duro, footwear and accessories sourced from Kantamanto Market<br>Models Eyiwaa, Amisum, Julee, David<br>Shot in Accra, Ghana',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#111E0C'
        }
      ]
    },
    {
      id: 2,
      title: 'slider.3.title',
      title2: 'slider.3.title2',
      slidesData: [
        {
          src: 'images/Fable_1.jpg',
          type: 'image'
        },
        {
          src: 'images/Fable_2.jpg',
          type: 'image'
        },
        {
          src: 'images/Fable_3.jpg',
          type: 'image'
        },
        {
          src: 'images/Fable_4.jpg',
          type: 'image'
        },
        {
          src: 'images/Fable_5.jpg',
          type: 'image'
        },
        {
          src: 'videos/Fable_6.mp4',
          type: 'video'
        },
        {
          src: 'Capturing the often overlooked in-between moments at home, our creative strategy positioned Fable’s  identity as slow, artisanal luxury. We defined codes that felt unique to Fable for a proprietary sense of refinement and emotionally engaging storytelling — while steering them away from a generic DTC look.',
          type: 'text',
          title: 'Brand Campaign Strategy',
          fontSize: '54px',
          color: '#CBD0BA',
          backgroundColor: '##290B15'
        },
        {
          src: 'Brand Audit & Campaign Strategy —<br>Review of the photo content on digital channels to establish a new strategy<br><br>2020 Campaign Shoot —<br> Creative Direction<br>Pre-production & On-set Direction<br>Ecomm Direction ',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '##290B15'
        },
        {
          src: 'Campaign Photography Mathieu Fortin<br>Campaign Videography Gerardo Alcaine<br>Sets & Props Audrey St-Laurent<br>Retouching & E-commerce Photography Bonesso Dumas<br>Copy Sacha Jackson<br>Produced & Shot at Studio L’Éloi, Montréal',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '##290B15'
        }
      ]
    },
    {
      id: 3,
      title: 'slider.4.title',
      title2: 'slider.4.title2',
      slidesData: [
        {
          src: 'images/HSCo_1.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_2.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_3.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_4.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_5.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_6.jpg',
          type: 'image'
        },
        {
          src: 'images/HSCo_7.jpg',
          type: 'image'
        },
        {
          src: 'A fresh take on everyone’s favourite backpack, we repositioned Herschel’s PNW roots: moving them out of the forest and into the world. Tapping into transformative travel, we explored the trip itself. How? Each season we discovered a new city with soul and a neighbourhood with community to tell stories about stepping outside and connecting to culture. ',
          type: 'text',
          title: 'Positioning & Seasonal Campaign Direction',
          fontSize: '54px',
          color: '#CABADF',
          backgroundColor: '#384163'
        },
        {
          src: 'In a creative partnership with their internal team, we supported their brand strategy by developing a distinct approach to seasonal versus product campaigns and a go-to-market strategy (drops and partnerships). <br><br>Creative Direction<br>Campaign Strategy<br>On-set Direction',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#384163'
        },
        {
          src: 'This edit includes images from various seasons<br>Photography Stephen Wilde<br>Styling Mila Franovic, Tiana Franks<br>Sets & Props Oliver Stenberg<br>HMU Maxine Munson, Becca Randle, Maria Walton<br>Production Marta Sanderson, Pip Groom, Robyn Farnham<br>Shot in LA, London & Vancouver',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#384163'
        }
      ]
    },
    {
      id: 4,
      title: 'slider.5.title',
      title2: 'slider.5.title2',
      slidesData: [
        {
          src: 'images/NP_1.jpg',
          type: 'image'
        },
        {
          src: 'images/NP_2.jpg',
          type: 'image'
        },
        {
          src: 'videos/NP_3.mp4',
          type: 'video'
        },
        {
          src: 'videos/NP_4.mp4',
          type: 'video'
        },
        {
          src: 'videos/NP_5.mp4',
          type: 'video'
        },
        {
          src: 'images/NP_6.jpg',
          type: 'image'
        },
        {
          addPadding: true,
          src: 'videos/NP_7.mov',
          type: 'video',
          backgroundColor: '#231F20'
        },
        {
          src: 'videos/NP_8.mp4',
          type: 'video'
        },
        {
          src: 'We had deep and honest conversations as we took the founders through Brand Therapy™. We busted the myths of a dated industry culture and uncovered their unique positioning. It informed a comprehensive ecosystem for Nine Point’s identity — elevated branding, a bold website and engaging social content for the future of progressive lifestyle and cannabis brands.',
          type: 'text',
          title: '(Re)Brand & Identity System',
          fontSize: '54px',
          color: '#4E151D',
          backgroundColor: '#C3862C'
        },
        {
          src: 'Our strategy evolved Nine Point’s brand identity into a complete ecosystem,including branding, design, direction, tone and photography.<br><br>Brand Strategy<br>Creative Direction<br>Identity & Digital Design<br>Voice & Messaging<br>Art Direction<br>Off-figure Sets & Props',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C3862C'
        },
        {
          src: 'Voice & Copy Sacha Jackson<br>Photography Jennifer Latour<br>Styling Leila Bani<br>HMU Karin Shoji',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C3862C'
        }
      ]
    },
    {
      id: 5,
      title: 'slider.6.title',
      title2: 'slider.6.title2',
      slidesData: [
        {
          src: 'images/HIRRS_1.jpg',
          type: 'image'
        },
        {
          src: 'images/HIRRS_2.jpg',
          type: 'image'
        },
        {
          src: 'images/HIRRS_3.jpg',
          type: 'image'
        },
        {
          src: 'images/HIRRS_4.jpg',
          type: 'image'
        },
        {
          src: 'images/HIRRS_5.jpg',
          type: 'image'
        },

        {
          src: 'images/HIRRS_6.jpg',
          type: 'image'
        },
        {
          src: "The body says what words cannot. Focusing on women's movement, the HIRRS launch campaign aimed to express a vulnerable, artful and quietly powerful voice that needs to be heard. Our direction countered traditional beauty ideals and challenged the male gaze. Bringing together an all woman crew, our approach updated the representation of women’s bodies.",
          type: 'text',
          title: 'Launch & Brand Campaign ',
          fontSize: '54px',
          color: '#FFFFFF',
          backgroundColor: '#290B15'
        },
        {
          src: 'Supporting their slow fashion ethos, we worked with the founders to establish a creative direction designed to last.<br><br>Creative Direction<br>Art Buying<br>Casting<br>On-set Direction',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#290B15'
        },
        {
          src: 'Photography Jennifer Latour<br>Assist. Emilia Kalka<br>Styling Lelia Bani<br>HMU Maxine Munson<br>Models Iman, Kiko & Rhi',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#290B15'
        }
      ]
    },
    {
      id: 6,
      title: 'slider.7.title',
      title2: 'slider.7.title2',
      slidesData: [
        {
          src: 'images/LB_1_1.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_1_2.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_1_3.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_1_5.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_1_6.jpg',
          type: 'image'
        },
        {
          src: 'Operating on a foundation of trust means we can experiment and take risks. The conceptual directions we define each seasonal are self-aware and researched. We pull from cultural events, behavioral trends and the ever shifting collective understanding of the world we live in. We invite new talent to the set, making sure we tell the story from a place of relevance and inclusivity.',
          type: 'text',
          title: 'Scope',
          color: '#4E151D',
          backgroundColor: '#C84600'
        },
        {
          src: 'Having history with the brand and team, SB x LB share a lot of trust and respect. As their campaign partners, we have had the pleasure to support their brand leaders and creative team.<br><br>Creative Direction<br>Campaign Strategy<br>Casting<br>Art Buying<br>On-set Direction<br>Seasonal Design Direction',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C84600'
        },
        {
          src: 'Photography Melissa Gamache, Pegah Farahmand, Carlo Calope<br>Assist. Renaud Lafrenière, Patrick Custo-Blanch, William Cole, Jeremy Bobrow, Aljosa Alijagic, Don Loga<br>Styling Frederique Gauthier, Tinashe Musara, Assist. Leah Grantham, Haji Maa<br>HMU Cynthia-Christina Cadieux, Marianne Caron, Léonie Lévesque, <br>Assist. Ana-Maria Cimpoia, Claudine Jourdain<br>Models Jefferson, Sophie, Jade, Celeste, Mustapha, Sheida, Damian, Miranda, Megane, Chelsea, Miles, Soukayna<br>Sets & Props Michaël Ho, Marie Hélène Lavoie<br>Production Kristia Louis-Seize, Studio L’Éloi, Little Burgundy Shoes',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C84600'
        }
      ]
    },
    {
      id: 7,
      title: 'slider.8.title',
      title2: 'slider.8.title2',
      slidesData: [
        {
          src: 'images/Rise_1.jpg',
          type: 'image'
        },
        {
          src: 'images/Rise_2.jpg',
          type: 'image'
        },
        {
          src: 'images/Rise_3.jpg',
          type: 'image'
        },
        {
          src: 'images/Rise_4.jpg',
          type: 'image'
        },
        {
          src: 'images/Rise_5.jpg',
          type: 'image'
        },
        {
          src: 'images/Rise_6.jpg',
          type: 'image'
        },
        {
          src: 'videos/Rise_7.mp4',
          type: 'video'
        },
        {
          src: 'When concepting for this launch, we landed on a strategy to revive RISE’s cultural relevance. Defining their creative pillars as emotion, vibrancy and wonder, we invited the audience to feel intellectually stimulated, and walk away with a story. Anchored in playful escapism, the campaign spoke to the perennially curious as a physical manifestation of indulgence.',
          type: 'text',
          title: 'New Product Launch OOH Campaign',
          fontSize: '54px',
          color: '#84402A',
          backgroundColor: '#C374F6'
        },
        {
          src: 'We built a creative strategy which recognized that the brand is larger than the product. Working in tandem with the brand strategist we developed an integrated campaign (photography, video, microsite direction, OOH design, event programming including guests and speakers, invitation design, and social media assets).<br><br>Creative Direction<br>On-set Direction<br>Design<br>Event & Activation ',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C374F6'
        },
        {
          src: 'Photography Mathieu Fortin, Nik Mirus<br>Assist. Alexis Belhumeur, Aljosa Alijagic, Jeremy Bobrow<br>Styling Marianne Dubreuil<br>HMU Nicolas Blanchet<br> Sets & Props Audrey St-Laurent<br>Brand Strategy Marissa De Miguel<br>Models Nicholas, Hawa, Yvan, Lina<br>Produced & Shot st Studio L’Éloi, Montréal<br>Graphic Design Assist. Vanessa Bourgault',
          type: 'text',
          title: 'Rise Kombucha',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C374F6'
        }
      ]
    },
    {
      id: 8,
      title: 'slider.9.title',
      title2: 'slider.9.title2',
      slidesData: [
        {
          src: 'images/KOMBI_1.jpg',
          type: 'image'
        },
        {
          src: 'images/KOMBI_2.jpg',
          type: 'image'
        },
        {
          src: 'images/KOMBI_3.jpg',
          type: 'image'
        },
        {
          src: 'images/KOMBI_4.jpg',
          type: 'image'
        },
        {
          src: 'images/KOMBI_5.jpg',
          type: 'image'
        },
        {
          src: 'images/KOMBI_6.jpg',
          type: 'image'
        },
        {
          src: 'We translated Kombi’s 60+ years of family history into vibrant, engaging images that invite all to join the fun. Partnering with them to myth bust performance and elitism in the outdoor space, we built a positioning around participation, play and inclusion. With Kombi, it’s a family thing.',
          type: 'text',
          title: 'Campaign Strategy',
          fontSize: '54px',
          color: '#FFFFFF',
          backgroundColor: '#3851BA'
        },
        {
          src: 'As Kombi’s strategic and creative partner we supported their internal team throughout campaign development from concept to production. Additionally, we supported the brand to shape their customer facing personality.<br><br>Creative Direction<br>Campaign Strategy<br>Concept<br>Voice & Messaging<br> Casting<br>Art Buying<br>On-set Direction<br>Seasonal Design Direction<br>Production',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#3851BA'
        },
        {
          src: 'Photography Kelly Jacob, Assist. Renaud Robert, Tom Berthelot<br>  Videography  Matt Charland, Oli Chapo<br>Styling Izabel Soucy, Assist. Samuel Joubert<br>HMU Valeria Amirova<br>Models Sam, Juliette, Jade, Cole, Rokko Riders<br>Catherine Perrault, Antoine St-Hilaire, Julien Gauthier, Jacob Gagnon<br>Producer Jade Fortin Côté, Assist. Alexis Gauvin B.',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#3851BA'
        }
      ]
    },
    {
      id: 9,
      title: 'slider.10.title',
      title2: 'slider.10.title2',
      slidesData: [
        {
          src: 'images/NIKE_1.jpg',
          type: 'image'
        },
        {
          src: 'images/NIKE_2.jpg',
          type: 'image'
        },
        {
          src: 'images/NIKE_3.jpg',
          type: 'image'
        },
        {
          src: 'images/NIKE_4.jpg',
          type: 'image'
        },
        {
          src: 'images/NIKE_5.jpg',
          type: 'image'
        },
        {
          addPadding: true,
          src: 'videos/NIKE_6.mp4',
          type: 'video',
          backgroundColor: '#222232'
        },
        {
          src: 'As part of the North American Nike campaign to revive the cultural caché of Air Max, we were brought on as the Canadian team. The images, featuring multimedia artist Will Selviz were rolled out at Nike and Foot Locker, in-store and online,  and to launch Air Max Day.',
          type: 'text',
          title: 'Air Max Will Selviz',
          fontSize: '54px',
          color: '#FFFFFF',
          backgroundColor: '#222232'
        },
        {
          src: 'Working closely with the in-house leads, we were on set in Vancouver to art direct and liaise with the Portland and NYC teams.',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#222232'
        },
        {
          src: 'Vancouver Team — <br>Talent Will Selviz <br>Photography Conor Cunningham <br>Assist. Rob Seebacher, Mats Schram, Donnel Barroso <br>Styling Leila Bani, Assist. Masha Pazhouh, Deo Cruz <br>HMU Christopher Deagle <br>DOP The Pool Service <br>Production Design Hank Mann <br>Sets & Props Freddy Harder, Lauren Barrufa <br>1st AD Richard Amies<br>Production Blue Amber, Vancouver',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#222232'
        }
      ]
    },
    {
      id: 10,
      title: 'slider.11.title',
      title2: 'slider.11.title2',
      slidesData: [
        {
          src: 'images/LB_2_1.jpg',
          type: 'image'
        },
        {
          imageSrc: 'images/LB_2_2.jpg',
          videoSrc: 'videos/LB_2_2v.mp4',
          type: 'two-columns'
        },
        {
          src: 'images/LB_2_3.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_2_4.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_2_5.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_2_6.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_2_7.jpg',
          type: 'image'
        },
        {
          src: 'images/LB_2_8.jpg',
          type: 'image'
        },
        {
          src: 'Photography Kelly Jacob, Akina Chan, Briggs Ogloff, William Arcand, Marie H. Rainville, Assist. Don Loga, Emily Velasquez Gilbert, Kyle Gibson, Alex Guiry, Axel & Jacques Palomares, Greg Beck <br>Videography Gerardo Alcaine <br>Styling Tinashe Musara, Leila Bani, Tiana Franks, Frédérique Gauthier, Izabel Soucy, Assist. Eunice Huot, Alyson Holler <br>Sets & Props Evelyne Morin <br>HMU Ashley Diabo, Maxine Munsun, Maria Walton, Alana & Maddie Alper, Léonie Lévesque, Claudine Jourdain <br>Models Ivy, Jamil, Ludovie, Kevin, Simone, Zacc, Anastasia, Tatenda, Shade, Whitney, Ciana Yekta, Chanel, Noémie Jérôme, Naomy, Adams, <br>Production Aaron Van Dyck (Vancouver),  Kristia Louis-Seize (Montréal)',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#A3232E'
        }
      ]
    },
    {
      id: 11,
      title: 'slider.12.title',
      title2: 'slider.12.title2',
      slidesData: [
        {
          src: 'images/CIS_1.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_2.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_3.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_4.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_5.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_6.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_7.jpg',
          type: 'image'
        },
        {
          src: 'images/CIS_8.jpg',
          type: 'image'
        },
        {
          src: 'We updated the brand strategy to support the client’s shift from trend retailer to a purpose-driven brand. We brought significant changes to the DNA, resetting them on a foundation of inclusion, a community-first approach that is still true to the brand today. Extending these values behind the lens with the crew and talent allowed us to prove the Call It Spring family is real.',
          type: 'text',
          title: 'Creative Direction & Brand DNA',
          fontSize: '54px',
          color: '#C34C25',
          backgroundColor: '#CABADF'
        },
        {
          src: 'As the once-upon-a-time in house, we go way back. Our history, trust and deep understanding of their business reality positioned us as long-term partners.<br><br>Creative Direction<br>Brand Strategy<br>Messaging Casting<br>On-set Direction<br>SB Secret Sauce Shot List<br>Shoe Face Ratio™',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#CABADF'
        },
        {
          src: 'This edit includes images from various seasons.<br>Photography Tim Barber Styling Imogene Barron<br>Sets & Props Sean Daly<br>HMU Nikki Providence, Sandy Ganzer, Danielle & Nicole Kahlani<br>Models KC, Dronme, Sandrine, Shaheem, Barbie, Julian, Christie, Alexis, Bella,Sahra, Josiah<br>Production The Production Club, Jade Jean-Marie, Natasha Forte, Camp Productions <br>Shot on location in LA & London',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#CABADF'
        }
      ]
    },
    {
      id: 12,
      title: 'slider.13.title',
      title2: 'slider.13.title2',
      slidesData: [
        {
          src: 'images/LOUISE_1.jpg',
          type: 'image'
        },
        {
          src: 'images/LOUISE_2.jpg',
          type: 'image'
        },
        {
          src: 'images/LOUISE_3.jpg',
          type: 'image'
        },
        {
          src: 'images/LOUISE_4.jpg',
          type: 'image'
        },
        {
          src: 'How do you begin with a sound and create imagery that speaks to the emotion and personal message of a song?<br>With Louise Burns, coming to terms with teen stardom led her towards heartbreaking introspection and her fourth album, Portraits. Our creative direction recognized her growth and spoke to the strength of being a grown ass woman.',
          type: 'text',
          title: 'Creative Direction & Design',
          fontSize: '54px',
          color: '#FFFFFF',
          backgroundColor: '#1D1D1D'
        },
        {
          src: 'We worked collaboratively  with Louise to define her new look and build the team to help create it.<br><br>Creative Direction<br>On-set Direction<br>Graphic Design',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#1D1D1D'
        },
        {
          src: 'Photography Jennifer Latour<br>Styling Redia Soltis<br>HMU Taylor Smits, Harriet Sales',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#1D1D1D'
        }
      ]
    },
    {
      id: 13,
      title: 'slider.14.title',
      title2: 'slider.14.title2',
      slidesData: [
        {
          src: 'images/GHANA_1.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_2.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_3.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_4.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_5.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_6.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_7.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_8.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_9.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_10.jpg',
          type: 'image'
        },
        {
          src: 'images/GHANA_11.jpg',
          type: 'image'
        },
        {
          src: 'Through our relationship with Osei Duro, we<br>experienced something beyond a typical partnership.<br>We collaborated with creatives in many cities, travelled and immersed ourselves in different realities, and challenged our understanding of (slow) fashion. It fundamentally changed our understanding of the industry, our practice and our impact.',
          type: 'text',
          title: 'A Photo Essay on Slow Fashion',
          fontSize: '54px',
          color: '#E1D8CA',
          backgroundColor: '#111E'
        },
        {
          src: 'Campaign Photography Jessica Sarkodie, Mathieu Fortin <br>Film & Travel Photography Super Bonjour<br>Sets & Props Osei Duro, Super Bonjour <br>Styling Osei Duro, Jay Forest<br>HMU by Alana & Maddie Alper<br>Models Nuerki, Penny<br>Shot in Montréal and in various locations around Accra, Ghana',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#111E'
        }
      ]
    },
    {
      id: 14,
      title: 'slider.15.title',
      title2: 'slider.15.title2',
      slidesData: [
        {
          src: 'images/DT1_1.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_2.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_3.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_4.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_5.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_6.jpg',
          type: 'image'
        },
        {
          src: 'images/DT1_7.jpg',
          type: 'image'
        },
        {
          src: 'As their creative partners, we worked with the in-house team to course correct their positioning vis-a-vis a booming wellness industry. We refined a proprietary take on self-care and rituals, updated their overall design codes to inform their campaigns, packaging, tone and OOH messaging.',
          type: 'text',
          title: 'Brand Positioning & Campaign Strategy',
          fontSize: '54px',
          color: '#FFFFFF',
          backgroundColor: '#290B15'
        },
        {
          src: 'Creative Direction, Campaign Strategy, Art Buying & On-set Direction<br>Video Storyboarding & Direction<br>Packaging Design ',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#290B15'
        },
        {
          src: 'This edit includes images from various seasons<br>Photography by Mathieu Fortin<br>Assist. Martin Lacroix, Marc-André Dumas, Carlo Calope,<br>Gerardo Alcaine Sets & Props Evelyne Morin, Audrey St-Laurent<br>Production Studio L’Éloi, Montréal',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#290B15'
        }
      ]
    },
    {
      id: 15,
      title: 'slider.16.title',
      title2: 'slider.16.title2',
      slidesData: [
        {
          src: 'images/Saxx_1.jpg',
          type: 'image'
        },
        {
          src: 'images/Saxx_2.jpg',
          type: 'image'
        },
        {
          src: 'images/Saxx_3.jpg',
          type: 'image'
        },
        {
          src: 'images/Saxx_4.jpg',
          type: 'image'
        },
        {
          src: 'images/Saxx_5.jpg',
          type: 'image'
        },
        {
          src: 'images/Saxx_6.jpg',
          type: 'image'
        },
        {
          src: 'For the love of dad — a feminist take on Father’s Day, updating how men are portrayed. Inspired by Linda McCartney’s family photos, our concept was anchored in the compassionate and tender gaze of a partner. Challenging the outdated codes of masculinity, we analyzed what it means to be a father (figure) today and crafted a love letter to the true spirit of fatherhood.',
          type: 'text',
          title: 'Campaign Concept & Storytelling',
          fontSize: '54px',
          color: '#C84600',
          backgroundColor: '#CABADF'
        },
        {
          src: 'Sometimes, casting needs to happen on both sides of the lens. We reached out to our community to find the right pairing of family and photographer. <br>Partnering with our favorite London-based photographer, Imogene Barron, we captured sweet father-daughter moments at the Jean-Marie home.<br><br>Creative Direction<br>Messaging<br>Casting<br>Art Buying<br>Virtual Art Direction',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#CABADF'
        },
        {
          src: 'Photography Imogene Barron, Assist James Giffiths<br>Styling Imogene Barron, Assist. Alicia Ellis<br>London Production Jade Jean-Marie<br>Vancouver Production Aaron Van Dyck<br>Featuring The Jean-Marie Family — Leon, Iggy & Milou<br>Shot on location in London',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#CABADF'
        }
      ]
    },
    {
      id: 16,
      title: 'slider.17.title',
      title2: 'slider.17.title2',
      slidesData: [
        {
          src: 'images/ALTI_1.jpg',
          type: 'image'
        },
        {
          src: 'images/ALTI_2.jpg',
          type: 'image'
        },
        {
          src: 'images/ALTI_3.jpg',
          type: 'image'
        },
        {
          src: 'images/ALTI_4.jpg',
          type: 'image'
        },
        {
          src: 'images/ALTI_5.jpg',
          type: 'image'
        },
        {
          src: 'images/ALTI_6.jpg',
          type: 'image'
        },
        {
          src: 'Starting from a copy brief, we rooted this concept in emotional insights, designed to unite. Capturing that very moment of transformation — the feeling of achieving a new personal best — we called in a community of lunchtime athletes and introducing them to their new favorite retailer.',
          type: 'text',
          title: 'OOH Campaign Direction',
          fontSize: '54px',
          color: '#F8D0FB',
          backgroundColor: '#C34C25'
        },
        {
          src: 'We joined the in-house team to develop an awareness campaign for multiple cities and new markets.<br><br>Campaign Strategy & Qualitative Insights<br>Storyboarding, Casting & On-set Direction<br>SB Secret Sauce Shot List',
          type: 'text',
          title: 'Scope',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C34C25'
        },
        {
          src: 'Photography by Mathieu Fortin, Assist. Aljosa Alijagic, William Cole<br> Styling by Farah Benosman, Assist. Marianne Blais & Pascale Tessier<br>Sets & Props Mathilde Beaudoin-Tessier, Jean-Philippe Pelletier<br>HMU Valeria Amirova, Assist. Marie-Pier Tardif<br>Models Sheida, Noémie, Diizon, Amélie<br> Production Jordan R. Bruneau, Madame Brown<br>Shot at the Olympic Stadium, Montréal ',
          type: 'text',
          title: 'Credits',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#C34C25'
        }
      ]
    },
    {
      id: 17,
      title: 'slider.18.title',
      title2: 'slider.18.title2',
      slidesData: [
        {
          src: 'images/DT_2_1.jpg',
          type: 'image'
        },
        {
          src: 'images/DT_2_2.jpg',
          type: 'image'
        },
        {
          src: 'images/DT_2_3.jpg',
          type: 'image'
        },
        {
          src: 'images/DT_2_4.jpg',
          type: 'image'
        },
        {
          addPadding: true,
          backgroundColor: '#9A7429',
          src: 'videos/DT_2.mp4',
          type: 'video'
        },
        {
          src: 'images/DT_2_6.jpg',
          type: 'image'
        },
        {
          src: 'images/DT_2_7.jpg',
          type: 'image'
        },
        {
          src: 'Creative Direction, Campaign Strategy & On-set Direction Super Bonjour<br>This edit includes images from various seasons.<br>Photography Nik Mirus, Mathieu Fortin<br>Assist. Jeremy Bobrow, Marc-André Dumas<br>DOP Nik Mirus Assist. Gerardo Alcaine, Gaffer Bastien Mayer, Grip Stéphane Klopp<br>Copy & Script Sacha Jackson<br>Sets & Props Evelyne Morin, Audrey St-Laurent, Michaël Ho<br>Styling Rima Chahine<br>Produced & Shot at Studio L’Éloi, Montréal',
          type: 'text',
          title: 'Fable Home',
          font: 'roc-grotesk, sans-serif',
          fontSize: '30px',
          color: '#E2EE75',
          backgroundColor: '#9A7429'
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Super Bonjour</title>
  <meta name="title" content="Creative Studio" />
  <meta
    name="description"
    content="We specialize in strategy, branding & content. We work with brands seeking cultural relevance. We advocate for progressive & sustainable values."
  />
  <meta
    name="viewport"
    content="height=device-height, initial-scale=1, width=device-width, initial-scale=1"
  />
  <meta property="og:url" content="https://www.superbonjour.com/" />
</svelte:head>
<svelte:body
  on:viewportchanged={() => {
    if (!viewport) return;
    innerWidth = viewport.Width;
    innerHeight = viewport.Height;
  }}
  on:resize={() => {
    if (!viewport) return;
    innerWidth = viewport.Width;
    innerHeight = viewport.Height;
  }}
  on:orientationchangeend={() => {
    if (!viewport) return;
    innerWidth = viewport.Width;
    innerHeight = viewport.Height;
    isLandscapeView = viewport.Orientation === 'landscape';
  }} />

{#if entranceOpen}
  <div class="entrance" out:fade={{ duration: 450 }}>
    <SplitLanding studioOpen={modalOpen} on:enter={() => { entranceOpen = false; }} on:studio={showModal} />
  </div>
{:else}
{#if introOpen}
  <SlidingIntro bind:zoom={introZoom} initialView={introView} projects={projectsArray.slice(0, MAX_DISPLAY_PROJECT)} studioOpen={modalOpen} on:select={openIntroProject} on:studio={showModal} on:closestudio={hideModal} />
{:else}
<header class="project-header">
  <button class="project-logo" aria-label="Super Bonjour home" on:click={() => { introView = 'work'; introOpen = true; window.scrollTo(0, 0); }}>
    <img src="/images/intro/logo.png" alt="Super Bonjour" />
  </button>
  <nav aria-label="Project navigation">
    <button class="active" on:click={() => { introView = 'work'; introOpen = true; window.scrollTo(0, 0); }}>WORK</button>
    <button on:click={() => { introView = 'index'; introOpen = true; window.scrollTo(0, 0); }}>INDEX</button>
    <button on:click={showModal}>STUDIO</button>
  </nav>
</header>
<!-- Show a warning in portrait mode to rotate your phone. -->
<div class="mobile-portrait" style={`width:${innerWidth ? innerWidth + 'px' : '100vw'}`}>
  <div style="position:relative">
    <img class="image-logo mobile" src="images/mobile_super_bonjour.svg" alt="Logo" />

    <p class="mobile-portrait-message">
      Bonjour! <span style="color:#f86c00">✿</span>
      Our work looks best, viewed on desktop. We love a big screen with lots of pixels, but if
      <span style="color:#F8D0FB">☏</span>
      mobile's your thing <span style="color:#E0A239">➙</span>
      <span style="color:#f86c00">rotate your device</span>, that would be Super
      <span style="color:#F8D0FB">❛‿❛</span>
    </p>
  </div>
  <div style="display:flex; justify-content:space-between; margin-top:2rem;">
    <iframe
      title="dog on phone gif"
      src="https://giphy.com/embed/vM07ENm3Ue8xO"
      width={`${innerWidth / 4}`}
      height={`${innerWidth / 4}`}
      frameBorder="0"
      class="giphy-embed"
      allowFullScreen
    ></iframe>
    <img style="transform:translate(0%,-35%)" src="images/peace_hand.svg" alt="peace hand" />
  </div>
</div>

<main>
  {#if projectsArray.find((project) => project.id === selectedProjectId)}
    <ProjectView project={projectsArray.find((project) => project.id === selectedProjectId)} />
  {/if}
</main>
{/if}
{/if}
<PopUp bind:modalOpen isMobile={isMobile && isLandscapeView} />

<style>
  .entrance { position: fixed; inset: 0; z-index: 20; overflow: auto; }
  :global(body) {
    padding: 0;
  }
  .project-header {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    z-index: 5;
    max-width: 1440px;
    height: 18px;
    margin: 0 auto;
  }
  .project-header button {
    padding: 0;
    margin: 0;
    border: 0;
    background: transparent;
    color: #000;
    font-family: roc-grotesk, sans-serif;
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
    cursor: pointer;
  }
  .project-logo {
    position: absolute;
    left: 5.15%;
    top: 0;
    width: 44px;
    height: 18px;
  }
  .project-logo img {
    display: block;
    width: 44px;
    height: 18px;
    object-fit: contain;
  }
  .project-header nav {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
  }
  .project-header button.active {
    color: #bd62ff;
  }
  .project-header button:focus-visible {
    outline: 2px solid #bd62ff;
    outline-offset: 5px;
  }
  .mobile-portrait {
    display: none;
  }

  /* Portrait Mobile*/
  @media screen and (max-device-width: 480px) and (orientation: portrait) {
    .mobile-portrait {
      display: block;
      box-sizing: border-box;
      position: fixed;
      background: #0003fe;
      height: 100vh;
      z-index: 1000;
      padding: 3rem;
      overflow: scroll;
    }

    .mobile-portrait-message {
      font-family: roc-grotesk;
      color: #e2ee75;
      font-size: 24px;
      line-height: 1.3;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
  @media screen and (max-width: 600px) {
    .project-logo {
      left: 20px;
    }
  }
</style>
