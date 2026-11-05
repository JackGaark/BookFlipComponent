<svelte:options runes={false} />

<script>
  import { _ } from 'svelte-i18n';

  export let hideBonjourDialog;
  export let isMobile;
</script>

<div class="bonjour-dialog-container">
  <div>
    <h1>{$_('dialog.sayHi.title')}</h1>
    <p class="p1">
      {$_('dialog.sayHi.p1.text1')}
      <!-- {$_('dialog.sayHi.p1.text2')} -->
      {#if isMobile}
        <br />
        <br />
      {/if}
      {@html $_('dialog.sayHi.p1.text3')}
      <br />
      <br />
      
      {#if !isMobile}
        {$_('dialog.sayHi.p1.text4')}
      {/if}
      <!-- {$_('dialog.sayHi.p1.text5')}
      {$_('dialog.sayHi.p1.text6')}
      {$_('dialog.sayHi.p1.text7')} -->
    </p>
  </div>
  <div>
    {#if isMobile}
      <h1 style="opacity:0; visibility:hidden">{'Founded by'}</h1>

      <p>
        {$_('dialog.sayHi.p1.text4')}
      </p>
    {/if}
    <div class="address">
      <h4>{@html $_('dialog.sayHi.address1.title')}</h4>
      <span>{$_('dialog.sayHi.address1.text')}</span>
    </div>
    <div class="address">
      <h4>{@html $_('dialog.sayHi.address2.title')}</h4>
      <span>{$_('dialog.sayHi.address2.text')}</span>
    </div>

    <div class="footer">
        <div class="social">
          <h3>
            <a href="mailto:salut@superbonjour.com" target="__blank" class="contact-link">GENERAL INQUIRIES
            </a> 
            <a href="https://www.instagram.com/super_bonjour/" target="__blank" class="contact-link">
              <span>·</span>
              IG
            </a>
            <a href="https://www.linkedin.com/company/super-bonjour/" target="__blank" class="contact-link">
              <span>·</span>
              LINKEDIN
            </a>
          </h3>
        </div>

      <p>{$_('dialog.sayHi.footer.text')}</p>
      <p>{$_('dialog.sayHi.disclaimer.text')}</p>
    </div>
    {#if !isMobile}
      <div class="bonjour-button close" on:click={hideBonjourDialog}>
        {$_('dialog.sayBonjour')}
      </div>
    {/if}
  </div>
</div>

<style>
    

    .bonjour-button {
    background-color: #E93E3E;
    writing-mode: vertical-rl;
    text-orientation: sideways;
    position: absolute;
    right: 50px;
    top: 400px;
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
  }

  .bonjour-dialog-container {
    position: relative;
    color: #1f0edf;
    overflow-y: auto;
    font-family: 'roc-grotesk';
    font-size: .875rem;
    font-weight: 400;
  }
  .bonjour-dialog-container h1 {
    font-weight: 100;
    font-size: 1rem;
    font-family: 'Opposit-Medium';
    color: #fff;
  }
  .bonjour-dialog-container h4 {
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 700;
    font-size: .875rem;
    font-family: 'roc-grotesk';
  }
  .bonjour-dialog-container .p1 {
    font-size: 0.875rem;
    font-weight: 400;
    font-family: 'roc-grotesk';
    width: 80%;
    margin-top: 5px;
  }
  .bonjour-dialog-container .footer {
    color: #000;
    margin-top: 35px;
    font-size: 0.775rem;
    font-weight: 200;
    font-family: 'roc-grotesk';
  }

  

  .bonjour-dialog-container .footer .social h3 {
    font-size: 1rem;
    letter-spacing: .015rem;
    font-family: 'moret';
    color: #e2ee75;
  }

  .bonjour-dialog-container .footer .social h3 span {
    color: #f8d0fb;
  }
  .bonjour-button.close {
    background-color: #1f0edf;
    color: #f86c01;
    top: 245px;
    right: 25px;
    text-transform: uppercase;
  }

  @media screen and (max-width: 600px) {
    .bonjour-button {
      top: 120px;
      right: 50px;
    }

    .bonjour-button.close {
      top: 5px;
      right: 25px;
    }
  }

  /* Landscape Mobile*/
  @media screen and (max-width: 1200px) and (max-height: 499px) {
    .bonjour-dialog-container {
      display: flex;
    }
    .bonjour-dialog-container h1 {
      font-size: 1rem;
    }
    .bonjour-dialog-container p,
    .bonjour-dialog-container .p1 {
      line-height: 1.3;
      font-size: 1rem;
    }

    .bonjour-dialog-container .footer p {
      font-size: 1rem;
    }
    .bonjour-button {
      display: none;
    }
  }
</style>
