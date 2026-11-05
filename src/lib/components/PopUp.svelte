<svelte:options runes={false} />

<script>
  import { fly } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import SayBonjour from '#lib/components/SayBonjour.svelte';

  let scrollY;
  export let modalOpen = false;
  export let bonjourOpen = false;
  export let isMobile;
  function showModal() {
    modalOpen = true;
  }
  function hideModal() {
    modalOpen = false;
  }

  function showBonjourDialog() {
    bonjourOpen = true;
  }
  function hideBonjourDialog() {
    bonjourOpen = false;
  }
</script>

<svelte:window bind:scrollY />

{#if modalOpen}
  <div
    class="popup"
    transition:fly={{
      y: -window.innerHeight,
      duration: 1000
    }}
  >
    <img src="images/dialog-icon.png" class="dialog-icon" alt="Dialog icon" on:click={hideModal} />
    <img
      src="images/dialog-icon-mobile.png"
      class="dialog-icon mobile"
      alt="Dialog icon"
      on:click={hideModal}
    />
    <img
      src="images/dialog-icon-mobile.png"
      class="dialog-icon mobile"
      alt="Dialog icon"
      on:click={hideModal}
    />
    {#if !isMobile}
      <div class="bonjour-button" on:click={showBonjourDialog}>{$_('dialog.sayBonjour')}</div>
    {/if}
    {#if bonjourOpen && !isMobile}
      <div
        class="bonjour-dialog"
        transition:fly={{
          x: window.innerWidth,
          duration: 1000
        }}
      >
        <SayBonjour {hideBonjourDialog} />
      </div>
    {/if}
    <div class="modal-container">
      {#if !isMobile}
        <img src="images/dialog-center.jpeg" class="dialog-center" alt="Dialog center" />
      {/if}
      <img class="image-logo" src="images/00-sb-logo-simple-white.svg" alt="Logo" />
      <div class="modal-section left-side">
        <div class="modal-section-content">
          <h5 class="title">{$_('dialog.title')}</h5>
          <p class="left-text">
            {$_('dialog.leftText')}
          </p>
        </div>
      </div>
      <img
        src="images/dialog-center-mobile.jpeg"
        class="dialog-center-mobile"
        alt="Dialog center"
      />
      <div class="modal-section right-side">
        <div class="right modal-section-content">
          <div class="services">
            <h5 class="title">{$_('dialog.services.title')}</h5>
            <ul>
              <li>{@html $_('dialog.services.strategy')}</li>
              <li>{@html $_('dialog.services.branding')}</li>
              <li>{@html $_('dialog.services.design')}</li>
              <li>{@html $_('dialog.services.creativeDirection')}</li>
              <li>{@html $_('dialog.services.artDirection')}</li>
              <li>{@html $_('dialog.services.motion')}</li>
              <li>{@html $_('dialog.services.production')}</li>
              <li>{@html $_('dialog.services.digital')}</li>
              <li>{@html $_('dialog.services.content1')}</li>
              <li>{@html $_('dialog.services.content2')}</li>
              <li>{@html $_('dialog.services.content3')}</li>
            </ul>
          </div>
          <div class="client-list">
            <h5 class="title">{$_('dialog.clientList.title')}</h5>
            <ul>
              <li>Nike</li>
              <li>Herschel Supply</li>
              <li>Kombi</li>
              <li>Altitude Sports</li>
              <li>Ground Sounds</li>
              <li>Saje Wellness</li>
              <li>Fable Home</li>
              <li>Nine Point Cannabis PR</li>
              <li>Frank Ghery, The Grand LA</li>
              <li>Osei Duro</li>
              <li>HIRRS Bodywear</li>
              <li>La Firme</li>
              <li>Alain Carle Architect</li>
              <li>Little Burgundy Shoes</li>
              <li>Call It Spring</li>
              <li>ALDO</li>
              <li>DAVIDs TEA</li>
              <li>Kit & Ace</li>
              <li>Eddie Bauer</li>
              <li>enRoute</li>
              <li>SAXX</li>
              <li>RISE Kombucha</li>
            </ul>
          </div>
        </div>
        {#if isMobile}
          <img src="images/dialog-center.jpeg" alt="Dialog center" style="width:50%" />
        {/if}
      </div>
      {#if isMobile}
        <div class="bonjour-dialog mobile">
          <SayBonjour isMobile={true} />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .services li {
    margin-bottom: 8px;
    line-height: 130%;
  }

  .popup {
    height: 80vh;
    width: 100vw;
    position: fixed;
    z-index: 1500;
  }
  .modal-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    align-content: stretch;
    height: 80vh;
    width: 100vw;
    font-family: 'roc-grotesk';
    overflow-y: hide;
    position: relative;
  }
  .modal-section {
    width: 50%;
    min-width: 300px;
    flex: 1 1 auto;
    /* overflow-y: auto; */
    /* padding-bottom: 530px; */
    /* height: 100%; */
  }
  .left-side {
    background-color: #1900ff;
  }
  .right-side {
    background-color: #e2ee75;
  }
  .modal-section-content {
    padding: 50px;
    padding-top: 150px;
    position: relative;
    font-family: 'moret';
    padding-bottom: 0;
  }
  .modal-section-content p {
    position: relative;
    left: 0;
    z-index: 1;
    margin-top: 5px;
  }
  .dialog-icon {
    position: absolute;
    right: -10px;
    width: 64px;
    height: 39px;
    padding: 60px;
    cursor: pointer;
    z-index: 4;
  }
  .dialog-icon.mobile {
    display: none;
  }
  .modal-container {
    color: #fff;
    overflow: auto;
  }

  h5.title {
    font-family: 'Opposit-Medium';
    font-weight: 100;
    font-size: 18px;
    color: #e2ee75;
    margin-bottom: 2px;
    margin-left: 5px;
  }

  .dialog-center {
    position: absolute;
    top: 120%;
    left: 48%;
    /* transform: translate(-50%, -50%); */
    width: 350px;
  }

  .left-text {
    font-size: 54px;
    line-height: 130%;
  }

  .right.modal-section-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-family: 'roc-grotesk';
    font-size: 18px;
  }

  .right.modal-section-content h5 {
    color: #c84501;
    font-weight: 200;
    margin-left: -20px;
  }
  .right.modal-section-content ul {
    line-height: 130%;
    margin-bottom: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
    color: #1900ff;
    margin-left: -20px;
  }
  .dialog-center-mobile {
    display: none;
  }

  .right.modal-section-content h5 {
    color: #c84501;
    font-weight: 200;
    margin-left: -20px;
  }
  .right.modal-section-content ul {
    list-style: none;
    margin: 0;
    padding: 0;
    color: #1900ff;
    margin-left: -20px;
  }
  .dialog-center-mobile {
    display: none;
  }

  .image-logo {
    position: absolute;
    left: 55px;
    top: 30px;
    width: 177px;
    height: 76px;
    z-index: 1;
  }
  .bonjour-button {
    background-color: #E93E3E;
    writing-mode: vertical-rl;
    text-orientation: sideways;
    position: absolute;
    right: 50px;
    top: 375px;
    color: #1900ff;
    padding: 10px;
    border-radius: 14.33px;
    font-size: 0.8rem;
    z-index: 2;
    font-weight: 400;
    font-family: 'moret';
    cursor: pointer;
    width: 8px;
    line-height: 8px;
    text-transform: uppercase;
  }
  .bonjour-dialog {
    width: 485px;
    height: 560px;
    position: absolute;
    z-index: 3;
    background-color: #f86c01;
    border: solid 1px #f86c01;
    top: 13vh;
    right: 0;
    padding: 25px;
  }

  @media screen and (max-width: 600px) {
    .image-logo {
      position: absolute;
      left: 25px;
      top: 20px;
      width: 117px;
      height: 4.75rem;
      z-index: 1;
    }

    .modal-section {
      width: 100%;
      flex: 1;
      overflow: initial;
      padding-bottom: 0px;
    }
    .dialog-center-mobile {
      display: block;
      width: 100vw;
      height: auto;
      object-fit: cover;
    }
    .dialog-center {
      display: none;
    }

    .modal-container {
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: normal;
      overflow-y: auto;
      height: 100vh;
      align-items: flex-start;
      align-content: flex-start;
    }
    .modal-section-content p {
      position: relative;
      margin-left: -45px;
      padding-top: 30px;
      margin-top: 0;
      margin-bottom: 0;
      left: 25px;
    }
    .bonjour-dialog {
      width: 70vw;
      height: 70vh;
      top: 100px;
    }

    .dialog-icon {
      display: none;
    }
    .dialog-icon.mobile {
      width: 37px;
      display: block;
      height: 23px;
      padding-top: 55px;
      padding-right: 40px;
    }

    .right.modal-section-content {
      padding-top: 0;
    }
    .left-text {
      font-size: 30px;
      line-height: 39px;
    }

    h5.title {
      font-family: 'Opposit-Medium';
      font-weight: 100;
      font-size: 18px;
      color: #e2ee75;
      margin-bottom: 2px;
      margin-left: -20px;
    }
  }

  /* Landscape Mobile*/
  @media screen and (max-width: 1200px) and (max-height: 499px) {
    .bonjour-button {
      display: none;
    }
    .dialog-icon {
      width: 25px;
      height: unset;
      padding: 20px;
      margin-top: 20px;
      margin-right: 25px;
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

    .modal-container {
      background: #1900ff;
    }

    .modal-section {
      padding-bottom: 0px;
      height: unset;
      display: flex;
      flex-direction: column;
    }

    .modal-section .modal-section-content {
      padding: 35px;
      padding-right: 10px;
    }

    .modal-section .modal-section-content .title {
      font-size: 12px;
      margin: 50px 0px;
      margin-bottom: 30px;
    }
    .modal-section .modal-section-content .left-text {
      font-size: 20px;
      line-height: 1.3;
      left: 0;
      margin: 0;
    }

    .modal-section .right {
      box-sizing: border-box;
      padding-left: 10px;
      padding-right: 35px;
      display: flex;
      font-size: 12px;
      flex: 1;
    }
    .modal-section .right .services li {
      margin-bottom: 0;
    }

    .modal-section .right .services,
    .modal-section .right .client-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      line-height: 1.3;
    }
    .modal-section .right .services ul,
    .modal-section .right .client-list ul {
      margin-left: 0;
    }

    .bonjour-dialog.mobile {
      width: 100%;
      height: unset;
      position: unset;
      border: 0px;
      padding: 0.5rem 10px;
      margin-left: 25px;
    }
  }
</style>
