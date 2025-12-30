<template>
  <div class="glass-container">
    <h1>Lucky Lottery</h1>

    <div v-if="currentDraw" class="lottery-display">
      <!-- View Mode -->
      <template v-if="!isEditing">
        <div v-for="num in currentDraw.numbers" :key="num" class="ball">
          {{ num }}
        </div>
        <div class="ball special">
          {{ currentDraw.special }}
        </div>
      </template>
      
      <!-- Edit Mode -->
      <template v-else>
         <input 
            v-for="(n, index) in tempNumbers" 
            :key="index"
            v-model.number="tempNumbers[index]"
            type="number" 
            class="ball-input"
            min="1" max="38"
         />
         <input 
            v-model.number="tempSpecial"
            type="number" 
            class="ball-input special"
            min="1" max="8"
         />
      </template>
    </div>
    
    <div v-if="errorMessage" class="error-msg">
      {{ errorMessage }}
    </div>

    <div v-else-if="!currentDraw" class="lottery-display" style="min-height: 66px; align-items: center; color: white;">
      <p>Press Roll</p>
    </div>

    <div class="controls">
      <!-- Edit Mode Controls -->
      <div v-if="isEditing" class="confirm-controls">
        <button @click="cancelEdit" class="btn-secondary">Cancel</button>
        <button @click="saveEdit" class="btn-primary btn-save">Save</button>
      </div>
      
      <!-- Show different buttons based on state -->
      <div v-else-if="currentDraw && !isConfirmed" class="confirm-controls">
        <button @click="startEditing" class="btn-icon" aria-label="Edit lottery">
          <span class="material-symbols-rounded icon-big">edit</span>
        </button>
        <button @click="roll" class="btn-secondary">Roll Again</button>
         <button @click="handleConfirmDraw" class="btn-primary btn-confirm">Confirm</button>
      </div>
      <button v-else @click="roll" class="btn-primary">Roll!</button>
    </div>

    <div class="history-section" v-if="history.length > 0">
      <div class="history-header">
        <h3>History</h3>
        <RouterLink to="/history" class="link">View All</RouterLink>
      </div>
      <TransitionGroup name="swipe" tag="ul" class="history-list" :class="{ 'no-leave-animation': isAddingToHistory }">
        <!-- Only show first 5 items -->
        <li v-for="draw in history.slice(0, 5)" :key="draw.id" class="history-item">
          <div class="history-info">
             <div class="history-numbers">
              <div v-for="n in draw.numbers" class="small-ball">
                {{ n }}
              </div>
              <div class="small-ball special">
                {{ draw.special }}
              </div>
            </div>
            <span class="timestamp">{{ draw.date }}</span>
          </div>
          <button @click="removeHistoryItem(draw.id)" class="btn-remove" aria-label="Remove item">
          <span class="material-symbols-rounded icon-md">delete</span>
        </button>
        </li>
      </TransitionGroup>
    </div>

    <br>
    <a href="https://www.taiwanlottery.com/today_last_number" target="_blank"
      class="link">Check Official Results</a>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

const store = useLotteryStore()
const { currentDraw, history, isConfirmed } = storeToRefs(store)
const { roll, confirmDraw, removeHistoryItem, loadHistory } = store

const isEditing = ref(false)
const tempNumbers = ref([])
const tempSpecial = ref(null)
const errorMessage = ref('')
const isAddingToHistory = ref(false)

const handleConfirmDraw = async () => {
  isAddingToHistory.value = true
  confirmDraw()
  await nextTick()
  // Reset flag after a short delay to allow DOM update
  setTimeout(() => {
    isAddingToHistory.value = false
  }, 50)
}

const startEditing = () => {
  if (currentDraw.value) {
    tempNumbers.value = [...currentDraw.value.numbers]
    tempSpecial.value = currentDraw.value.special
    isEditing.value = true
    errorMessage.value = ''
  }
}

const cancelEdit = () => {
  isEditing.value = false
  errorMessage.value = ''
}

const saveEdit = () => {
  // Validation
  const nums = tempNumbers.value
  const special = tempSpecial.value
  
  // Check range
  if (nums.some(n => n < 1 || n > 38)) {
    errorMessage.value = "Numbers must be between 1 and 38"
    return
  }
  if (special < 1 || special > 8) {
    errorMessage.value = "Special number must be between 1 and 8"
    return
  }
  
  // Check unique
  const uniqueNums = new Set(nums)
  if (uniqueNums.size !== 6) {
    errorMessage.value = "Numbers must be unique"
    return
  }
  
  store.updateCurrentDraw(nums, special)
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(() => {
  loadHistory()
})
</script>


<style scoped>
.history-info {
  flex-grow: 1;
}

.error-msg {
  color: #ffcccc;
  background: rgba(255, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
}

/* Swipe Animation */
.swipe-leave-active {
  transition: all 0.4s ease-out;
  position: absolute;
  width: 100%;
  overflow: hidden;
}

.swipe-leave-to {
  transform: translateX(-100%);
  opacity: 0;
  overflow: hidden;
}

.swipe-move {
  transition: all 0.4s ease;
}

/* Disable leave animation when adding to history */
.no-leave-animation .swipe-leave-active {
  transition: none;
  position: static;
}

.no-leave-animation .swipe-leave-to {
  transform: none;
  opacity: 1;
}
</style>
