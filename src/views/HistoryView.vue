<template>
  <div class="glass-container">
    <div class="header-row">
      <h1>History</h1>
      <div class="header-actions">
         <button v-if="history.length > 0" @click="clearHistory" class="btn-clear text-btn">Clear All</button>
         <button @click="router.push('/')" class="btn-icon btn-back" aria-label="Back">
            <span class="material-symbols-rounded" style="font-size: 2rem;">chevron_backward</span>
         </button>
      </div>
    </div>

    <div v-if="history.length > 0">
      <TransitionGroup name="swipe" tag="ul" class="history-list full-history">
        <li v-for="draw in history" :key="draw.id" class="history-item-container">
          <div class="history-main-row">
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
            
            <div class="row-actions">
              <button @click="startEditing(draw)" class="btn-icon" aria-label="Edit note">
                 <span class="material-symbols-rounded icon-md">edit</span>
              </button>
              <button 
                @click="removeHistoryItem(draw.id)" 
                class="btn-remove" 
                :disabled="editingId === draw.id"
                :class="{ 'disabled': editingId === draw.id }"
                aria-label="Remove item"
              >
                <span class="material-symbols-rounded icon-md">delete</span>
              </button>
            </div>
          </div>
          
          <div class="comment-section" v-if="editingId === draw.id || draw.comment">
             <div v-if="editingId === draw.id" class="edit-box">
                <div class="input-wrapper">
                  <input 
                    v-model="tempComment" 
                    placeholder="Memo..." 
                    class="glass-input"
                    @keyup.enter="saveComment(draw.id)"
                  />
                  <button v-if="tempComment" @click="tempComment = ''" class="btn-clear-input" aria-label="Clear text">
                    <span class="material-symbols-rounded">clear</span>
                  </button>
                </div>
                <button @click="saveComment(draw.id)" class="btn-save">
                  <span class="material-symbols-rounded icon-md">save</span>
                </button>
                <button @click="cancelEdit(draw.id)" class="btn-save">
                  <span class="material-symbols-rounded icon-md">close</span>
                </button>
             </div>
             <div v-else class="view-box" @click="startEditing(draw)">
                <span class="comment-text">{{ draw.comment }}</span>
             </div>
           </div>
        </li>
      </TransitionGroup>
    </div>
    
    <div v-else class="empty-state">
      <p>No history yet.</p>
    </div>
  </div>
</template>

<script setup>
import { useLotteryStore } from '@/stores/lottery'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const store = useLotteryStore()
const { history } = storeToRefs(store)
const { removeHistoryItem, clearHistory, updateComment } = store

const editingId = ref(null)
const tempComment = ref('')

const startEditing = (draw) => {
  editingId.value = draw.id
  tempComment.value = draw.comment || ''
}

const saveComment = (id) => {
  updateComment(id, tempComment.value)
  editingId.value = null
  tempComment.value = ''
}

const cancelEdit = (id) => {
  editingId.value = null
  tempComment.value = ''
}
</script>

<style scoped>
.glass-container{
  max-height: 80vh;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 0.75rem 0;
}

.header-row h1 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.history-item-container {
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  color: white;
}

.history-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-actions {
  display: flex;
  align-items: center;
}

.comment-section {
  margin-top: 0.5rem;
  padding-top: 0.2rem;
  font-size: 0.9rem;
}

.comment-text {
  color: white;
  margin-left: 5px;
  cursor: pointer;
  font-style: italic;
  opacity: 0.9;
}

.edit-box {
  display: flex;
  gap: 5px;
  margin-top: 5px;
  align-items: center;
  width: 100%;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.glass-input {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 30px 5px 10px; /* Right padding for the button */
  border-radius: 5px;
  width: 100%;
  font-family: inherit;
  box-sizing: border-box;
}

.btn-clear-input {
  position: absolute;
  right: 5px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  span {
    font-size: 1rem;
  }

  &:hover {
    color: white;
  }
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.glass-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.3);
}

.btn-save {
  background: var(--ball-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 3px 8px;
    @media (max-width: 480px) {
      padding: 5px 10px;
  }
}

.history-item-container:hover {
  background: rgba(255, 255, 255, 0.15);
}


.empty-state {
  color: white;
  opacity: 0.8;
  padding: 2rem;
}

.full-history{
  max-height: 65vh;
}

/* Swipe Animation */
.swipe-leave-active {
  transition: all 0.4s ease-out;
  position: absolute;
  width: 100%; /* Ensure it doesn't shrink when absolute */
  /* Need to handle box-sizing if padding/border affects width, 
     but history-item-container usually fits in the parent ul width.
     The parent ul has padding/margin? 
     Let's check parent styles or assumptions. 
     .history-list is a ul.
  */
}

.swipe-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.swipe-move {
  transition: all 0.4s ease;
}
</style>

