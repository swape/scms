<script>
// TODO: populate this menu with
// - logo and project name
// - manual / auto populate items
// - optional extra buttons
// - colors
</script>

<header class="header">
  <div>
    <div>ICON</div>
    <div>extra buttons</div>
    <div>
      <button
        popovertarget="main-menu"
        popovertargetaction="toggle"
        class="menu-button">Menu</button>
    </div>
  </div>
  <nav id="main-menu" popover>
    <div class="main-menu">some content here</div>
  </nav>
</header>

<style>
.header {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 16px;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menu-button {
    appearance: none;
    border: 1px solid white;
    border-radius: 16px;
    padding: 6px 12px;
    background-color: transparent;
    color: white;
    cursor: pointer;
    corner-shape: squircle;
  }
}

::backdrop {
  backdrop-filter: blur(3px);
  margin-top: 50px;
}

[popover] {
  .main-menu {
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 50px;
    right: 0;
    left: 0;
    min-height: 50svh;
    color: white;
    padding: 20px;
  }
}
</style>
