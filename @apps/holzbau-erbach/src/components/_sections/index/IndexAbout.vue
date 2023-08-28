<script lang="ts" setup>
import DotsLightBackground from '~/assets/images/bg_dots_light.png'
</script>

<template>
  <section class="bg-white pt-15 md:pt-15" :style="{ backgroundImage: `url(${DotsLightBackground})` }">
    <div class="py-8 container md:py-32">
      <div class="flex flex-col gap-12 md:(flex-row)">
        <div class="flex flex-1 flex-col">
          <div class="flex items-center gap-2 xl:text-xl">
            <div class="h-4 w-1 bg-primary -skew-x-8" />
            <div class="text-uppercase" v-text="`Über Uns`" />
          </div>
          <h2 class="mb-4 text-4xl tracking-wide uppercase">
            Wer <span class="font-bold">wir</span> sind
          </h2>
          <p class="leading-relaxed md:text-lg">
            Wir sind eine dynamische <span class="font-semibold text-primary">Holz- und Montagebaufirma</span> mit einer beeindruckenden Erfolgsgeschichte.
            Mit unserem engagierten Team aus erfahrenen Handwerkern und unserer Leidenschaft für qualitativ hochwertige Arbeit
            setzen wir anspruchsvolle Bauprojekte um und erfüllen die individuellen Bedürfnisse unserer Kunden.
            Kundenzufriedenheit steht bei uns an erster Stelle, und wir streben stets danach, die Erwartungen zu übertreffen.
          </p>
          <div class="mt-10 flex items-end gap-4 border p-5 md:gap-8">
            <div class="text-80px font-bold leading-60px text-transparent text-stroke-1 text-stroke-black md:(text-150px leading-120px)">
              30
            </div>
            <div class="border-l pl-4 text-lg font-bold leading-tight uppercase md:(pl-8 text-xl leading-normal)">
              Jahre Erfahrung <br />mit Holz
            </div>
          </div>
        </div>
        <div class="flex flex-1 flex-col">
          <div class="grid-cols-2 hidden gap-4 lg:grid">
            <div class="h-120 border bg-cover bg-center" style="background-image: URL(https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80);" />
            <div class="mt-20 h-120 border bg-cover bg-center" style="background-image: URL(https://images.unsplash.com/photo-1558661091-5cc1b64d0dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80);" />
          </div>
          <div class="grid grid-cols-1 gap-4 lg:hidden">
            <div class="ml-10 h-30 skew-x-8 border bg-cover bg-center md:h-60 md:skew-x-12" style="background-image: URL(https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80);" />
            <div class="mr-10 h-30 border bg-cover bg-center md:h-60 -skew-x-8 md:-skew-x-12" style="background-image: URL(https://images.unsplash.com/photo-1558661091-5cc1b64d0dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80);" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
