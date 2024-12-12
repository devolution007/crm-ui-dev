<template>
  <div>
    <q-tabs
      v-model="currentImage"
      dense
      align="left"
      :breakpoint="0"
      class=""
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab
        v-for="(image, index) in product.images"
        :key="`product-image-tab-${props.product.id}-${index}`"
        :name="index"
        class="bg-white"
      >
        <q-img
          :src="image"
          width="100px"
          height="100px"
          fit="contain"
          spinner-color="primary"
        />
      </q-tab>
    </q-tabs>

    <q-carousel
      v-model="currentImage"
      swipeable
      animated
      infinite
      arrows
      control-text-color="primary"
      padding
      :height="props.fullSize ? '100%': '400px'"
    >
      <q-carousel-slide
        v-for="(image, index) in product.images"
        :key="`product-image-slide-${props.product.id}-${index}`"
        :name="index"
      >
        <q-img
          :src="image"
          fit="contain"
          height="100%"
          :ratio="props.fullSize ? 1: undefined"
          spinner-color="primary"
        />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ProductInterface } from 'src/models/ProductModel'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  product: ProductInterface
  fullSize?: boolean
}>(), {
  fullSize: false
})

const currentImage = ref(0)
</script>

<style scoped>

</style>
