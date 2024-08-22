<template>
  <div class="arrow-wrapper">
      <div class="arrow-item" style="animation-delay: .5s;">
          <img src="/images/arrow.png" alt="" />
      </div>
      <div class="arrow-item" style="animation-delay: 1s;">
          <img src="/images/arrow.png" alt="" />
      </div>
      <div class="arrow-item" style="animation-delay: 1.5s;">
          <img src="/images/arrow.png" alt="" />
      </div>
      <div class="arrow-item" style="animation-delay: 2s;">
          <img src="/images/arrow.png" alt="" />
      </div>
      <div class="arrow-item" style="animation-delay: 2.5s;">
          <img src="/images/arrow.png" alt="" />
      </div>
      <div class="arrow-item" style="animation-delay: 3s;">
          <img src="/images/arrow.png" alt="" />
      </div>
  </div>
</template>
<style scoped lang="scss">
.arrow-wrapper {
  display: flex;
  align-items: center;
  .arrow-item {
      width: 1.2rem;
      height: 2rem;
      margin: 0 .3rem;
      position: relative;
      top: -2.6rem;
      animation-name: shameFlow;
      animation-duration: 3s;
      animation-iteration-count: infinite;
      img {
          height: 100%;
          object-fit: contain;
      }
  }

  @keyframes shameFlow {
      0% { opacity: 1; }
      50% { opacity: .2; }
      100% { opacity: 1; }
  }
}
</style>