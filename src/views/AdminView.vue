<script setup>
import { onMounted, ref, watch } from 'vue'
import { useDevStore } from '@/stores/dev.js'
import { useAuthStore } from '@/stores/auth.js'

const fileData = ref()
const products = ref([])
const categories = ref([])
const users = ref([])
const modalData = ref({name: null, description: null, logo: null, category: {id: null}, priority: 0, isEdit: false, id: null})
const categoryData = ref({name: null, description: null, priority: 0})
const userModalData = ref({})
const deleteData = ref(null)
const activeTab = ref('products')

const isNewCategory = ref(false)
const isFormProduct = ref(false)
const isLoading = ref(false)
const isDeleteFormOpen = ref(false)
const isNewUser = ref(false)

const textRules = [
  value => !!value || 'Обязательное поле.',
  value => (value && value.length >= 3) || 'Минимальное количество символов 3',
]

const fetchProducts = async () => {
  try{
    const response = await fetch(`${useDevStore().apiHost}/products`)
    const data = await response.json()
    products.value = data.data
  } catch (error) {
    console.error(`Fetch products error: `,error)
  }
}


const fetchUsers = async () => {
  try{
    const response = await fetch(`${useDevStore().apiHost}/users`)
    const data = await response.json()
    users.value = data
  }
  catch (error) {
    console.error(`Fetch users error: `,error)
  }
}

const fetchCategories = async () => {
  try{
    const response = await fetch(`${useDevStore().apiHost}/categories`)
    const data = await response.json()
    categories.value = data
    categories.value.push({id: 0, name: '+ Новая категория',})
  } catch (error) {
    console.error(`Fetch categories error: `,error)
  }
}

const createProduct = async () => {
  isLoading.value = true
  try{
    const formData = new FormData()
    formData.append('name', modalData.value.name)
    formData.append('description', modalData.value.description)
    formData.append('logo', fileData.value)
    formData.append('priority', modalData.value.priority)
    formData.append('category_id', modalData.value.category.id)

    const response = await fetch(`${useDevStore().apiHost}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
        accept: 'application/json',
      },
      body: formData
    })
  }
  catch (error) {
    console.error(`Creating category error: ${error}`)
  }
  fileData.value = null
  modalData.value = {name: null, description: null, logo: null, category: {id: null}, priority: 0, isEdit: false, id: null}
  await fetchProducts()
  isFormProduct.value = false
  isLoading.value = false
}

const updateProduct = async (productId) => {
  isLoading.value = true
  try{
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('name', modalData.value.name)
    formData.append('description', modalData.value.description)
    formData.append('priority', modalData.value.priority)
    formData.append('category_id', modalData.value.category.id)

    if (fileData.value) {
      formData.append('logo', fileData.value)
    }

    const response = await fetch(`${useDevStore().apiHost}/products/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
        accept: 'application/json',
      },
      body: formData
    })
  }
  catch (error) {
    console.error(`Updating product error: ${error}`)
  }
  fileData.value = null
  modalData.value = {name: null, description: null, logo: null, category: {id: null}, priority: 0, isEdit: false, id: null}
  await fetchProducts()
  isFormProduct.value = false
  isLoading.value = false
}

const deleteProduct = async () => {
  try{
    const response = await fetch(`${useDevStore().apiHost}/products/${deleteData.value.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore().token}`,
        },
      }
    )
  }
  catch (error) {
    console.error(`Deleting product error: ${error}`)
  }

  await fetchProducts()
  isDeleteFormOpen.value = false
  deleteData.value = null
}

const createCategory = async () => {
  isLoading.value = true
  try{
    const response = await fetch(`${useDevStore().apiHost}/categories`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useAuthStore().token}`,
        },
        body: JSON.stringify({
          name: categoryData.value.name,
          description: categoryData.value.description,
          priority: categoryData.value.priority,
        })
      }
    )
    const data = await response.json()
    modalData.value.category.id = data.id
    await fetchCategories()
    isNewCategory.value = false
  }
  catch (error) {
    console.error(`Creating category error: ${error}`)
  }
  isLoading.value = false
}

const updateCategory = async () => {
  isLoading.value = true
  try {
    await fetch(`${useDevStore().apiHost}/categories/${categoryData.value.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore().token}`,
      },
      body: JSON.stringify({
        name: categoryData.value.name,
        description: categoryData.value.description,
        priority: categoryData.value.priority,
      }),
    })
    await fetchCategories()
    isNewCategory.value = false
  } catch (error) {
    console.error('Updating category error:', error)
  }
  isLoading.value = false
}

const deleteCategory = async () => {
  try {
    await fetch(`${useDevStore().apiHost}/categories/${deleteData.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
    })
    await fetchCategories()
    await fetchProducts()
    isDeleteFormOpen.value = false
    deleteData.value = null
  } catch (error) {
    console.error('Deleting category error:', error)
  }
}

const createUser = async () => {
  isLoading.value = true
  try {
    await fetch(`${useDevStore().apiHost}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useAuthStore().token}`,
      },
      body: JSON.stringify({
        login: userModalData.value.login,
        password: userModalData.value.password,
      }),
    })
    await fetchUsers()
    isNewUser.value = false
  } catch (error) {
    console.error('Create user error:', error)
  }
  isLoading.value = false
}

const deleteUser = async () => {
  try {
    await fetch(`${useDevStore().apiHost}/users/${deleteData.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
    })
    await fetchUsers()
    isDeleteFormOpen.value = false
    deleteData.value = null
  } catch (error) {
    console.error('Delete user error:', error)
  }
}


const openUpdateForm = (product) => {
  modalData.value = product
  modalData.value.isEdit = true
  isFormProduct.value = true
}

const openNewForm = () => {
  isFormProduct.value = true
  modalData.value.isEdit = false
}

const openNewUserForm = () => {
  userModalData.value = { login: '', password: '', isEdit: false }
  isNewUser.value = true
}

const openDeleteUser = (user) => {
  isDeleteFormOpen.value = true
  deleteData.value = user
}

const openConfirmDelete = (product) => {
  isDeleteFormOpen.value = true
  deleteData.value = product
}

const openCategoryEdit = (category) => {
  isNewCategory.value = true
  categoryData.value = { ...category, isEdit: true }
}

const openCategoryDelete = (category) => {
  isDeleteFormOpen.value = true
  deleteData.value = category
}

watch(() => modalData.value.category.id, (val) => {
  isNewCategory.value = val === 0
})

onMounted(async () => {
  await fetchProducts()
  await fetchCategories()
  await fetchUsers()
})
</script>

<template>

  <v-tabs v-model="activeTab" background-color="#1e1e1e" grow>
    <v-tab value="products">Продукты</v-tab>
    <v-tab value="categories">Категории</v-tab>
    <v-tab value="users">Пользователи</v-tab>
  </v-tabs>

  <table>
    <thead>
      <tr v-if="activeTab == 'products'">
        <th>logo</th>
        <th>name</th>
        <th>description</th>
        <th>category</th>
        <th>priority</th>
        <th>actions</th>
      </tr>
    <tr v-if="activeTab == 'categories'">
      <th>
        name
      </th>
      <th>
        description
      </th>
      <th>
        priority
      </th>
      <th>
        actions
      </th>
    </tr>
    <tr v-if="activeTab == 'users'">
      <th>
        login
      </th>
      <th>
        actions
      </th>
    </tr>
    </thead>
    <tbody v-if="activeTab == 'categories'">
    <tr v-for="category in categories">
      <td v-if="category.id != 0">
        {{ category.name }}
      </td>
      <td @click="isNewCategory = true" v-else colspan="4" style="text-align: center; cursor: pointer">
        {{ category.name }}
      </td>
      <td v-if="category.id != 0">
        {{ category.description }}
      </td>
      <td v-if="category.id != 0">
        {{ category.priority }}
      </td>
      <td v-if="category.id != 0">
        <v-btn
          icon="mdi-pencil"
          variant="outlined"
          @click="openCategoryEdit(category)"
        >
        </v-btn>
        <v-btn
          icon="mdi-delete"
          variant="outlined"
          @click="openCategoryDelete(category)">
        </v-btn>
      </td>
    </tr>
    </tbody>
    <tbody v-if="activeTab == 'products'">
    <tr v-for="product in products" :key="product.id">
      <td>
        <v-img
          :width="50"
          aspect-ratio="1/1"
          cover
          :src="product.logo"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
          <template v-slot:error>
            <v-img
              class="mx-auto"
              height="300"
              max-width="500"
              src="https://i.imgur.com/Drm3hDc.png"
            ></v-img>
          </template>
        </v-img>
      </td>
      <td>
        {{ product.name }}
      </td>
      <td>
        {{ product.description }}
      </td>
      <td>
        {{ product.category.name }}
      </td>
      <td>
        {{ product.priority }}
      </td>
      <td>
        <v-btn
          icon="mdi-pencil"
          variant="outlined"
          @click="openUpdateForm(product)"
          >
        </v-btn>
        <v-btn
        icon="mdi-delete"
        variant="outlined"
        @click="openConfirmDelete(product)">
        </v-btn>
      </td>
    </tr>
    <tr>
      <td @click="openNewForm" colspan="6" style="text-align: center; cursor: pointer">
        <v-icon icon="mdi-plus-circle"></v-icon> Добавить новый
      </td>
    </tr>
    </tbody>
    <tbody v-if="activeTab == 'users'">
    <tr v-for="user in users">
      <td>
        {{ user.login }}
      </td>
      <td>
        <v-btn
          icon="mdi-delete"
          variant="outlined"
          @click="openDeleteUser(user)">
        </v-btn>
      </td>
    </tr>
    <tr>
      <td @click="openNewUserForm" colspan="2" style="text-align: center; cursor: pointer">
        <v-icon icon="mdi-plus-circle"></v-icon> Добавить новый
      </td>
    </tr>
    </tbody>
  </table>

  <div class="modal-container" v-if="isFormProduct">
    <div class="modal-form">
      <div class="form-item">
        <v-text-field
        label="Название"
        v-model="modalData.name"
        :rules="textRules"
        >
        </v-text-field>
      </div>

      <div class="form-item">
        <v-text-field
          label="Краткое описание"
          v-model="modalData.description"
          :rules="textRules"
        >
        </v-text-field>
      </div>

      <div class="form-item">
        <v-img
          :width="100"
          aspect-ratio="1/1"
          cover
          :src="modalData.logo"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
          <template v-slot:error>
            <v-img
              class="mx-auto"
              height="300"
              max-width="500"
              src="https://i.imgur.com/Drm3hDc.png"
            ></v-img>
          </template>
        </v-img>

        <v-file-upload
          v-model="fileData"
        clearable
        title="Загрузить изображение"
        variant="compact"
          density="compact"
        show-size
        accept="image/svg+xml, image/png, image/jpg"
        ></v-file-upload>
      </div>

      <div class="form-item">
      <v-select
      label="Категория"
      v-model="modalData.category.id"
      control-variant="stacked"
      :items="categories"
      item-value="id"
      item-title="name">
      </v-select>
    </div>

      <div class="form-item">
        <v-number-input
          v-model="modalData.priority"
          :max="10"
          :min="0"
          :reverse="false"
          controlVariant="stacked"
          label="Приоритет"
          :hideInput="false"
          :inset="false"
        ></v-number-input>
    </div>

      <div class="form-item">
        <v-btn text @click="isFormProduct = false">Отмена</v-btn>
        <v-btn v-if="modalData.isEdit" color="primary" @click="updateProduct(modalData.id)" :loading="isLoading" >Обновить</v-btn>
        <v-btn v-else color="primary" @click="createProduct" :loading="isLoading" >Сохранить</v-btn>
      </div>
    </div>
  </div>

  <v-dialog v-model="isNewCategory" max-width="340">
    <v-card>
      <v-card-title v-if="!categoryData.isEdit">Создание новой категории</v-card-title>
      <v-card-title v-else>Изменение категории</v-card-title>
      <v-card-text>
        <v-text-field v-model="categoryData.name" label="Название категории"></v-text-field>
        <v-text-field v-model="categoryData.description" label="Краткое описание"></v-text-field>
        <v-number-input
          v-model="categoryData.priority"
          :max="10"
          :min="0"
          :reverse="false"
          controlVariant="stacked"
          label="Приоритет"
          :hideInput="false"
          :inset="false"
        ></v-number-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="isNewCategory = false">Отмена</v-btn>
        <v-btn v-if="!categoryData.isEdit" color="primary" @click="createCategory" :loading="isLoading" >Сохранить</v-btn>
        <v-btn v-else color="primary" @click="updateCategory" :loading="isLoading" >Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-if="isDeleteFormOpen" v-model="deleteData" max-width="640">
    <v-card>
      <v-card-title>Вы уверены что хотите удалить?</v-card-title>
      <v-card-text v-if="activeTab == 'products'">
        <v-img
          :width="100"
          aspect-ratio="1/1"
          cover
          :src="deleteData.logo"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
          <template v-slot:error>
            <v-img
              class="mx-auto"
              height="300"
              max-width="500"
              src="https://i.imgur.com/Drm3hDc.png"
            ></v-img>
          </template>
        </v-img>
        <span> {{ deleteData.name }} </span>
      </v-card-text>
      <v-card-text v-if="activeTab == 'categories'">
        Категория: <span> {{ deleteData.name }} </span>
      </v-card-text>
      <v-card-text v-if="activeTab == 'users'">
        Пользователь: <span> {{ deleteData.login }} </span>
      </v-card-text>
      <v-card-actions v-if="activeTab == 'products'">
        <v-spacer />
        <v-btn text @click="isDeleteFormOpen = false">Отмена</v-btn>
        <v-btn color="red" @click="deleteProduct" :loading="isLoading" >Удалить</v-btn>
      </v-card-actions>

      <v-card-actions v-if="activeTab == 'categories'">
        <v-spacer />
        <v-btn text @click="isDeleteFormOpen = false">Отмена</v-btn>
        <v-btn color="red" @click="deleteCategory" :loading="isLoading" >Удалить</v-btn>
      </v-card-actions>

      <v-card-actions v-if="activeTab == 'users'">
        <v-spacer />
        <v-btn text @click="isDeleteFormOpen = false">Отмена</v-btn>
        <v-btn color="red" @click="deleteUser" :loading="isLoading" >Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isNewUser" max-width="340">
    <v-card>
      <v-card-title>Создание нового пользователя</v-card-title>
      <v-card-text>
        <v-text-field v-model="userModalData.login" label="Логин" />
        <v-text-field v-model="userModalData.password" label="Пароль" type="password" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="isNewUser = false">Отмена</v-btn>
        <v-btn color="primary" @click="createUser" :loading="isLoading">Создать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;


  th, td {
    border: 1px solid #444;
    padding: 10px;
  }

  th {
    background-color: #111;
    text-align: left;
  }
}

 .modal-container {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background-color: #1e1e1e;
   color: #fff;
   padding: 2rem;
   border-radius: 16px;
   box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
   max-width: 65vw;
   width: 90%;
   z-index: 1000;
 }

.modal-form {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  overflow-y: scroll;
}

.form-item {
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>

