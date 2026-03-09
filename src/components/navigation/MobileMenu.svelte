<script>
  import { tick } from 'svelte';

  let { navItems = [], currentPath = '' } = $props();
  let isOpen = $state(false);

  async function openMenu() {
    isOpen = true;
    document.body.style.overflow = 'hidden';
    await tick();
    // Re-initialize Lucide icons if they exist in the DOM
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function closeMenu() {
    isOpen = false;
    document.body.style.overflow = '';
  }

  function handleLinkClick() {
    closeMenu();
  }
</script>

<!-- Hamburger Button -->
<button 
  onclick={openMenu}
  type="button"
  class="lg:hidden p-2 text-secondary hover:text-primary transition-colors cursor-pointer" 
  aria-label="Open menu"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
</button>

<!-- Full Screen Menu -->
<div 
  id="mobile-nav" 
  class="fixed inset-0 w-full h-screen bg-surface z-[100] transition-transform duration-500 ease-in-out lg:hidden flex flex-col {isOpen ? 'open' : ''}"
>
  <!-- Header inside mobile nav -->
  <div class="h-16 flex items-center justify-between px-4 border-b border-subtle">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-[#9B2226] flex items-center justify-center text-white font-bold text-sm">
        FNN
      </div>
      <span class="font-bold text-lg tracking-tight lang-ar pb-1">الفنانين</span>
      <span class="font-bold text-lg tracking-tight lang-en hidden">Al-Fananin</span>
    </div>
    <button 
      onclick={closeMenu}
      type="button"
      class="p-2 text-secondary hover:text-primary cursor-pointer" 
      aria-label="Close menu"
    >
      <i data-lucide="x" class="w-8 h-8"></i>
    </button>
  </div>

  <!-- Navigation Links -->
  <nav class="flex-1 flex flex-col items-center justify-center gap-8 text-2xl px-6 py-12 overflow-y-auto">
    {#each navItems as item}
      <a 
        href={item.href} 
        onclick={handleLinkClick}
        class="font-bold hover:text-[#9B2226] transition-all transform hover:scale-110 f-amiri {currentPath === item.href ? 'text-[#9B2226]' : 'text-primary'}"
      >
        <span class="lang-ar">{item.labelAr}</span>
        <span class="lang-en hidden">{item.labelEn}</span>
      </a>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="p-8 border-t border-subtle text-center">
    <p class="text-xs text-muted font-medium tracking-widest uppercase mb-4">Al-Fananin 2026</p>
  </div>
</div>

<style>
  #mobile-nav {
    transform: translateY(-100%);
    visibility: hidden;
  }
  
  #mobile-nav.open {
    transform: translateY(0);
    visibility: visible;
  }

  /* Ensure languages display correctly based on document lang */
  :global(html[lang="ar"]) .lang-ar { display: block; }
  :global(html[lang="ar"]) .lang-en { display: none; }
  :global(html[lang="en"]) .lang-ar { display: none; }
  :global(html[lang="en"]) .lang-en { display: block; }
</style>
