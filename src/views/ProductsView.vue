<script setup>
import { onMounted, ref } from 'vue'
  import { useDevStore } from '@/stores/dev.js'

  const categories = ref([])
  const products = ref([])

  const fetchCategories = async () => {
    try{
      const response = await fetch(`${useDevStore().apiHost}/categories`)
      const data = await response.json()
      categories.value = data
    } catch (error) {
      console.error(`Fetch categories error: `,error)
    }
  }

  const fetchProducts = async () => {
    for (const item of categories.value) {
      try{
        const response = await fetch(`${useDevStore().apiHost}/products/${item.id}`)
        const data = await response.json()
        products.value[item.id] = data
      }
      catch(error) {
        console.error(`Fetch products error: `,error)
      }
    }
  }

  onMounted(async () => {
    await fetchCategories()
    await fetchProducts()
  })
</script>

<template>
  <div class="container">
    <div class="categories">
      <template v-for="category in categories" v-bind:key="category.id">
      <div v-if="products[category.id].length > 0" class="category">
        <h3>{{ category.name }}</h3>
        <h5>{{ category.description }}</h5>

        <div class="product-container">
          <div
            v-for="product in products[category.id]"
            :key="product.id"
            class="product-row"
          >
            <v-img
              :src="product.logo"
              class="product-icon"
              height="48"
              width="48"
              cover
            ></v-img>

            <div class="product-text">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-description">{{ product.description }}</div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>


<style scoped>
.container {
  padding: 24px;
  color: #ffffff;
  min-height: 100vh;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-container {
  display: flex;
}

.category h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #fff;
}

.category h5 {
  margin: 4px 0 16px;
  font-weight: 400;
  color: #ccc;
}

.product {
  background-color: #1e1e1e;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.product-row {
  display: flex;
  padding: 1rem;
}

.product-image {
  border-bottom: 1px solid #333;
}

.product-info {
  padding: 16px;
}

.product-info h4 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.product-text{
  padding-left: .5rem;
}

.product-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #bbb;
}

</style>
