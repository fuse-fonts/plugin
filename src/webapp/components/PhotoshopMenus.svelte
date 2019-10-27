<script>
  import PhotoshopIcon from "components/PhotoshopIcon.svelte";

  export let menuItems = [
    "File",
    "Edit",
    "Image",
    "Layer",
    "Type",
    "Select",
    "Filter",
    "3D",
    "View",
    "Window",
    "Help",
  ];

</script>

<header class="bar">
  <nav class="menu-container">
    <div class="icon">
      <PhotoshopIcon />
    </div>
    <ol class="menu">
      {#each menuItems as item}
        <li>{item}</li>
      {/each}
    </ol>
  </nav>
  <h3>
    Not really photoshop
  </h3>
</header>

<style>
  
  .bar,
  .menu-container {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
  }

  .bar {
    width: 100%;
    justify-content: space-between;
  }

  .icon {
    margin: 0.75rem 1.5rem 0.25rem 0.5rem;
  }

  h3 {
      font-size: 1rem;
      font-weight: 400;
      padding: 0rem 1rem;
      opacity: 0.5;
  }

  .menu {
    display: flex;
    flex: 0 1 auto;
    list-style: none;
    padding: 0 0;
    margin: 0 0;
  }

  .menu li {
   padding: 0rem 0.5rem; 
   margin: 0.25rem 0.25rem;
   font-size: 1.25rem;
   text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
   border: 1px solid transparent;
   border-radius: 3px;
  }

  .menu li:hover {
    background-color: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.25);
  }


</style>